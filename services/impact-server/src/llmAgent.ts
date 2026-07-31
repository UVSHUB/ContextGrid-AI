import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
    console.log('[llmAgent] Google Gen AI SDK initialized.');
  } catch (err) {
    console.warn('[llmAgent] Failed to initialize Google Gen AI SDK:', err);
  }
} else {
  console.warn('[llmAgent] GEMINI_API_KEY is not set. Local fallback AI reasoning will be used.');
}

const MODELS_TO_TRY = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

export async function generateImpactSummary(
  changedFile: string,
  diffContent: string,
  affectedFiles: string[]
): Promise<string> {
  const prompt = `
You are ContextGrid AI, a senior software architect engine.
A developer modified file: "${changedFile}".

The graph analysis reveals that the following dependent files are affected:
${affectedFiles.map((f) => `- ${f}`).join('\n')}

Code Diff / Context:
\`\`\`
${diffContent.slice(0, 1000)}
\`\`\`

Provide a concise 2-sentence summary warning explaining:
1. What architectural breakages could occur across these downstream components.
2. How the developer can prevent breaking changes across affected files.
  `;

  if (ai) {
    for (const modelName of MODELS_TO_TRY) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            temperature: 0.2,
            maxOutputTokens: 150,
          }
        });

        if (response && response.text) {
          console.log(`[llmAgent] Successfully generated summary using ${modelName}`);
          return response.text.trim();
        }
      } catch (error: any) {
        console.warn(`[llmAgent] Model ${modelName} call attempted: ${error?.message || error}`);
      }
    }
  }

  // Resilient ContextGrid AI summary fallback when API call fails or key is unconfigured
  const count = affectedFiles.length;
  const fileName = changedFile.split('/').pop() || changedFile;
  return `Modifying ${fileName} impacts ${count} downstream module(s) (${affectedFiles.slice(0, 3).join(', ')}${count > 3 ? '...' : ''}). Ensure export signatures and schema type definitions remain backward compatible to avoid unexpected runtime errors.`;
}
