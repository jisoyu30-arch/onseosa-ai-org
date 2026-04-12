import { dialoguesL1, DialogueExample } from './dialogues-l1';
import { dialoguesL2 } from './dialogues-l2';
import { dialoguesL3 } from './dialogues-l3';
import { dialoguesL4 } from './dialogues-l4';
import { dialoguesL5 } from './dialogues-l5';

export type { DialogueExample };

export const allDialogues: Record<string, DialogueExample> = {
  ...dialoguesL1,
  ...dialoguesL2,
  ...dialoguesL3,
  ...dialoguesL4,
  ...dialoguesL5,
};

export function getDialoguesForLesson(lessonId: string): DialogueExample[] {
  return Object.values(allDialogues).filter((d) => d.lessonId === lessonId);
}
