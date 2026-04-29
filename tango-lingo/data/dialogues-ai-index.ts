// AI 생성 dialogue 통합 인덱스
// 새 배치 파일 추가 시 여기 import만 추가하면 자동 반영

import type { DialogueExample } from './dialogues-l1';
import { dialoguesAI as batch1 } from './dialogues-ai-2026-04-27T02-40-14';
import { dialoguesAI as batch2 } from './dialogues-ai-2026-04-27T02-43-03';
import { dialoguesClaude001 } from './dialogues-claude-001';
import { dialoguesClaude002 } from './dialogues-claude-002';
import { dialoguesClaude003 } from './dialogues-claude-003';
import { dialoguesClaude004 } from './dialogues-claude-004';
import { dialoguesClaude005 } from './dialogues-claude-005';
import { dialoguesClaude006 } from './dialogues-claude-006';
import { dialoguesClaude007 } from './dialogues-claude-007';
import { dialoguesClaude008 } from './dialogues-claude-008';
import { dialoguesClaude009 } from './dialogues-claude-009';

export const dialoguesAI: Record<string, DialogueExample> = {
  ...batch1,
  ...batch2,
  ...dialoguesClaude001,
  ...dialoguesClaude002,
  ...dialoguesClaude003,
  ...dialoguesClaude004,
  ...dialoguesClaude005,
  ...dialoguesClaude006,
  ...dialoguesClaude007,
  ...dialoguesClaude008,
  ...dialoguesClaude009,
};
