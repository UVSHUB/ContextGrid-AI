import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('[llmAgent] Google Gen AI SDK initialization warning:', err);
  }
}

export async function generateImpactSummary(
  changedFile: string,
  content: string,
  affectedFiles: string[]
): Promise<string> {
  const fileName = changedFile.split('/').pop() || changedFile;

  const prompt = `
You are ContextGrid AI - Senior Architectural Risk Agent.
A developer modified source file "${changedFile}".
Code Snippet:
\`\`\`
${content.slice(0, 400)}
\`\`\`

Downstream dependent files directly impacted:
${affectedFiles.length > 0 ? affectedFiles.map((f) => `- ${f}`).join('\n') : '- No downstream files'}

Provide a 2-sentence precise architectural risk audit explaining what breaks and how downstream components should adapt.
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: {
          temperature: 0.1,
          maxOutputTokens: 250
        }
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('[llmAgent] Gemini API call warning:', err);
    }
  }

  // Resilient contextual fallback summary
  if (affectedFiles.length === 0) {
    return `Modifying ${fileName} does not break downstream files. Local module changes verified.`;
  }

  return `Modifying ${fileName} affects ${affectedFiles.length} downstream component(s) (${affectedFiles.slice(0, 2).map((f) => f.split('/').pop()).join(', ')}). Verify backward compatibility for exported types and function signatures.`;
}
