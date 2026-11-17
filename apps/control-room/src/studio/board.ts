// 컷 보드의 자료 구조, 촬영 설정, 첫 보드.
// 촬영 설정은 고른 값을 프롬프트 문구로 바꿔 붙이는 방식이라 어떤 생성 모델에도 쓸 수 있다.

export interface Shooting {
  move: string;
  lens: string;
  depth: string;
  light: string;
  color: string;
}

export interface Take {
  id: number;
  status: 'pending' | 'done' | 'failed';
  url?: string;
  file?: string;
  attempt: number;
  cost: number | null;
  prompt: string;
  createdAt: string;
  /** 영상 후보가 어느 그림에서 출발했는지 */
  fromImage?: number;
  note?: string;
}

export interface Cut {
  id: string;
  name: string;
  lines: string;
  imagePrompt: string;
  motionPrompt: string;
  shooting: Shooting;
  images: Take[];
  videos: Take[];
  chosenImage?: number;
  chosenVideo?: number;
  /** 대본이 바뀐 것을 보고 "지금 결과 그대로 쓴다"고 확인한 변경의 지문. 변경이 또 생기면 다시 재검토가 뜬다. */
  reviewAck?: string;
}

export interface ScriptBlock {
  id: string;
  type: 'heading' | 'action' | 'dialogue';
  who?: string;
  text: string;
  /** 이 줄이 속한 컷 */
  cutId?: string;
}

export interface Script {
  blocks: ScriptBlock[];
  /** 0이면 아직 고정 전(초안) */
  pinnedVersion: number;
  /** 마지막으로 고정한 판의 내용. 지금 글과 비교해 달라진 줄을 구한다. */
  base: Record<string, { text: string; who?: string; cutId?: string }> | null;
  pinnedAt?: string;
}

export interface Board {
  id: string;
  title: string;
  scene: string;
  cuts: Cut[];
  script?: Script;
  savedAt?: string;
}

export interface LineDiff {
  id: string;
  who?: string;
  kind: 'changed' | 'added' | 'removed';
  from: string | null;
  to: string | null;
}

export function cutLines(board: Board, cutId: string): ScriptBlock[] {
  return (board.script?.blocks ?? []).filter((b) => b.cutId === cutId);
}

/** 고정한 판과 비교해 이 컷에 걸린 줄 중 달라진 것. 고정 전이면 비교 대상이 없으므로 빈 목록이다. */
export function cutDiffs(board: Board, cutId: string): LineDiff[] {
  const script = board.script;
  if (!script?.base) return [];
  const base = script.base;
  const out: LineDiff[] = [];
  for (const b of script.blocks) {
    const was = base[b.id];
    if (b.cutId === cutId) {
      if (!was || was.cutId !== cutId) {
        // 아직 아무것도 쓰지 않은 새 줄은 변경으로 치지 않는다.
        if (b.text.trim()) out.push({ id: b.id, who: b.who, kind: 'added', from: null, to: b.text });
      }
      else if (was.text !== b.text || (was.who ?? '') !== (b.who ?? '')) out.push({ id: b.id, who: b.who, kind: 'changed', from: was.text, to: b.text });
    }
  }
  for (const [id, was] of Object.entries(base)) {
    if (was.cutId !== cutId) continue;
    const now = script.blocks.find((b) => b.id === id);
    if (!now || now.cutId !== cutId) out.push({ id, who: was.who, kind: 'removed', from: was.text, to: null });
  }
  return out;
}

export function diffSignature(diffs: LineDiff[]): string {
  return diffs.length ? JSON.stringify(diffs.map((d) => [d.id, d.kind, d.to])) : '';
}

/** 이미 그림이나 영상을 만든 컷의 대본 줄이 고정 이후 바뀌었고, 아직 확인하지 않았으면 재검토 대상이다. */
export function needsReview(board: Board, cut: Cut): boolean {
  if (!cut.images.length && !cut.videos.length) return false;
  const sig = diffSignature(cutDiffs(board, cut.id));
  return sig !== '' && sig !== cut.reviewAck;
}

export function scriptDiffCount(board: Board): number {
  const script = board.script;
  if (!script?.base) return 0;
  const base = script.base;
  const changed = script.blocks.filter((b) => {
    const was = base[b.id];
    return !was || was.text !== b.text || (was.who ?? '') !== (b.who ?? '') || was.cutId !== b.cutId;
  }).length;
  const removed = Object.keys(base).filter((id) => !script.blocks.some((b) => b.id === id)).length;
  return changed + removed;
}

export function snapshotScript(blocks: ScriptBlock[]): NonNullable<Script['base']> {
  return Object.fromEntries(blocks.map((b) => [b.id, { text: b.text, who: b.who, cutId: b.cutId }]));
}

export function newBlock(type: ScriptBlock['type'], cutId?: string): ScriptBlock {
  return { id: `b${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`, type, text: '', cutId, ...(type === 'dialogue' ? { who: '' } : {}) };
}

