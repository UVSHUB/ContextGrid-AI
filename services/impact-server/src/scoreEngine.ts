export interface DependentNode {
  affectedFile: string;
  depth: number;
}

export interface ImpactScoreResult {
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedCount: number;
}

export function calculateImpactScore(dependents: DependentNode[]): ImpactScoreResult {
  let rawScore = 0;
  const weight = 25;

  dependents.forEach((dep) => {
    // Inverse depth weighting: deeper impact adds diminishing penalty
    const depth = dep.depth || 1;
    rawScore += (1 * weight) / depth;
  });

  const score = Math.min(100, Math.round(rawScore));

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (score > 75) riskLevel = 'CRITICAL';
  else if (score > 50) riskLevel = 'HIGH';
  else if (score > 25) riskLevel = 'MEDIUM';

  return {
    score,
    riskLevel,
    affectedCount: dependents.length
  };
}
