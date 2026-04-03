import { describe, it, expect } from 'vitest';
import { loadPrompt } from './prompt-loader';

describe('loadPrompt', () => {
  it('arko 프롬프트를 로드한다', () => {
    const prompt = loadPrompt('arko');
    expect(prompt).toBeTruthy();
    expect(prompt.length).toBeGreaterThan(0);
  });

  it('noah 프롬프트를 로드한다', () => {
    const prompt = loadPrompt('noah');
    expect(prompt).toBeTruthy();
  });

  it('존재하지 않는 프롬프트는 빈 문자열을 반환한다', () => {
    const prompt = loadPrompt('nonexistent-engine-xyz');
    expect(prompt).toBe('');
  });

  it('모든 2세대 엔진 프롬프트가 존재한다', () => {
    const engines = ['arko', 'noah', 'eden', 'ria', 'luka'];
    for (const engine of engines) {
      const prompt = loadPrompt(engine);
      expect(prompt, `${engine} 프롬프트가 비어있음`).toBeTruthy();
    }
  });
});