/** 첫 보드에 붙는 대본. 이미 컷 1·2의 결과가 있으므로 v1로 고정된 상태에서 시작한다. */
export function seedScript(): Script {
  const blocks: ScriptBlock[] = [
    { id: 'b1', type: 'heading', text: 'S#3. 여객터미널 매표소 / 실내 / 해 질 녘' },
    { id: 'b2', type: 'action', text: '유리창 아래 낮은 창구. 그 너머로 은조(34)가 지폐를 민다.', cutId: 'c1' },
    { id: 'b3', type: 'dialogue', who: '은조', text: '서무도 편도 한 장이요.', cutId: 'c1' },
    { id: 'b4', type: 'action', text: '매표원 순임(60대), 표를 끊지 않는다. 돋보기를 이마로 밀어 올린 채 은조를 본다.', cutId: 'c2' },
    { id: 'b5', type: 'dialogue', who: '순임', text: '왕복이 싸.', cutId: 'c2' },
    { id: 'b6', type: 'dialogue', who: '은조', text: '나올 일이 없어서요.', cutId: 'c2' },
    { id: 'b7', type: 'dialogue', who: '순임', text: '(표를 밀어 주며) 십이 년 전엔 들어올 일이 없다더니.', cutId: 'c2' },
    { id: 'b8', type: 'action', text: '은조의 시선이 순임의 손등, 오래된 화상 자국에 멎는다.', cutId: 'c3' },
    { id: 'b9', type: 'action', text: '(E) 여섯 시 배의 뱃고동.', cutId: 'c3' },
    { id: 'b10', type: 'dialogue', who: '은조', text: '…솥집 아주머니?', cutId: 'c3' },
  ];
  return { blocks, pinnedVersion: 1, base: snapshotScript(blocks), pinnedAt: '2026-11-10T18:20:00Z' };
}

/** 대본이 없는 옛 보드를 열었을 때 대본을 붙인다. 첫 보드면 준비된 대본을, 아니면 빈 초안을 준다. */
export function ensureScript(board: Board): Board {
  if (board.script && Array.isArray(board.script.blocks)) return board;
  const isSeed = board.id === 'last-ferry-s3' && ['c1', 'c2', 'c3'].every((id) => board.cuts.some((c) => c.id === id));
  return { ...board, script: isSeed ? seedScript() : { blocks: [newBlock('heading')], pinnedVersion: 0, base: null } };
}

type Option = { label: string; text: string };

export const SHOOTING_OPTIONS: Record<keyof Shooting, { title: string; target: 'image' | 'video'; options: Record<string, Option> }> = {
  move: {
    title: '카메라 움직임',
    target: 'video',
    options: {
      fixed: { label: '고정', text: 'Locked-off static camera, no camera movement.' },
      pushIn: { label: '천천히 다가감', text: 'Slow, steady push-in toward the subject in one continuous shot.' },
      pullOut: { label: '천천히 물러남', text: 'Slow, steady pull-back from the subject in one continuous shot.' },
      panLeft: { label: '왼쪽으로 흐름', text: 'Slow smooth pan to the left.' },
      panRight: { label: '오른쪽으로 흐름', text: 'Slow smooth pan to the right.' },
      handheld: { label: '손으로 든 느낌', text: 'Subtle handheld camera with gentle natural sway.' },
    },
  },
  lens: {
    title: '화면 크기',
    target: 'image',
    options: {
      wide: { label: '넓게 (24mm)', text: 'Wide shot on a 24mm lens, showing the surrounding space.' },
      normal: { label: '보통 (35mm)', text: 'Medium shot on a 35mm lens.' },
      portrait: { label: '인물 (50mm)', text: 'Medium close-up on a 50mm lens.' },
      close: { label: '가까이 (85mm)', text: 'Close-up on an 85mm lens.' },
    },
  },
  depth: {
    title: '배경 흐림',
    target: 'image',
    options: {
      shallow: { label: '많이 흐리게', text: 'Shallow depth of field, background softly out of focus.' },
      medium: { label: '보통', text: 'Moderate depth of field.' },
      deep: { label: '또렷하게', text: 'Deep focus, background clearly visible.' },
    },
  },
  light: {
    title: '조명',
    target: 'image',
    options: {
      none: { label: '지정 안 함', text: '' },
      dusk: { label: '해 질 녘', text: 'Warm low dusk sunlight from the side.' },
      overcast: { label: '흐린 낮', text: 'Soft overcast daylight, no hard shadows.' },
      fluorescent: { label: '실내 형광등', text: 'Flat cool fluorescent interior lighting.' },
      night: { label: '밤 가로등', text: 'Night scene lit by a single warm street lamp.' },
    },
  },
  color: {
    title: '색감',
    target: 'image',
    options: {
      none: { label: '지정 안 함', text: '' },
      film: { label: '차분한 필름', text: '35mm film look, muted natural colors, realistic skin texture.' },
      warm: { label: '따뜻하게', text: 'Warm color grade with soft amber tones.' },
      cool: { label: '차갑게', text: 'Cool color grade with teal and blue tones.' },
    },
  },
};

