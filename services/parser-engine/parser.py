import os
import re
from typing import Dict, List, Any

# Try importing tree-sitter; provide regex fallback if tree-sitter native dynamic library fails
TREE_SITTER_AVAILABLE = False
try:
    import tree_sitter_javascript as tsjs
    from tree_sitter import Language, Parser
    JS_LANGUAGE = Language(tsjs.language())
    ts_parser = Parser(JS_LANGUAGE)
    TREE_SITTER_AVAILABLE = True
except Exception as e:
    print(f"[ParserEngine] Warning: Tree-sitter native binding initialization failed: {e}. Falling back to AST regex parser.")

def parse_code_file(file_path: str, source_code: str) -> Dict[str, Any]:
    """
    Parses JavaScript/TypeScript code and extracts functions, exports, and imports.
    Uses Tree-sitter AST parser if available, otherwise fallback regex parser.
    """
    if TREE_SITTER_AVAILABLE:
        try:
            return _parse_with_treesitter(file_path, source_code)
        except Exception as e:
            print(f"[ParserEngine] Tree-sitter parse error on {file_path}: {e}. Using fallback.")
            return _parse_with_regex(file_path, source_code)
    else:
        return _parse_with_regex(file_path, source_code)

def _parse_with_treesitter(file_path: str, source_code: str) -> Dict[str, Any]:
    tree = ts_parser.parse(bytes(source_code, "utf8"))
    root_node = tree.root_node

    functions = []
    imports = []
    exports = []
    calls = []

    def traverse(node):
        # Identify Import Declarations
        if node.type in ["import_statement", "import_declaration"]:
            import_text = source_code[node.start_byte:node.end_byte]
            # Try to extract module name
            module_match = re.search(r"from\s+['\"]([^'\"]+)['\"]", import_text)
            source_module = module_match.group(1) if module_match else import_text
            imports.append({
                "raw": import_text,
                "module": source_module,
                "start_line": node.start_point[0] + 1
            })

        # Identify Function Declarations & Arrow functions
        elif node.type in ["function_declaration", "lexical_declaration", "function"]:
            func_name = None
            for child in node.children:
                if child.type in ["identifier", "property_identifier"]:
                    func_name = source_code[child.start_byte:child.end_byte]
                    break
            if func_name:
                functions.append({
                    "name": func_name,
                    "start_line": node.start_point[0] + 1,
                    "end_line": node.end_point[0] + 1
                })

        # Identify Export Declarations
        elif node.type in ["export_statement", "export_declaration"]:
            export_text = source_code[node.start_byte:node.end_byte]
            exports.append({
                "raw": export_text,
                "start_line": node.start_point[0] + 1
            })

        # Identify Function Calls
        elif node.type in ["call_expression"]:
            callee_node = node.children[0] if node.children else None
            if callee_node:
                call_name = source_code[callee_node.start_byte:callee_node.end_byte]
                calls.append({
                    "callee": call_name,
                    "line": node.start_point[0] + 1
                })

        for child in node.children:
            traverse(child)

    traverse(root_node)

    return {
        "file_path": file_path,
        "functions": functions,
        "imports": imports,
        "exports": exports,
        "calls": calls
    }

def _parse_with_regex(file_path: str, source_code: str) -> Dict[str, Any]:
    lines = source_code.split("\n")
    functions = []
    imports = []
    exports = []
    calls = []

    # Import regex: import ... from 'module' or require('module')
    import_pattern = re.compile(r"(?:import\s+.*?from\s+['\"]([^'\"]+)['\"]|require\(['\"]([^'\"]+)['\"]\))")
    # Function regex: function foo(), const foo = () => {}, export function foo()
    func_pattern = re.compile(r"(?:function\s+([a-zA-Z0-9_$]+)|const\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?\(|let\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?\()")
    # Export regex
    export_pattern = re.compile(r"export\s+(?:default\s+)?(?:function|const|class|let|var|type|interface)?\s*([a-zA-Z0-9_$]+)?")

    for i, line in enumerate(lines, 1):
        # Imports
        imp_match = import_pattern.search(line)
        if imp_match:
            mod = imp_match.group(1) or imp_match.group(2)
            imports.append({"raw": line.strip(), "module": mod, "start_line": i})

        # Functions
        fn_match = func_pattern.search(line)
        if fn_match:
            name = fn_match.group(1) or fn_match.group(2) or fn_match.group(3)
            if name:
                functions.append({"name": name, "start_line": i, "end_line": i + 5})

        # Exports
        exp_match = export_pattern.search(line)
        if exp_match and "import" not in line:
            exports.append({"raw": line.strip(), "start_line": i})

    return {
        "file_path": file_path,
        "functions": functions,
        "imports": imports,
        "exports": exports,
        "calls": calls
    }
