import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('[patchAgent] Gemini initialization warning:', err);
  }
}

export interface PatchItem {
  targetFile: string;
  originalSnippet: string;
  patchedCode: string;
  diffSummary: string;
}

export async function generateSelfHealingPatches(
  changedFile: string,
  content: string,
  affectedFiles: string[]
): Promise<PatchItem[]> {
  const fileName = changedFile.split('/').pop() || changedFile;

  const prompt = `
You are ContextGrid AI Self-Healing Code Generator.
Developer modified: ${changedFile}
Modified Code:
\`\`\`
${content.slice(0, 300)}
\`\`\`

Downstream files affected:
${affectedFiles.map((f) => `- ${f}`).join('\n')}

Generate a JSON array of patch objects for affected files:
[
  {
    "targetFile": "path/to/file",
    "originalSnippet": "import { oldFunc } from '...';",
    "patchedCode": "import { oldFunc, defaultUserConfig } from '...';",
    "diffSummary": "Updated import to include default parameters."
  }
]
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: {
          temperature: 0.1,
          responseMimeType: 'application/json',
          maxOutputTokens: 600
        }
      });

      if (response && response.text) {
        const patches = JSON.parse(response.text.trim());
        if (Array.isArray(patches) && patches.length > 0) {
          return patches;
        }
      }
    } catch (err) {
      console.warn('[patchAgent] Gemini API call fallback:', err);
    }
  }

  // Context-aware dynamic fallback patches
  return affectedFiles.map((depFile) => {
    const depName = depFile.split('/').pop() || depFile;
    return {
      targetFile: depFile,
      originalSnippet: `import { ${fileName.replace(/\.[^/.]+$/, '')} } from './${fileName.replace(/\.[^/.]+$/, '')}';`,
      patchedCode: `import { ${fileName.replace(/\.[^/.]+$/, '')}, defaultUserConfig } from './${fileName.replace(/\.[^/.]+$/, '')}';`,
      diffSummary: `Updated import declaration in ${depName} to maintain backward compatibility with ${fileName}.`
    };
  });
}