const COMMON_IMAGE = 'Cinematic film still. No text overlay, no subtitles, no watermark.';
const COMMON_VIDEO = 'Natural subtle blinking and breathing, calm restrained acting. No dialogue, mouth stays closed. No cuts.';

function pick(key: keyof Shooting, value: string): string {
  return SHOOTING_OPTIONS[key].options[value]?.text ?? '';
}

/** 그림 설명 + 촬영 설정(화면 크기, 배경 흐림, 조명, 색감)을 합쳐 실제로 보낼 문장을 만든다. */
export function buildImagePrompt(cut: Cut): string {
  const s = cut.shooting;
  return [COMMON_IMAGE, pick('lens', s.lens), cut.imagePrompt.trim(), pick('depth', s.depth), pick('light', s.light), pick('color', s.color)]
    .filter(Boolean)
    .join(' ');
}

/** 연기·움직임 설명 + 촬영 설정(카메라 움직임)을 합쳐 실제로 보낼 문장을 만든다. */
export function buildVideoPrompt(cut: Cut): string {
  return [pick('move', cut.shooting.move), cut.motionPrompt.trim(), COMMON_VIDEO].filter(Boolean).join(' ');
}

export function newCut(index: number): Cut {
  return {
    id: `c${Date.now().toString(36)}`,
    name: `컷 ${index}`,
    lines: '',
    imagePrompt: '',
    motionPrompt: '',
    shooting: { move: 'fixed', lens: 'normal', depth: 'medium', light: 'none', color: 'film' },
    images: [],
    videos: [],
  };
}

/** 저장된 보드가 없을 때 쓰는 첫 보드. 가상 작품의 한 장면이며, 컷 2에는 시범 때 실제로 만든 결과를 넣어 둔다. */
export function seedBoard(): Board {
  const at = '2026-11-10T18:20:00Z';
  return {
    id: 'last-ferry-s3',
    title: '마지막 배는 여섯 시',
    scene: '3씬 매표소 · 해 질 녘 (가상 작품)',
    script: seedScript(),
    cuts: [
      {
        id: 'c1',
        name: '컷 1',
        lines: '은조: 서무도 편도 한 장이요.',
        imagePrompt:
          'Seen from inside a small ferry terminal ticket booth, looking out through clear glass. A Korean woman in her mid-thirties with shoulder-length black hair and a dark coat stands outside, sliding a banknote through the low pass-through slot. Sea and a pier behind her.',
        motionPrompt: 'She slides the banknote forward and waits, looking down at the counter, then lifts her eyes toward the booth.',
        shooting: { move: 'fixed', lens: 'normal', depth: 'medium', light: 'dusk', color: 'film' },
        images: [],
        videos: [],
      },
      {
        id: 'c2',
        name: '컷 2',
        lines: '순임: 왕복이 싸. / 은조: 나올 일이 없어서요. / 순임: 십이 년 전엔 들어올 일이 없다더니.',
        imagePrompt:
          'Seen from outside a small ferry terminal ticket booth, looking in through clean clear glass. A Korean woman in her sixties, the ticket clerk, short gray permed hair, reading glasses pushed up onto her forehead, plain navy cardigan, calm weathered face fully visible and unobstructed, looking straight out at someone off-camera. A low rectangular pass-through slot at the bottom of the glass above a worn wooden counter with a small stack of paper ferry tickets. A faded timetable on the wall behind her.',
        motionPrompt:
          'She studies the person outside the booth for a long quiet moment, eyes narrowing slightly in recognition, a small breath, a slight tilt of the head. Reading glasses stay on her forehead the whole time.',
        shooting: { move: 'pushIn', lens: 'portrait', depth: 'shallow', light: 'dusk', color: 'film' },
        images: [
          { id: 434611145688418, status: 'pending', attempt: 1, cost: 0, prompt: '(시범 때 만든 그림)', createdAt: at },
        ],
        videos: [
          { id: 434614511484289, status: 'pending', attempt: 1, cost: 0, prompt: '(시범 때 만든 영상 · V6 비수기 5초)', createdAt: at, fromImage: 434611145688418 },
        ],
        chosenImage: 434611145688418,
      },
      {
        id: 'c3',
        name: '컷 3',
        lines: '(E) 여섯 시 배의 뱃고동. / 은조: …솥집 아주머니?',
        imagePrompt:
          "Insert shot of an older woman's weathered right hand resting on a worn wooden counter, an old pale burn scar across the back of the hand, sliding a single paper ferry ticket forward. Navy cardigan sleeve at the wrist.",
        motionPrompt: 'The hand slowly pushes the ticket forward across the counter and stops. Fingers stay on the ticket for a moment.',
        shooting: { move: 'fixed', lens: 'close', depth: 'shallow', light: 'dusk', color: 'film' },
        images: [],
        videos: [],
      },
    ],
  };
}
