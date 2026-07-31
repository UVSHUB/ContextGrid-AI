import * as vscode from 'vscode';
import { ContextGridWSClient } from './websocketClient';

let client: ContextGridWSClient | null = null;
const diagnosticCollection = vscode.languages.createDiagnosticCollection('contextgrid');

export function activate(context: vscode.ExtensionContext) {
  console.log('ContextGrid AI Extension Activated');

  // Initialize WebSocket Client Daemon
  client = new ContextGridWSClient(diagnosticCollection);
  client.connect();

  // Command to trigger manual AST refresh/analysis
  const refreshCommand = vscode.commands.registerCommand('contextgrid.analyzeImpact', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor && client) {
      client.sendFileChange(editor.document.uri.fsPath, editor.document.getText());
      vscode.window.showInformationMessage('ContextGrid AI: Analyzing architectural impact...');
    }
  });

  // Listen for Text Document Modifications
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

  context.subscriptions.push(refreshCommand, changeListener, diagnosticCollection);
}

export function deactivate() {
  if (client) {
    client.dispose();
  }
}
