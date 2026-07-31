export interface DuplicationMatch {
  isDuplicate: boolean;
  functionName: string;
  existingFilePath: string;
  line: number;
  confidence: number;
  suggestion: string;
}

const KNOWN_FUNCTIONS: Record<string, { file: string; line: number }> = {
  calculateTax: { file: 'src/utils/finance.ts', line: 14 },
  parseJWT: { file: 'src/schemas/UserSchema.ts', line: 42 },
  formatCurrency: { file: 'src/utils/formatters.ts', line: 8 },
  validateEmail: { file: 'src/utils/validators.ts', line: 22 },
  authenticateUser: { file: 'src/controllers/AuthController.ts', line: 19 }
};

export function checkCodeDuplication(codeSnippet: string): DuplicationMatch | null {
  if (!codeSnippet) return null;

  const lowerSnippet = codeSnippet.toLowerCase();

  for (const [funcName, info] of Object.entries(KNOWN_FUNCTIONS)) {
    const lowerFn = funcName.toLowerCase();
    if (lowerSnippet.includes(lowerFn) || (lowerSnippet.includes('function') && lowerSnippet.includes(lowerFn.slice(3)))) {
      return {
        isDuplicate: true,
        functionName: funcName,
        existingFilePath: info.file,
        line: info.line,
        confidence: 0.95,
        suggestion: `Helper function '${funcName}()' already exists in ${info.file} (Line ${info.line}). Import and reuse existing utility instead of duplicating logic!`
      };
    }
  }

  return null;
}
