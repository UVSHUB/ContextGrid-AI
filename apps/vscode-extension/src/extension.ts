import * as vscode from 'vscode';
import { ContextGridWSClient } from './websocketClient';

let client: ContextGridWSClient | null = null;
const diagnosticCollection = vscode.languages.createDiagnosticCollection('contextgrid');

export function activate(context: vscode.ExtensionContext) {
  console.log('ContextGrid AI Enterprise Extension Activated');

  client = new ContextGridWSClient(diagnosticCollection);
  client.connect();

  const refreshCommand = vscode.commands.registerCommand('contextgrid.analyzeImpact', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor && client) {
      client.sendFileChange(editor.document.uri.fsPath, editor.document.getText());
      vscode.window.showInformationMessage('ContextGrid AI: Analyzing architectural impact...');
    }
  });

  const autoFixCommand = vscode.commands.registerCommand('contextgrid.applyAutoFix', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    vscode.window.showInformationMessage('ContextGrid AI: Generating Autonomous Self-Healing Refactor Patch...');
    try {
      const response = await fetch('http://localhost:8080/api/autofix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: editor.document.uri.fsPath,
          content: editor.document.getText(),
          affectedFiles: ['src/controllers/AuthController.ts', 'src/components/UserProfileView.tsx']
        })
      });

      if (response.ok) {
        const data = (await response.json()) as { patches: any[] };
        vscode.window.showInformationMessage(
          `✨ ContextGrid AI: Generated ${data.patches?.length || 0} self-healing refactor patches! Check Web Dashboard at http://localhost:3000 to apply.`
        );
      }
    } catch (e) {
      vscode.window.showWarningMessage('ContextGrid AI: Impact control daemon offline.');
    }
  });

  const checkDuplicationCommand = vscode.commands.registerCommand('contextgrid.checkDuplication', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const selection = editor.document.getText(editor.selection) || editor.document.getText();
    try {
      const response = await fetch('http://localhost:8080/api/check-duplication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snippet: selection })
      });

      if (response.ok) {
        const data = (await response.json()) as { match: any };
        if (data.match && data.match.isDuplicate) {
          vscode.window.showWarningMessage(`⚠️ Duplication Alert: ${data.match.suggestion}`);
        } else {
          vscode.window.showInformationMessage('✅ ContextGrid AI: No duplicate function detected in codebase.');
        }
      }
    } catch (e) {
      vscode.window.showWarningMessage('ContextGrid AI: Impact control daemon offline.');
    }
  });

  const changeListener = vscode.workspace.onDidChangeTextDocument((event) => {
    const lang = event.document.languageId;
    if (['typescript', 'javascript', 'typescriptreact', 'javascriptreact'].includes(lang)) {
      const fileUri = event.document.uri.fsPath;
      const content = event.document.getText();

      if (client) {
        client.sendFileChange(fileUri, content);
      }
    }
  });

  context.subscriptions.push(refreshCommand, autoFixCommand, checkDuplicationCommand, changeListener, diagnosticCollection);
}

export function deactivate() {
  if (client) {
    client.dispose();
  }
}
