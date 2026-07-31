import express from 'express';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { calculateImpactScore, DependentNode } from './scoreEngine';
import { generateImpactSummary } from './llmAgent';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PARSER_ENGINE_URL = process.env.PARSER_ENGINE_URL || 'http://localhost:8000';
const PORT = process.env.PORT || 8080;

// Track connected WebSocket clients (VS Code Extension, Web Dashboard)
const clients: Set<WebSocket> = new Set();

wss.on('connection', (ws: WebSocket) => {
  console.log('[ImpactServer] New Client Connected via WebSocket');
  clients.add(ws);

  ws.on('message', async (data: string) => {
    try {
      const message = JSON.parse(data.toString());
      console.log(`[ImpactServer] Received message type: ${message.type}`);

      if (message.type === 'FILE_CHANGE') {
        const { filePath, content } = message;
        await handleFileChange(ws, filePath, content || '');
      }
    } catch (err) {
      console.error('[ImpactServer] Error processing WS message:', err);
    }
  });

  ws.on('close', () => {
    console.log('[ImpactServer] Client Disconnected');
    clients.delete(ws);
  });
});

async function handleFileChange(ws: WebSocket, filePath: string, content: string) {
  let dependents: DependentNode[] = [];

  // 1. Send content to Python Parser Engine if available, or query local graph
  try {
    const parseRes = await fetch(`${PARSER_ENGINE_URL}/parse-file`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_path: filePath, content })
    });

    if (parseRes.ok) {
      const impRes = await fetch(`${PARSER_ENGINE_URL}/impact-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changed_file: filePath, max_depth: 4 })
      });

      if (impRes.ok) {
        const impData = (await impRes.json()) as { dependents: DependentNode[] };
        dependents = impData.dependents || [];
      }
    }
  } catch (err) {
    console.warn('[ImpactServer] Parser Engine unreachable, constructing mock graph context for change.');
    // Simulated dependency path if parser service is offline during local test
    dependents = [
      { affectedFile: filePath.replace(/\/[^/]+$/, '/AuthController.ts'), depth: 1 },
      { affectedFile: filePath.replace(/\/[^/]+$/, '/UserProfileView.tsx'), depth: 2 },
      { affectedFile: filePath.replace(/\/[^/]+$/, '/api/users/route.ts'), depth: 3 }
    ];
  }

  // 2. Calculate System Impact Score
  const { score, riskLevel, affectedCount } = calculateImpactScore(dependents);
  const affectedFilesList = dependents.map((d) => d.affectedFile);

  // 3. Invoke Google Gemini API for architectural impact reasoning
  const aiSummary = await generateImpactSummary(filePath, content, affectedFilesList);

  const alertPayload = {
    type: 'IMPACT_ALERT',
    changedFile: filePath,
    score,
    riskLevel,
    affectedCount,
    dependents,
    aiSummary,
    timestamp: new Date().toISOString()
  };

  // Broadcast impact alert to all connected clients (VS Code & Web Dashboard)
  const alertString = JSON.stringify(alertPayload);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(alertString);
    }
  });
}

// REST API Endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'ContextGrid Impact Control Server',
    connectedClients: clients.size,
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

app.post('/api/impact', async (req, res) => {
  const { filePath, content } = req.body;
  if (!filePath) {
    return res.status(400).json({ error: 'filePath is required' });
  }
  
  // Dummy trigger for REST impact inspection
  const dependents: DependentNode[] = [
    { affectedFile: 'src/controllers/AuthController.ts', depth: 1 },
    { affectedFile: 'src/views/UserProfileView.tsx', depth: 2 }
  ];

  const { score, riskLevel, affectedCount } = calculateImpactScore(dependents);
  const aiSummary = await generateImpactSummary(filePath, content || '', dependents.map(d => d.affectedFile));

  res.json({
    changedFile: filePath,
    score,
    riskLevel,
    affectedCount,
    dependents,
    aiSummary
  });
});

app.get('/api/graph', async (req, res) => {
  try {
    const graphRes = await fetch(`${PARSER_ENGINE_URL}/graph`);
    if (graphRes.ok) {
      const data = await graphRes.json();
      return res.json(data);
    }
  } catch (err) {
    // Fallback graph topology for demonstration & web UI startup
  }

  res.json({
    nodes: [
      { id: '1', label: 'UserSchema.ts', path: 'src/schemas/UserSchema.ts', type: 'File', risk: 'CRITICAL' },
      { id: '2', label: 'AuthController.ts', path: 'src/controllers/AuthController.ts', type: 'File', risk: 'HIGH' },
      { id: '3', label: 'UserProfileView.tsx', path: 'src/components/UserProfileView.tsx', type: 'File', risk: 'MEDIUM' },
      { id: '4', label: 'api/users/route.ts', path: 'src/app/api/users/route.ts', type: 'File', risk: 'LOW' }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', label: 'IMPORTS' },
      { id: 'e1-3', source: '1', target: '3', label: 'IMPORTS' },
      { id: 'e2-4', source: '2', target: '4', label: 'IMPORTS' }
    ]
  });
});

server.listen(PORT, () => {
  console.log(`[ImpactServer] ContextGrid Control Engine listening on port ${PORT}`);
  console.log(`[ImpactServer] WebSocket Daemon running on ws://localhost:${PORT}`);
});
