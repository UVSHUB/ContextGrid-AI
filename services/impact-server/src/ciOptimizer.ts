export interface CIOptimizationResult {
  changedFile: string;
  totalTestSuiteCount: number;
  impactedTestCount: number;
  timeSavingsPercentage: number;
  affectedTestFiles: string[];
  recommendedCommand: string;
}

export function calculateBlastRadiusCITests(
  changedFile: string,
  dependentFiles: string[]
): CIOptimizationResult {
  const allAffected = [changedFile, ...dependentFiles];
  const testFilesSet = new Set<string>();

  allAffected.forEach((filePath) => {
    const baseName = filePath.split('/').pop()?.replace(/\.(ts|tsx|js|jsx)$/, '') || '';
    if (baseName) {
      testFilesSet.add(`tests/${baseName}.test.ts`);
      testFilesSet.add(`tests/integration/${baseName}.spec.ts`);
    }
  });

  const affectedTestFiles = Array.from(testFilesSet).slice(0, 3);
  const totalTestSuiteCount = 45; // Simulated full repository test suite count
  const impactedTestCount = affectedTestFiles.length;
  const timeSavingsPercentage = Math.round(((totalTestSuiteCount - impactedTestCount) / totalTestSuiteCount) * 100);

  const recommendedCommand = `npx jest ${affectedTestFiles.join(' ')}`;

  return {
    changedFile,
    totalTestSuiteCount,
    impactedTestCount,
    timeSavingsPercentage,
    affectedTestFiles,
    recommendedCommand
  };
}
