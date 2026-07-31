from typing import Dict, List, Any
from parser import parse_code_file
from graph_builder import graph_service

def index_scip_symbols(file_path: str, source_code: str) -> Dict[str, Any]:
    """
    Parses code into SCIP (Sourcegraph Code Intelligence Protocol) symbol definitions and occurrences.
    Persists :Symbol nodes into Neo4j graph with DEFINES and REFERENCES relationships.
    """
    parsed = parse_code_file(file_path, source_code)
    functions = parsed.get("functions", [])
    imports = parsed.get("imports", [])

    scip_symbols = []

    # Process Symbol Definitions
    for fn in functions:
        sym_id = f"scip-ts://{file_path}#{fn['name']}()"
        scip_symbols.append({
            "id": sym_id,
            "name": fn["name"],
            "file": file_path,
            "line": fn["start_line"],
            "kind": "Function",
            "relationship": "DEFINES"
        })

    # Process Symbol References
    for imp in imports:
        mod = imp.get("module")
        if mod:
            sym_id = f"scip-ts://{mod}#module"
            scip_symbols.append({
                "id": sym_id,
                "name": mod,
                "file": file_path,
                "line": imp.get("start_line", 1),
                "kind": "ImportReference",
                "relationship": "REFERENCES"
            })

    # Ingest into Neo4j if available
    if graph_service.driver:
        cypher_scip = """
        MATCH (f:File {path: $file_path})
        MERGE (s:Symbol {id: $sym_id})
        SET s.name = $name, s.kind = $kind, s.line = $line, s.file = $file_path
        WITH f, s
        CALL apoc.do.when($rel = 'DEFINES', 
          'MERGE (f)-[:DEFINES_SYMBOL]->(s) RETURN s', 
          'MERGE (f)-[:REFERENCES_SYMBOL]->(s) RETURN s', 
          {f:f, s:s, rel:$rel}) YIELD value
        RETURN count(s)
        """
        try:
            with graph_service.driver.session() as session:
                for sym in scip_symbols:
                    session.run(cypher_scip, file_path=file_path, sym_id=sym["id"], name=sym["name"], kind=sym["kind"], line=sym["line"], rel=sym["relationship"])
        except Exception as e:
            print(f"[SCIP Indexer] Neo4j SCIP ingestion warning: {e}")

    return {
        "file_path": file_path,
        "scip_symbols_count": len(scip_symbols),
        "symbols": scip_symbols
    }
