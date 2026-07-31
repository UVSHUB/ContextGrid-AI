from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import glob

from parser import parse_code_file
from graph_builder import graph_service
from diff_parser import extract_ast_diff

app = FastAPI(
    title="ContextGrid AI - AST Parser Engine",
    version="2.0.0",
    description="Tree-sitter AST parser, AST Symbol Delta extractor, and Neo4j graph dependency engine"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ParseFileRequest(BaseModel):
    file_path: str
    content: str

class ParseWorkspaceRequest(BaseModel):
    root_directory: str
    extensions: Optional[List[str]] = [".ts", ".tsx", ".js", ".jsx"]

class ImpactQueryRequest(BaseModel):
    changed_file: str
    max_depth: Optional[int] = 4

class ASTDiffRequest(BaseModel):
    file_path: str
    old_code: str
    new_code: str

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "ContextGrid Parser Engine (v2.0 AST Delta Active)",
        "neo4j_connected": graph_service.driver is not None
    }

@app.post("/parse-file")
def parse_file_endpoint(req: ParseFileRequest):
    if not req.content or not req.file_path:
        raise HTTPException(status_code=400, detail="file_path and content are required")

    parsed_data = parse_code_file(req.file_path, req.content)
    ingest_res = graph_service.ingest_parsed_ast(parsed_data)

    return {
        "success": True,
        "parsed": parsed_data,
        "graph_ingest": ingest_res
    }

@app.post("/parse-ast-diff")
def parse_ast_diff_endpoint(req: ASTDiffRequest):
    ast_delta = extract_ast_diff(req.old_code, req.new_code, req.file_path)
    return {
        "success": True,
        "ast_delta": ast_delta
    }

@app.post("/parse-workspace")
def parse_workspace_endpoint(req: ParseWorkspaceRequest):
    if not os.path.exists(req.root_directory):
        raise HTTPException(status_code=404, detail="Directory not found")

    parsed_files = []
    for ext in req.extensions:
        pattern = os.path.join(req.root_directory, f"**/*{ext}")
        for filepath in glob.glob(pattern, recursive=True):
            if "node_modules" in filepath or ".next" in filepath or ".git" in filepath:
                continue
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    code_content = f.read()
                ast_data = parse_code_file(filepath, code_content)
                graph_service.ingest_parsed_ast(ast_data)
                parsed_files.append(filepath)
            except Exception as e:
                print(f"[ParserEngine] Error reading {filepath}: {e}")

    return {
        "success": True,
        "parsed_count": len(parsed_files),
        "files": parsed_files
    }

@app.get("/graph")
def get_graph_endpoint():
    return graph_service.get_full_graph()

@app.post("/impact-query")
def impact_query_endpoint(req: ImpactQueryRequest):
    dependents = graph_service.get_downstream_dependents(req.changed_file, req.max_depth or 4)
    return {
        "changed_file": req.changed_file,
        "dependents": dependents,
        "affected_count": len(dependents)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
