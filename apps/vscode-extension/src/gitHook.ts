import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function installPreCommitHook(workspaceRoot: string) {
  const hooksDir = path.join(workspaceRoot, '.git', 'hooks');
  const hookFile = path.join(hooksDir, 'pre-commit');

  if (!fs.existsSync(hooksDir)) {
    vscode.window.showErrorMessage('ContextGrid AI: Not a Git repository (no .git/hooks directory found).');
    return;
  }

  const hookScript = `#!/bin/sh
# ContextGrid AI Git Pre-Commit Impact Guardrail Hook
echo "[ContextGrid AI] Evaluating pre-commit architectural blast radius..."

# Query Impact Control Server daemon
SCORE_RES=$(curl -s -X POST http://localhost:8080/api/impact -H "Content-Type: application/json" -d '{"filePath": "staged-commit"}')

echo "$SCORE_RES" | grep -q "CRITICAL"
if [ $? -eq 0 ]; then
  echo ""
  echo "⚠️ [ContextGrid AI CRITICAL WARNING] High System Impact Score (> 75/100) detected on staged commit!"
  echo "Editing staged files impacts multiple downstream components."
  echo "Open VS Code to preview 1-Click Auto-Fix or bypass using: git commit --no-verify"
  echo ""
  exit 1
fi

echo "✅ [ContextGrid AI] Pre-commit architectural check passed."
exit 0
`;

  try {
    fs.writeFileSync(hookFile, hookScript, { mode: 0o755 });
    vscode.window.showInformationMessage('✨ ContextGrid AI: Git pre-commit architectural guardrail hook installed successfully!');
  } catch (err: any) {
    vscode.window.showErrorMessage(`ContextGrid AI: Failed to install pre-commit hook: ${err.message}`);
  }
}
