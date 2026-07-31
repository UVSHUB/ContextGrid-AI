export interface StructuralSearchHit {
  file: string;
  repo: string;
  symbol: string;
  line: number;
  snippet: string;
  kind: 'Function' | 'Export' | 'Class' | 'Interface';
  blastRadiusScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface StructuralSearchRequest {
  query: string;
  repo?: string;
  language?: string;
  pathRegex?: string;
}

const INDEXED_SEARCH_HITS: StructuralSearchHit[] = [
  {
    file: 'backend/src/controllers/authController.ts',
    repo: 'IdeaTech-Internship-Management-Portal',
    symbol: 'loginUser',
    line: 14,
    snippet: 'export async function loginUser(req: Request, res: Response) {',
    kind: 'Function',
    blastRadiusScore: 88,
    riskLevel: 'CRITICAL'
  },
  {
    file: 'backend/src/controllers/internActivityController.ts',
    repo: 'IdeaTech-Internship-Management-Portal',
    symbol: 'logActivity',
    line: 28,
    snippet: 'export const logActivity = async (req: Request, res: Response) => {',
    kind: 'Function',
    blastRadiusScore: 62,
    riskLevel: 'HIGH'
  },
  {
    file: 'backend/src/controllers/taskController.ts',
    repo: 'IdeaTech-Internship-Management-Portal',
    symbol: 'createTask',
    line: 19,
    snippet: 'export async function createTask(req: Request, res: Response) {',
    kind: 'Function',
    blastRadiusScore: 54,
    riskLevel: 'HIGH'
  },
  {
    file: 'backend/src/services/ai.ts',
    repo: 'IdeaTech-Internship-Management-Portal',
    symbol: 'generateImpactAnalysis',
    line: 8,
    snippet: 'export async function generateImpactAnalysis(prompt: string) {',
    kind: 'Function',
    blastRadiusScore: 38,
    riskLevel: 'MEDIUM'
  },
  {
    file: 'frontend/src/app/login/page.tsx',
    repo: 'IdeaTech-Internship-Management-Portal',
    symbol: 'LoginPage',
    line: 12,
    snippet: 'export default function LoginPage() {',
    kind: 'Class',
    blastRadiusScore: 18,
    riskLevel: 'LOW'
  }
];

export function executeStructuralSearch(req: StructuralSearchRequest): StructuralSearchHit[] {
  const queryLower = req.query.toLowerCase();
  const repoLower = (req.repo || '').toLowerCase();

  return INDEXED_SEARCH_HITS.filter((hit) => {
    const matchesQuery =
      hit.symbol.toLowerCase().includes(queryLower) ||
      hit.file.toLowerCase().includes(queryLower) ||
      hit.snippet.toLowerCase().includes(queryLower) ||
      queryLower === '*' ||
      queryLower === '';

    const matchesRepo = !repoLower || hit.repo.toLowerCase().includes(repoLower);

    return matchesQuery && matchesRepo;
  });
}
