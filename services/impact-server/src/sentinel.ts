export interface GovernanceViolation {
  id: string;
  ruleName: string;
  severity: 'WARNING' | 'CRITICAL';
  sourceFile: string;
  targetFile: string;
  message: string;
  recommendation: string;
}

export interface GovernanceRule {
  id: string;
  ruleName: string;
  sourcePattern: RegExp;
  targetPattern: RegExp;
  message: string;
  recommendation: string;
}

const DEFAULT_GOVERNANCE_RULES: GovernanceRule[] = [
  {
    id: 'RULE-01',
    ruleName: 'UI-to-Database Direct Boundary Violation',
    sourcePattern: /components\/|\/views\/|\.tsx$/,
    targetPattern: /models\/|database\/|prisma|orm/i,
    message: 'Frontend UI component attempts to directly import a database ORM model.',
    recommendation: 'Refactor UI to consume backend REST/GraphQL API routes instead of direct ORM models.'
  },
  {
    id: 'RULE-02',
    ruleName: 'Bypassed Controller Service Layer',
    sourcePattern: /app\/api\/|\/routes\//,
    targetPattern: /rawQueries|dbDriver/i,
    message: 'API route handler executes raw database queries bypassing the Service layer.',
    recommendation: 'Delegate data persistence to a dedicated Service layer in src/services.'
  }
];

export function auditArchitectureGovernance(
  filePath: string,
  importsList: string[]
): GovernanceViolation[] {
  const violations: GovernanceViolation[] = [];

  for (const imp of importsList) {
    for (const rule of DEFAULT_GOVERNANCE_RULES) {
      if (rule.sourcePattern.test(filePath) && rule.targetPattern.test(imp)) {
        violations.push({
          id: `${rule.id}-${Date.now()}`,
          ruleName: rule.ruleName,
          severity: 'CRITICAL',
          sourceFile: filePath,
          targetFile: imp,
          message: rule.message,
          recommendation: rule.recommendation
        });
      }
    }
  }

  return violations;
}
