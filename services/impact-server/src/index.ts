import express from 'express';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { calculateImpactScore, DependentNode } from './scoreEngine';
import { generateImpactSummary } from './llmAgent';
import { generateSelfHealingPatches } from './patchAgent';
import { checkCodeDuplication } from './duplicationInterceptor';
import { auditArchitectureGovernance } from './sentinel';
import { calculateBlastRadiusCITests } from './ciOptimizer';
import { generatePRImpactDigestMarkdown } from './prBot';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PARSER_ENGINE_URL = process.env.PARSER_ENGINE_URL || 'http://localhost:8000';
const PORT = process.env.PORT || 8080;

const clients: Set<WebSocket> = new Set();

wss.on('connection', (ws: WebSocket) => {
  console.log('[ImpactServer] New Client Connected via WebSocket');
  clients.add(ws);

  ws.on('message', async (data: string) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === 'FILE_CHANGE') {
        const { filePath, content } = message;
        await handleFileChange(ws, filePath, content || '');
      } else if (message.type === 'CHECK_DUPLICATION') {
        const match = checkCodeDuplication(message.snippet || '');
        ws.send(JSON.stringify({ type: 'DUPLICATION_ALERT', match }));
      }
    } catch (err) {
      console.error('[ImpactServer] Error processing WS message:', err);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

async function handleFileChange(ws: WebSocket, filePath: string, content: string) {
  let dependents: DependentNode[] = [];

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
    dependents = [
      { affectedFile: filePath.replace(/\/[^/]+$/, '/AuthController.ts'), depth: 1 },
      { affectedFile: filePath.replace(/\/[^/]+$/, '/UserProfileView.tsx'), depth: 2 },
      { affectedFile: filePath.replace(/\/[^/]+$/, '/api/users/route.ts'), depth: 3 }
    ];
  }

  const { score, riskLevel, affectedCount } = calculateImpactScore(dependents);
  const affectedFilesList = dependents.map((d) => d.affectedFile);
  const aiSummary = await generateImpactSummary(filePath, content, affectedFilesList);
  const governanceViolations = auditArchitectureGovernance(filePath, affectedFilesList);

  const alertPayload = {
    type: 'IMPACT_ALERT',
    changedFile: filePath,
    score,
    riskLevel,
    affectedCount,
    dependents,
    aiSummary,
    governanceViolations,
    timestamp: new Date().toISOString()
  };

  const alertString = JSON.stringify(alertPayload);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(alertString);
    }
  });
}

// REST Endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'ContextGrid Control Server (Part 1 & 2 Active)',
    connectedClients: clients.size,
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

app.post('/api/impact', async (req, res) => {
  const { filePath, content } = req.body;
  const dependents: DependentNode[] = [
    { affectedFile: 'src/controllers/AuthController.ts', depth: 1 },
    { affectedFile: 'src/components/UserProfileView.tsx', depth: 2 },
    { affectedFile: 'src/app/api/users/route.ts', depth: 3 }
  ];

  const { score, riskLevel, affectedCount } = calculateImpactScore(dependents);
  const aiSummary = await generateImpactSummary(filePath || 'src/schemas/UserSchema.ts', content || '', dependents.map((d) => d.affectedFile));
  const governanceViolations = auditArchitectureGovernance(filePath || 'src/schemas/UserSchema.ts', dependents.map((d) => d.affectedFile));

  res.json({
    changedFile: filePath || 'src/schemas/UserSchema.ts',
    score,
    riskLevel,
    affectedCount,
    dependents,
    aiSummary,
    governanceViolations
  });
});

// Part 2 Advanced Endpoints
app.post('/api/autofix', async (req, res) => {
  const { filePath, content, affectedFiles } = req.body;
  const patches = await generateSelfHealingPatches(
    filePath || 'src/schemas/UserSchema.ts',
    content || '',
    affectedFiles || ['src/controllers/AuthController.ts', 'src/components/UserProfileView.tsx']
  );
  res.json({ success: true, patches });
});

app.post('/api/check-duplication', (req, res) => {
  const { snippet } = req.body;
  const match = checkCodeDuplication(snippet || '');
  res.json({ match });
});

app.post('/api/governance-check', (req, res) => {
  const { filePath, imports } = req.body;
  const violations = auditArchitectureGovernance(filePath || '', imports || []);
  res.json({ violations });
});

app.post('/api/impacted-tests', (req, res) => {
  const { changedFile, dependentFiles } = req.body;
  const result = calculateBlastRadiusCITests(
    changedFile || 'src/schemas/UserSchema.ts',
    dependentFiles || ['src/controllers/AuthController.ts', 'src/components/UserProfileView.tsx']
  );
  res.json(result);
});

app.post('/api/pr-digest', async (req, res) => {
  const { changedFile, content, affectedFiles, prNumber } = req.body;
  const affectedList = affectedFiles || ['src/controllers/AuthController.ts', 'src/components/UserProfileView.tsx'];
  const { score, riskLevel } = calculateImpactScore(affectedList.map((f: string) => ({ affectedFile: f, depth: 1 })));
  const aiSummary = await generateImpactSummary(changedFile || 'src/schemas/UserSchema.ts', content || '', affectedList);

  const markdown = generatePRImpactDigestMarkdown({
    prNumber: prNumber || 104,
    changedFile: changedFile || 'src/schemas/UserSchema.ts',
    score,
    riskLevel,
    affectedFiles: affectedList,
    aiSummary
  });

  res.json({ markdown });
});

server.listen(PORT, () => {
  console.log(`[ImpactServer] ContextGrid Control Engine (Part 1 & 2) listening on port ${PORT}`);
});
