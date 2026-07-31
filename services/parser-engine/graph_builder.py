import os
from typing import Dict, List, Any

# In-Memory Graph Fallback store when Neo4j is not connected
memory_nodes: Dict[str, Dict[str, Any]] = {}
memory_edges: List[Dict[str, Any]] = []

class Neo4jGraphService:
    def __init__(self):
        self.uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        self.user = os.getenv("NEO4J_USER", "neo4j")
        self.password = os.getenv("NEO4J_PASSWORD", "password")
        self.driver = None
        self.connect()

    def connect(self):
        try:
            from neo4j import GraphDatabase
            self.driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))
            self.driver.verify_connectivity()
            print("[GraphService] Connected to Neo4j database successfully.")
        except Exception as e:
            print(f"[GraphService] Neo4j connection warning: {e}. Using resilient In-Memory Graph engine.")
            self.driver = None

    def close(self):
        if self.driver:
            self.driver.close()

    def ingest_parsed_ast(self, parsed_data: Dict[str, Any]):
        file_path = parsed_data.get("file_path")
        functions = parsed_data.get("functions", [])
        imports = parsed_data.get("imports", [])

        fn_names = [f["name"] for f in functions if "name" in f]
        imp_names = [imp.get("module") for imp in imports if imp.get("module")]

        # Update in-memory fallback store
        memory_nodes[file_path] = {
            "path": file_path,
            "type": "File",
            "functions": fn_names,
            "imports": imp_names
        }

        for imp in imports:
            mod = imp.get("module")
            if mod:
                memory_edges.append({
                    "source": file_path,
                    "target": mod,
                    "type": "IMPORTS"
                })

        if not self.driver:
            return {"status": "success", "mode": "in-memory", "file": file_path}

        # Cypher Ingestion into Neo4j
        cypher_file = """
        MERGE (f:File {path: $file_path})
        SET f.updatedAt = timestamp()
        """
        
        cypher_function = """
        MATCH (f:File {path: $file_path})
        MERGE (func:Function {name: $name, file: $file_path})
        SET func.line = $line
        MERGE (f)-[:DEFINES]->(func)
        """

        cypher_import = """
        MERGE (f1:File {path: $source_path})
        MERGE (f2:File {path: $target_path})
        MERGE (f1)-[:IMPORTS]->(f2)
        """

        with self.driver.session() as session:
            session.run(cypher_file, file_path=file_path)

            for fn in functions:
                session.run(cypher_function, file_path=file_path, name=fn["name"], line=fn["start_line"])

            for imp in imports:
                mod = imp.get("module")
                if mod:
                    session.run(cypher_import, source_path=file_path, target_path=mod)

        return {"status": "success", "mode": "neo4j", "file": file_path}

    def get_downstream_dependents(self, file_path: str, max_depth: int = 4) -> List[Dict[str, Any]]:
        """
        Traverses graph store to find files dependent on file_path up to max_depth.
        """
        if not self.driver:
            dependents = []
            visited = set()
            queue = [(file_path, 0)]

            while queue:
                current_file, depth = queue.pop(0)
                if current_file in visited or depth > max_depth:
                    continue
                visited.add(current_file)

                if depth > 0:
                    node_data = memory_nodes.get(current_file, {})
                    dependents.append({
                        "affectedFile": current_file,
                        "depth": depth,
                        "functions": node_data.get("functions", [])
                    })

                for src_file, node in memory_nodes.items():
                    if current_file in node.get("imports", []) or any(current_file in imp for imp in node.get("imports", [])):
                        if src_file not in visited:
                            queue.append((src_file, depth + 1))

            return dependents

        cypher_query = """
        MATCH path = (changed:File {path: $changed_file})<-[:IMPORTS*1..4]-(dependent:File)
        RETURN dependent.path AS affectedFile, length(path) AS depth
        """

        results = []
        with self.driver.session() as session:
            res = session.run(cypher_query, changed_file=file_path)
            for record in res:
                results.append({
                    "affectedFile": record["affectedFile"],
                    "depth": record["depth"]
                })
        return results

    def get_full_graph(self) -> Dict[str, Any]:
        """
        Returns nodes (with extracted AST functions) and edges of the dependency graph.
        """
        if not self.driver:
            nodes = []
            for k, v in memory_nodes.items():
                nodes.append({
                    "id": k,
                    "label": k.split("/")[-1],
                    "path": k,
                    "type": "File",
                    "functions": v.get("functions", []),
                    "imports": v.get("imports", [])
                })
            edges = []
            for idx, e in enumerate(memory_edges):
                edges.append({
                    "id": f"e-{idx}",
                    "source": e["source"],
                    "target": e["target"],
                    "label": e["type"]
                })
            return {"nodes": nodes, "edges": edges}

        cypher_query = """
        MATCH (n:File)
        OPTIONAL MATCH (n)-[:DEFINES]->(fn:Function)
        OPTIONAL MATCH (n)-[r:IMPORTS]->(m:File)
        RETURN n.path AS source, collect(DISTINCT fn.name) AS functions, m.path AS target
        """
        nodes_dict = {}
        edges = []
        with self.driver.session() as session:
            res = session.run(cypher_query)
            idx = 0
            for record in res:
                src = record["source"]
                tgt = record["target"]
                funcs = record["functions"] or []
                if src and src not in nodes_dict:
                    nodes_dict[src] = {"id": src, "label": src.split("/")[-1], "path": src, "type": "File", "functions": funcs}
                if tgt and tgt not in nodes_dict:
                    nodes_dict[tgt] = {"id": tgt, "label": tgt.split("/")[-1], "path": tgt, "type": "File", "functions": []}
                if src and tgt:
                    idx += 1
                    edges.append({"id": f"e-{idx}", "source": src, "target": tgt, "label": "IMPORTS"})

        return {"nodes": list(nodes_dict.values()), "edges": edges}

graph_service = Neo4jGraphService()
