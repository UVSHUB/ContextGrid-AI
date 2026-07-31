import * as vscode from 'vscode';

export interface ImpactAlertPayload {
  type: string;
  changedFile: string;
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedCount: number;
  aiSummary: string;
}

export function updateDiagnostics(
  diagnosticCollection: vscode.DiagnosticCollection,
  alert: ImpactAlertPayload
) {
  diagnosticCollection.clear();

  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  // Verify active editor file matches changed file path (or basename)
  const activePath = editor.document.uri.fsPath;
  const isMatch = activePath.endsWith(alert.changedFile) || alert.changedFile.endsWith(activePath) || activePath === alert.changedFile;

  if (!isMatch && alert.score < 40) return;

  const diagnostics: vscode.Diagnostic[] = [];
  
  // Highlight line 0 header / first 5 lines as impact warning indicator
  const range = new vscode.Range(0, 0, 0, 80);

  const severity = alert.riskLevel === 'CRITICAL' || alert.riskLevel === 'HIGH'
    ? vscode.DiagnosticSeverity.Error
    : vscode.DiagnosticSeverity.Warning;

  const message = `[ContextGrid AI Warning] System Impact Score: ${alert.score}/100 (${alert.riskLevel}).\nEditing this component affects ${alert.affectedCount} downstream file(s).\n\nArchitectural Analysis:\n${alert.aiSummary}`;

  const diagnostic = new vscode.Diagnostic(range, message, severity);
  diagnostic.source = 'ContextGrid AI';

  diagnostics.push(diagnostic);
  diagnosticCollection.set(editor.document.uri, diagnostics);

  // Status bar warning message
  if (alert.score > 50) {
    vscode.window.showWarningMessage(
      `⚠️ ContextGrid AI: High Impact Score (${alert.score}/100) detected on ${alert.changedFile.split('/').pop()}!`
    );
  }
}
