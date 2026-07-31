import WebSocket from 'ws';
import * as vscode from 'vscode';
import { updateDiagnostics, ImpactAlertPayload } from './diagnostics';

export class ContextGridWSClient {
  private socket: WebSocket | null = null;
  private serverUrl: string = 'ws://localhost:8080';
  private reconnectInterval: NodeJS.Timeout | null = null;

  constructor(private diagnosticCollection: vscode.DiagnosticCollection) {}

  public connect() {
    try {
      this.socket = new WebSocket(this.serverUrl);

      this.socket.on('open', () => {
        console.log('[ContextGrid Extension] Connected to Impact Server Daemon');
        if (this.reconnectInterval) {
          clearInterval(this.reconnectInterval);
          this.reconnectInterval = null;
        }
      });

      this.socket.on('message', (data: string) => {
        try {
          const alert: ImpactAlertPayload = JSON.parse(data.toString());
          if (alert.type === 'IMPACT_ALERT') {
            updateDiagnostics(this.diagnosticCollection, alert);
          }
        } catch (e) {
          console.error('[ContextGrid Extension] Error parsing WebSocket payload', e);
        }
      });

      this.socket.on('close', () => {
        console.warn('[ContextGrid Extension] WebSocket closed. Attempting reconnect...');
        this.scheduleReconnect();
      });

      this.socket.on('error', (err) => {
        console.warn('[ContextGrid Extension] WebSocket error:', err.message);
      });
    } catch (e) {
      this.scheduleReconnect();
    }
  }

  public sendFileChange(filePath: string, content: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: 'FILE_CHANGE',
          filePath,
          content
        })
      );
    }
  }

  private scheduleReconnect() {
    if (!this.reconnectInterval) {
      this.reconnectInterval = setInterval(() => {
        console.log('[ContextGrid Extension] Retrying daemon connection...');
        this.connect();
      }, 5000);
    }
  }

  public dispose() {
    if (this.reconnectInterval) clearInterval(this.reconnectInterval);
    if (this.socket) this.socket.close();
  }
}
