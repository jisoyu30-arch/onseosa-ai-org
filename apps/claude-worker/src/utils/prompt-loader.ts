import { readFileSync } from 'fs';
import { resolve } from 'path';

const PROMPTS_DIR = resolve(__dirname, '../../../../automations/prompts');

export function loadPrompt(engineName: string): string {
  const filePath = resolve(PROMPTS_DIR, `${engineName}.md`);
  try {
    return readFileSync(filePath, 'utf-8');
  } catch {
    console.warn(`Prompt file not found: ${filePath}`);
    return '';
  }
}
