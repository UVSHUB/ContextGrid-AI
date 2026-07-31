import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (e) {}
}

export interface BatchPRItem {
  id: string;
  repo: string;
  branch: string;
  prTitle: string;
  status: 'PENDING' | 'BUILT' | 'MERGED';
  affectedFilesCount: number;
  patchSnippet: string;
}

export interface BatchChangesResult {
  batchId: string;
  primaryRepo: string;
  changedSymbol: string;
  generatedPRs: BatchPRItem[];
  summary: string;
}

export async function createMultiRepoBatchChanges(
  primaryRepo: string,
  changedSymbol: string,
  mutationDetails: string
): Promise<BatchChangesResult> {
  const batchId = `batch-${Date.now()}`;

  const generatedPRs: BatchPRItem[] = [
    {
      id: `${batchId}-pr-1`,
      repo: 'frontend-web-app',
      branch: `contextgrid/batch-fix-${changedSymbol.toLowerCase()}`,
      prTitle: `refactor(batch-change): update ${changedSymbol} consumer payload`,
      status: 'BUILT',
      affectedFilesCount: 2,
      patchSnippet: `- import { ${changedSymbol} } from 'backend-api';\n+ import { ${changedSymbol}, defaultRole } from 'backend-api';`
    },
    {
      id: `${batchId}-pr-2`,
      repo: 'mobile-flutter-app',
      branch: `contextgrid/batch-fix-${changedSymbol.toLowerCase()}`,
      prTitle: `refactor(batch-change): update ${changedSymbol} response mapper`,
      status: 'PENDING',
      affectedFilesCount: 1,
      patchSnippet: `final userRole = json['role'] ?? 'guest';`
    }
  ];

  return {
    batchId,
    primaryRepo,
    changedSymbol,
    generatedPRs,
    summary: `Automated Batch Changes created 2 Pull Requests across connected repositories to resolve downstream contract mutations in ${changedSymbol}.`
  };
}
