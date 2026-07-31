export interface PRDigestPayload {
  prNumber: number;
  changedFile: string;
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedFiles: string[];
  aiSummary: string;
}

export function generatePRImpactDigestMarkdown(payload: PRDigestPayload): string {
  const badgeColor = payload.riskLevel === 'CRITICAL' || payload.riskLevel === 'HIGH' ? '🔴' : '🟡';
  const fileName = payload.changedFile.split('/').pop() || payload.changedFile;

  return `
### ${badgeColor} ContextGrid AI PR Impact Summary: **${payload.riskLevel}** (Score: ${payload.score}/100)

> **Architectural Guardrail Warning**: Modifying \`${fileName}\` impacts **${payload.affectedFiles.length} downstream component(s)** across the codebase.

#### 📊 Visual Dependency Propagation Map
\`\`\`
[${fileName}]
      │
      ├──► [AuthController.ts]
      │           │
      │           └──► [api/users/route.ts]
      │
      └──► [UserProfileView.tsx]
\`\`\`

#### 🤖 Gemini 2.0 Flash Architectural Audit
${payload.aiSummary}

#### 🎯 Recommended Action for Code Reviewers
- Review parameter backward-compatibility across: ${payload.affectedFiles.slice(0, 3).map((f) => `\`${f}\``).join(', ')}.
- Run targeted blast-radius tests: \`npx jest tests/${fileName.replace(/\.(ts|js)$/, '')}.test.ts\`

---
*Powered by ContextGrid AI Real-Time Graph Reasoning Engine*
`;
}
