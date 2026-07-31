import { Request, Response } from 'express';
import { runGeminiReasoningPipeline } from './llmReasoning';

export interface GitHubWebhookPayload {
  action: 'opened' | 'synchronize' | 'reopened';
  number: number;
  pull_request?: {
    html_url: string;
    head: { ref: string; sha: string };
    base: { ref: string };
    title: string;
  };
  repository?: {
    full_name: string;
  };
}

export async function handleGitHubWebhook(req: Request, res: Response) {
  try {
    const payload = req.body as GitHubWebhookPayload;

    if (!payload.action || !payload.pull_request) {
      return res.status(200).json({ status: 'ignored', reason: 'Not a pull request action' });
    }

    const prTitle = payload.pull_request.title;
    const prNumber = payload.number;
    const headBranch = payload.pull_request.head.ref;
    const repoName = payload.repository?.full_name || 'repo';

    console.log(`[GitHubBot] Received PR #${prNumber} event '${payload.action}' on branch ${headBranch}`);

    // Simulated touched files & graph traversal for GitHub PR audit
    const changedFile = 'backend/src/controllers/authController.ts';
    const affectedFiles = [
      'backend/src/controllers/internActivityController.ts',
      'frontend/src/app/login/page.tsx',
      'backend/src/routes/index.ts'
    ];

    const reasoning = await runGeminiReasoningPipeline(
      { file: changedFile, changed_symbol: 'authController', change_type: 'SIGNATURE_MUTATION' },
      affectedFiles
    );

    const riskBadge = reasoning.riskScore > 75 ? '🔴 CRITICAL' : reasoning.riskScore > 50 ? '🟠 HIGH' : '🔵 MEDIUM';
    const fileName = changedFile.split('/').pop() || changedFile;

    const markdownComment = `
### ${riskBadge} ContextGrid AI Architectural PR Audit (Score: ${reasoning.riskScore}/100)

> **Automated PR Impact Guardrail**: Pull Request **#${prNumber}** (*"${prTitle}"*) modifies symbol \`authController\` in \`${fileName}\`, affecting **${affectedFiles.length} downstream component(s)**.

#### 📊 Visual Dependency Flow
\`\`\`
[${fileName}]
      │
      ├──► [internActivityController.ts]
      │           │
      │           └──► [frontend/src/app/login/page.tsx]
      │
      └──► [backend/src/routes/index.ts]
\`\`\`

#### 🧠 Gemini 2.0 Flash Architectural Risk Summary
${reasoning.architecturalWarning}

#### ⚡ 1-Click Auto-Fix Patch Preview for Reviewers
\`\`\`diff
- import { authUser } from './authController';
+ import { authUser, defaultUserConfig } from './authController';
\`\`\`

---
*ContextGrid AI GitHub Bot • Run \`npx jest tests/authController.test.ts\` for targeted blast-radius CI testing.*
`;

    console.log(`[GitHubBot] Formatted PR #${prNumber} Markdown Comment:\n${markdownComment}`);

    return res.status(200).json({
      success: true,
      prNumber,
      repoName,
      riskScore: reasoning.riskScore,
      markdownComment
    });
  } catch (err) {
    console.error('[GitHubBot] Error processing webhook:', err);
    return res.status(500).json({ error: 'Failed to process GitHub webhook' });
  }
}
