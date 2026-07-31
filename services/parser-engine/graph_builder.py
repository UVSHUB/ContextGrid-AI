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
        calls = parsed_data.get("calls", [])

        # Update in-memory fallback store
        memory_nodes[file_path] = {
            "path": file_path,
            "type": "File",
            "functions": [f["name"] for f in functions],
            "imports": [imp.get("module") for imp in imports if imp.get("module")]
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
        Traverses Neo4j graph (or in-memory graph) to find files dependent on file_path up to max_depth.
        """
        if not self.driver:
            # Traversal on in-memory store
            dependents = []
            visited = set()
            queue = [(file_path, 0)]

            while queue:
                current_file, depth = queue.pop(0)
                if current_file in visited or depth > max_depth:
                    continue
                visited.add(current_file)

                if depth > 0:
                    dependents.append({
                        "affectedFile": current_file,
                        "depth": depth
                    })

                # Find files that import current_file
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
        Returns nodes and edges of the codebase dependency graph.
        """
        if not self.driver:
            nodes = []
            for k, v in memory_nodes.items():
                nodes.append({"id": k, "label": k.split("/")[-1], "path": k, "type": "File"})
            edges = []
            for idx, e in enumerate(memory_edges):
                edges.append({"id": f"e-{idx}", "source": e["source"], "target": e["target"], "label": e["type"]})
            return {"nodes": nodes, "edges": edges}

        cypher_query = """
        MATCH (n:File)
        OPTIONAL MATCH (n)-[r:IMPORTS]->(m:File)
        RETURN n.path AS source, m.path AS target
        """
        nodes_set = set()
        edges = []
        with self.driver.session() as session:
            res = session.run(cypher_query)
            idx = 0
            for record in res:
                src = record["source"]
                tgt = record["target"]
                if src:
                    nodes_set.add(src)
                if tgt:
                    nodes_set.add(tgt)
                if src and tgt:
                    idx += 1
                    edges.append({"id": f"e-{idx}", "source": src, "target": tgt, "label": "IMPORTS"})

        nodes = [{"id": p, "label": p.split("/")[-1], "path": p, "type": "File"} for p in nodes_set]
        return {"nodes": nodes, "edges": edges}

graph_service = Neo4jGraphService()
