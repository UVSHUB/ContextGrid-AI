export interface DependentNode {
  affectedFile: string;
  depth: number;
  symbol?: string;
}

export interface ImpactScoreResult {
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedCount: number;
}

export function calculateImpactScore(dependents: DependentNode[], changedFile: string = ''): ImpactScoreResult {
  const affectedCount = dependents.length;
  if (affectedCount === 0) {
    return { score: 10, riskLevel: 'LOW', affectedCount: 0 };
  }

  // Dynamic blast radius calculation based on graph depth and critical path indicators
  let rawScore = 0;
  for (const dep of dependents) {
    const depthWeight = 35 / (dep.depth || 1);
    rawScore += depthWeight;
  }

  // Critical path boost if file contains auth, security, payment, schema, or route handlers
  const fileLower = (changedFile || '').toLowerCase();
  let criticalBonus = 0;
  if (fileLower.includes('auth') || fileLower.includes('jwt') || fileLower.includes('login')) {
    criticalBonus += 25;
  }
  if (fileLower.includes('schema') || fileLower.includes('model') || fileLower.includes('db')) {
    criticalBonus += 20;
  }
  if (fileLower.includes('route') || fileLower.includes('controller') || fileLower.includes('api')) {
    criticalBonus += 15;
  }

  const finalScore = Math.min(99, Math.max(15, Math.round(rawScore + criticalBonus)));

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (finalScore >= 75) {
    riskLevel = 'CRITICAL';
  } else if (finalScore >= 50) {
    riskLevel = 'HIGH';
  } else if (finalScore >= 25) {
    riskLevel = 'MEDIUM';
  }

  return {
    score: finalScore,
    riskLevel,
    affectedCount
  };
}
