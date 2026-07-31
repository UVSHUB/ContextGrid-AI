import re
from typing import Dict, List, Any
from parser import parse_code_file

def extract_ast_diff(old_code: str, new_code: str, file_path: str) -> Dict[str, Any]:
    """
    Compares old code AST vs new code AST using Tree-sitter symbol parsing.
    Returns structured AST Delta JSON.
    """
    old_ast = parse_code_file(file_path, old_code)
    new_ast = parse_code_file(file_path, new_code)

    old_funcs = {f["name"]: f for f in old_ast.get("functions", [])}
    new_funcs = {f["name"]: f for f in new_ast.get("functions", [])}

    old_imports = {i["raw"]: i for i in old_ast.get("imports", [])}
    new_imports = {i["raw"]: i for i in new_ast.get("imports", [])}

    modified_functions = []
    modified_exports = []
    broken_imports = []

    # Detect function additions/mutations/deletions
    for fn_name, new_fn in new_funcs.items():
        if fn_name not in old_funcs:
            modified_functions.append({
                "symbol": fn_name,
                "change_type": "FUNCTION_ADDED",
                "line": new_fn.get("start_line", 1)
            })
        else:
            # Check line length or snippet mutation
            old_fn = old_funcs[fn_name]
            if (new_fn.get("end_line", 0) - new_fn.get("start_line", 0)) != (old_fn.get("end_line", 0) - old_fn.get("start_line", 0)):
                modified_functions.append({
                    "symbol": fn_name,
                    "change_type": "SIGNATURE_MUTATION",
                    "line": new_fn.get("start_line", 1)
                })

    for fn_name in old_funcs:
        if fn_name not in new_funcs:
            modified_functions.append({
                "symbol": fn_name,
                "change_type": "FUNCTION_REMOVED",
                "line": 1
            })

    # Detect import path breakages
    for imp_raw in old_imports:
        if imp_raw not in new_imports:
            broken_imports.append({
                "raw_import": imp_raw,
                "change_type": "IMPORT_REMOVED_OR_MOVED"
            })

    changed_symbol = modified_functions[0]["symbol"] if modified_functions else file_path.split("/")[-1]
    change_type = modified_functions[0]["change_type"] if modified_functions else "FILE_MUTATION"

    return {
        "file": file_path,
        "changed_symbol": changed_symbol,
        "change_type": change_type,
        "modified_functions": modified_functions,
        "broken_imports": broken_imports,
        "summary": f"AST Delta: {len(modified_functions)} function mutation(s), {len(broken_imports)} import path change(s)."
    }
