// Day 1 오리엔테이션 — 언어 소개 + 첫 인사 + 의문/긍정/부정
import type { LearningMode } from '../types';

export interface IntroPhrase {
  text: string;
  ko: string;
  pron?: string;
}

export interface LangIntro {
  flag: string;
  langName: string;
  features: string[];               // 언어 일반 특징
  argentinaSpecial?: string[];      // 아르헨 특수 (ES만)
  greetings: IntroPhrase[];         // 첫 인사
  greetingsKo: string;              // 섹션 설명
  questions: IntroPhrase[];         // 의문형 / 질문법
  questionsKo: string;
  yesNo: IntroPhrase[];             // 긍정/부정 대답
  yesNoKo: string;
}

export const introContent: Record<LearningMode, LangIntro> = {
  // ============ 스페인어 ============
  es: {
    flag: '🇪🇸',
    langName: '스페인어 (Castellano)',
    features: [
      '라틴어에서 파생된 로망스 언어 — 이탈리아어·프랑스어와 친척',
      '음절 박자 (syllable-timed) — 한국어처럼 또박또박',
      '주어를 자주 생략 (동사 활용으로 누가 하는지 알 수 있음)',
      '명사에 성(性) 있음: 남성 -o, 여성 -a',
      '동사 활용이 풍부 (시제·인칭마다 형태 변함)',
    ],
    argentinaSpecial: [
      '🇦🇷 부에노스아이레스에서는 "tú" 대신 "vos" 사용 (voseo)',
      '🇦🇷 ll/y 발음이 "셰/슈" (영어 sh와 비슷): pollo → "포쇼"',
      '🇦🇷 음절 끝 s가 흡음됨: gracias → "그라시아ʰ"',
      '🇦🇷 이탈리아 이민 영향으로 억양이 노래하듯 올라갔다 내려감',
    ],
    greetings: [
      { text: 'Hola', ko: '안녕', pron: '올라' },
      { text: '¿Qué tal?', ko: '어때?', pron: '께 딸?' },
      { text: 'Mucho gusto', ko: '반가워요', pron: '무초 구스또' },
      { text: 'Soy Coreano/a', ko: '저는 한국 사람이에요', pron: '쏘이 꼬레아노' },
      { text: '¿Cómo te llamás?', ko: '이름이 뭐야? (vos)', pron: '꼬모 떼 야마ʰ?' },
    ],
    greetingsKo: '카베세오나 코르티나에서 처음 만났을 때',
    questions: [
      { text: '¿Bailamos?', ko: '우리 출까?', pron: '바일라모스?' },
      { text: '¿De dónde sos?', ko: '어디 사람이야?', pron: '데 돈데 쏘ʰ?' },
      { text: '¿Hace mucho que bailás?', ko: '오래 췄어?', pron: '아쎄 무초 께 바일라ʰ?' },
      { text: '¿Te gusta esta tanda?', ko: '이 탄다 좋아?', pron: '떼 구스따 에스따 딴다?' },
    ],
    questionsKo: '문장 처음에 ¿ 끝에 ? 양쪽 다 사용. 끝을 살짝 올려 읽음',
    yesNo: [
      { text: 'Sí, claro', ko: '응, 물론', pron: '씨, 끌라로' },
      { text: 'Por supuesto', ko: '당연하지', pron: '뽀르 수뿌에스또' },
      { text: 'No, gracias', ko: '아니, 괜찮아', pron: '노, 그라시아ʰ' },
      { text: 'Tal vez', ko: '아마도', pron: '딸 베ʰ' },
      { text: 'Quizás más tarde', ko: '나중에 어쩌면', pron: '끼사ʰ 마ʰ 따르데' },
    ],
    yesNoKo: '"Sí"(네)와 "No"(아니) 단순. 정중하려면 뒤에 표현 추가',
  },

  // ============ 영어 ============
  en: {
    flag: '🇬🇧',
    langName: '영어 (English)',
    features: [
      '게르만어 + 라틴어/프랑스어 혼합 — 어휘 다양',
      '강세 박자 (stress-timed) — 강한 음절·약한 음절 리듬',
      '주어 항상 필수 (생략 거의 없음)',
      '명사에 성(性) 없음 — 외우기 쉬움',
      '시제 12개 (현재완료·과거완료 등 한국어에 없는 것)',
      '문장 어순 SVO 고정 (주어-동사-목적어)',
    ],
    greetings: [
      { text: 'Hi', ko: '안녕', pron: '하이' },
      { text: 'How are you?', ko: '잘 지내?', pron: '하우 아 유?' },
      { text: 'Nice to meet you', ko: '만나서 반가워', pron: '나이스 투 미츄' },
      { text: "I'm Korean", ko: '저는 한국인이에요', pron: '아임 코리언' },
      { text: "What's your name?", ko: '이름이 뭐야?', pron: '왓츠 유어 네임?' },
    ],
    greetingsKo: '탱고 커뮤니티는 국제적 — 영어로 만나는 일 많음',
    questions: [
      { text: 'Shall we dance?', ko: '우리 출까?', pron: '쉘 위 댄스?' },
      { text: 'Where are you from?', ko: '어디서 왔어?', pron: '웨어 아 유 프롬?' },
      { text: 'How long have you been dancing?', ko: '얼마나 췄어?', pron: '하우 롱 해브 유 빈 댄싱?' },
      { text: 'Do you like this music?', ko: '이 음악 좋아?', pron: '두 유 라이크 디스 뮤직?' },
    ],
    questionsKo: '의문문은 조동사(do/does/are/can)로 시작 — 어순이 도치됨',
    yesNo: [
      { text: 'Yes, of course', ko: '응, 물론', pron: '예스, 오브 코스' },
      { text: 'Sure', ko: '당연하지', pron: '슈어' },
      { text: 'No, thanks', ko: '아니, 괜찮아', pron: '노 땡스' },
      { text: 'Maybe later', ko: '나중에 어쩌면', pron: '메이비 레이러' },
      { text: "I'd love to", ko: '정말 좋지', pron: '아이드 러브 투' },
    ],
    yesNoKo: '"Yes/No" 단순. 거절은 거의 항상 "thanks/sorry" 함께',
  },

  // ============ 중국어 ============
  zh: {
    flag: '🇨🇳',
    langName: '중국어 (普通话 / 표준 중국어)',
    features: [
      '한자 사용 — 표의문자 (글자 자체가 의미)',
      '성조 4개 + 경성 — 음의 높낮이로 의미 구분 (mā 妈/엄마, má 麻/마, mǎ 马/말, mà 骂/꾸짖다)',
      '시제 변화 없음 — 시간 단어(昨天/今天/明天)로 시점 표시',
      '동사·명사 형태 변화 없음 — 외우기 쉬움',
      '양사(量词) 필수 — "한 사람" = 一个人 (个 = 사람 양사)',
      '어순 SVO지만 주제 강조 시 도치 가능',
    ],
    greetings: [
      { text: '你好', ko: '안녕', pron: 'nǐ hǎo (니 하오)' },
      { text: '很高兴认识你', ko: '만나서 반가워요', pron: 'hěn gāoxìng rènshi nǐ (헌 까오싱 런스 니)' },
      { text: '我是韩国人', ko: '저는 한국 사람이에요', pron: 'wǒ shì hánguó rén (워 스 한구어 런)' },
      { text: '你叫什么名字？', ko: '이름이 뭐예요?', pron: 'nǐ jiào shénme míngzi (니 쟈오 션머 밍쯔)' },
      { text: '你好吗？', ko: '잘 지내요?', pron: 'nǐ hǎo ma (니 하오 마)' },
    ],
    greetingsKo: '"你好"(니 하오)는 만국 통용 인사',
    questions: [
      { text: '我们跳吗？', ko: '우리 출까?', pron: 'wǒmen tiào ma (워먼 탸오 마)' },
      { text: '你从哪里来？', ko: '어디서 왔어?', pron: 'nǐ cóng nǎlǐ lái (니 총 나리 라이)' },
      { text: '你跳探戈多久了？', ko: '탱고 얼마나 췄어?', pron: 'nǐ tiào tàngē duōjiǔ le (니 탸오 탄거 둬쥬 러)' },
      { text: '你喜欢这首音乐吗？', ko: '이 음악 좋아?', pron: 'nǐ xǐhuan zhè shǒu yīnyuè ma (니 시환 쩌 셔우 인위에 마)' },
    ],
    questionsKo: '의문문은 문장 끝에 "吗"(ma)를 붙임. 의문사(什么/哪里) 사용 시 어순 안 바뀜',
    yesNo: [
      { text: '好的', ko: '좋아', pron: 'hǎo de (하오 더)' },
      { text: '当然', ko: '당연하지', pron: 'dāngrán (당란)' },
      { text: '不用，谢谢', ko: '괜찮아, 고마워', pron: 'búyòng, xièxie (부용, 시에시에)' },
      { text: '可能晚一点', ko: '나중에 어쩌면', pron: 'kěnéng wǎn yìdiǎn (커넝 완 이뎬)' },
      { text: '没问题', ko: '문제없어', pron: 'méi wèntí (메이 원티)' },
    ],
    yesNoKo: '"是/不是"보다 동사 그대로 또는 "好的/不用" 자주 사용',
  },
};
