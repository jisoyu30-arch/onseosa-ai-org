import type { PosToken, PartOfSpeech } from '../constants/partOfSpeech';
import type { LearningMode } from '../types';
import { ES_EXTRA, EN_EXTRA, ZH_EXTRA } from './pos-dict-extra';

// ===== 사전 (정답 있는 단어만 색상 적용, 나머지는 'none' 그레이아웃) =====

// 스페인어
const ES_BASE: Record<string, { pos: PartOfSpeech; ko?: string }> = {
  // 인사/감탄
  'hola': { pos: 'interjection', ko: '안녕' },
  'adiós': { pos: 'interjection', ko: '잘 가' },
  'gracias': { pos: 'interjection', ko: '고마워' },
  'perdón': { pos: 'interjection', ko: '미안해' },
  'disculpa': { pos: 'interjection', ko: '실례' },
  'disculpame': { pos: 'interjection', ko: '미안해' },
  'bienvenido': { pos: 'interjection', ko: '환영해' },
  'bienvenidos': { pos: 'interjection', ko: '환영해' },
  'sí': { pos: 'interjection', ko: '응/네' },
  'no': { pos: 'adverb', ko: '아니' },
  'claro': { pos: 'adverb', ko: '물론' },
  'dale': { pos: 'interjection', ko: '그래(아르헨)' },
  // 주어 대명사
  'yo': { pos: 'subject', ko: '나' },
  'tú': { pos: 'subject', ko: '너' },
  'vos': { pos: 'subject', ko: '너(아르헨)' },
  'usted': { pos: 'subject', ko: '당신' },
  'él': { pos: 'subject', ko: '그' },
  'ella': { pos: 'subject', ko: '그녀' },
  'nosotros': { pos: 'subject', ko: '우리' },
  'ustedes': { pos: 'subject', ko: '당신들' },
  'ellos': { pos: 'subject', ko: '그들' },
  'ellas': { pos: 'subject', ko: '그녀들' },
  // ser/estar/haber/tener 활용형
  'soy': { pos: 'verb', ko: '~이다(1인칭)' },
  'eres': { pos: 'verb', ko: '~이다(2인칭)' },
  'sos': { pos: 'verb', ko: '~이다(vos)' },
  'es': { pos: 'verb', ko: '~이다(3인칭)' },
  'somos': { pos: 'verb', ko: '우리는~이다' },
  'son': { pos: 'verb', ko: '그들은~이다' },
  'estoy': { pos: 'verb', ko: '~있다(1인칭)' },
  'estás': { pos: 'verb', ko: '~있다(2인칭)' },
  'está': { pos: 'verb', ko: '~있다(3인칭)' },
  'estamos': { pos: 'verb', ko: '우리~있다' },
  'están': { pos: 'verb', ko: '그들~있다' },
  'estaba': { pos: 'verb', ko: '~있었다' },
  'estuve': { pos: 'verb', ko: '~있었다' },
  'fue': { pos: 'verb', ko: '~였다' },
  'era': { pos: 'verb', ko: '~였다(미완료)' },
  'hay': { pos: 'verb', ko: '있다' },
  'tengo': { pos: 'verb', ko: '가지다(1인칭)' },
  'tienes': { pos: 'verb', ko: '가지다(2인칭)' },
  'tiene': { pos: 'verb', ko: '가지다(3인칭)' },
  'tenemos': { pos: 'verb', ko: '우리 가지다' },
  // 자주 쓰는 동사
  'bailo': { pos: 'verb', ko: '춤추다(1인칭)' },
  'bailas': { pos: 'verb', ko: '춤추다(2인칭)' },
  'baila': { pos: 'verb', ko: '춤추다(3인칭)' },
  'bailamos': { pos: 'verb', ko: '우리 춤추다' },
  'bailar': { pos: 'verb', ko: '춤추다' },
  'bailemos': { pos: 'verb', ko: '춤추자' },
  'vamos': { pos: 'verb', ko: '가자' },
  'vas': { pos: 'verb', ko: '가다(2)' },
  'va': { pos: 'verb', ko: '가다(3)' },
  'voy': { pos: 'verb', ko: '가다(1)' },
  'ir': { pos: 'verb', ko: '가다' },
  'mira': { pos: 'verb', ko: '봐' },
  'mirá': { pos: 'verb', ko: '봐(vos)' },
  'miro': { pos: 'verb', ko: '보다(1)' },
  'miró': { pos: 'verb', ko: '봤다(3)' },
  'escucho': { pos: 'verb', ko: '듣다(1)' },
  'relajá': { pos: 'verb', ko: '긴장 풀어' },
  'relaja': { pos: 'verb', ko: '긴장 풀어' },
  'soltá': { pos: 'verb', ko: '놓아(vos)' },
  'bajá': { pos: 'verb', ko: '내려(vos)' },
  'sonreí': { pos: 'verb', ko: '웃어(vos)' },
  'permites': { pos: 'verb', ko: '허락하다(2)' },
  'quiero': { pos: 'verb', ko: '원하다(1)' },
  'quieres': { pos: 'verb', ko: '원하다(2)' },
  'puedes': { pos: 'verb', ko: '할 수 있다(2)' },
  'puedo': { pos: 'verb', ko: '할 수 있다(1)' },
  'gusta': { pos: 'verb', ko: '마음에 들다' },
  'gustan': { pos: 'verb', ko: '마음에 들다(복)' },
  'gustaría': { pos: 'verb', ko: '~하고 싶다' },
  'esperamos': { pos: 'verb', ko: '기다리자' },
  'espero': { pos: 'verb', ko: '기다리다(1)' },
  // 관사
  'el': { pos: 'article', ko: '그(남)' },
  'la': { pos: 'article', ko: '그(여)' },
  'los': { pos: 'article', ko: '그들(남)' },
  'las': { pos: 'article', ko: '그들(여)' },
  'un': { pos: 'article', ko: '어떤(남)' },
  'una': { pos: 'article', ko: '어떤(여)' },
  'unos': { pos: 'article', ko: '어떤들(남)' },
  'unas': { pos: 'article', ko: '어떤들(여)' },
  // 전치사
  'de': { pos: 'preposition', ko: '~의' },
  'a': { pos: 'preposition', ko: '~로/에' },
  'en': { pos: 'preposition', ko: '~에' },
  'con': { pos: 'preposition', ko: '~와' },
  'sin': { pos: 'preposition', ko: '~없이' },
  'para': { pos: 'preposition', ko: '~위해' },
  'por': { pos: 'preposition', ko: '~때문에' },
  'contigo': { pos: 'preposition', ko: '너와 함께' },
  'conmigo': { pos: 'preposition', ko: '나와 함께' },
  'desde': { pos: 'preposition', ko: '~부터' },
  'hasta': { pos: 'preposition', ko: '~까지' },
  // 자주 쓰는 형용사·부사
  'bien': { pos: 'adverb', ko: '잘' },
  'mal': { pos: 'adverb', ko: '나쁘게' },
  'muy': { pos: 'adverb', ko: '매우' },
  'mucho': { pos: 'adverb', ko: '많이' },
  'poco': { pos: 'adverb', ko: '조금' },
  'ahora': { pos: 'adverb', ko: '지금' },
  'aquí': { pos: 'adverb', ko: '여기' },
  'allí': { pos: 'adverb', ko: '저기' },
  'todavía': { pos: 'adverb', ko: '아직' },
  'ya': { pos: 'adverb', ko: '이미' },
  'también': { pos: 'adverb', ko: '또한' },
  'hermosa': { pos: 'adjective', ko: '아름다운(여)' },
  'hermoso': { pos: 'adjective', ko: '아름다운(남)' },
  'cómoda': { pos: 'adjective', ko: '편안한(여)' },
  'cómodo': { pos: 'adjective', ko: '편안한(남)' },
  'cansada': { pos: 'adjective', ko: '피곤한(여)' },
  'cansado': { pos: 'adjective', ko: '피곤한(남)' },
  'nuevo': { pos: 'adjective', ko: '새로운' },
  'próxima': { pos: 'adjective', ko: '다음(여)' },
  'próximo': { pos: 'adjective', ko: '다음(남)' },
  'primera': { pos: 'adjective', ko: '첫(여)' },
  'primer': { pos: 'adjective', ko: '첫' },
  // 접속사
  'y': { pos: 'conjunction', ko: '그리고' },
  'o': { pos: 'conjunction', ko: '또는' },
  'pero': { pos: 'conjunction', ko: '그러나' },
  'porque': { pos: 'conjunction', ko: '왜냐하면' },
  'si': { pos: 'conjunction', ko: '만약' },
  'que': { pos: 'conjunction', ko: '~라는' },
  // 목적어 대명사
  'me': { pos: 'object', ko: '나를/에게' },
  'te': { pos: 'object', ko: '너를/에게' },
  'lo': { pos: 'object', ko: '그것을(남)' },
  'los': { pos: 'object', ko: '그들을' },
  'nos': { pos: 'object', ko: '우리를' },
  // 소유
  'mi': { pos: 'article', ko: '내' },
  'tu': { pos: 'article', ko: '네' },
  'su': { pos: 'article', ko: '그의/그녀의' },
  'nuestro': { pos: 'article', ko: '우리의' },
  'mis': { pos: 'article', ko: '내~들' },
  'tus': { pos: 'article', ko: '네~들' },
  // 탱고 용어
  'tanda': { pos: 'object', ko: '탄다' },
  'milonga': { pos: 'object', ko: '밀롱가' },
  'pista': { pos: 'object', ko: '댄스플로어' },
  'abrazo': { pos: 'object', ko: '아브라소' },
  'tango': { pos: 'object', ko: '탱고' },
};

// 영어
const EN_BASE: Record<string, { pos: PartOfSpeech; ko?: string }> = {
  'hi': { pos: 'interjection', ko: '안녕' },
  'hello': { pos: 'interjection', ko: '안녕' },
  'thanks': { pos: 'interjection', ko: '고마워' },
  'sorry': { pos: 'interjection', ko: '미안해' },
  'please': { pos: 'interjection', ko: '부탁해' },
  'welcome': { pos: 'interjection', ko: '환영해' },
  'yes': { pos: 'interjection', ko: '응' },
  'ok': { pos: 'interjection', ko: '좋아' },
  'okay': { pos: 'interjection', ko: '좋아' },
  'sure': { pos: 'adverb', ko: '물론' },
  // 주어
  'i': { pos: 'subject', ko: '나' },
  'you': { pos: 'subject', ko: '너/너를' },
  'he': { pos: 'subject', ko: '그' },
  'she': { pos: 'subject', ko: '그녀' },
  'we': { pos: 'subject', ko: '우리' },
  'they': { pos: 'subject', ko: '그들' },
  'it': { pos: 'subject', ko: '그것' },
  // be/have/do
  'am': { pos: 'verb', ko: '~이다(1)' },
  'is': { pos: 'verb', ko: '~이다(3)' },
  'are': { pos: 'verb', ko: '~이다' },
  'was': { pos: 'verb', ko: '~였다' },
  'were': { pos: 'verb', ko: '~였다(복)' },
  'been': { pos: 'verb', ko: '~였던' },
  'have': { pos: 'verb', ko: '가지다' },
  'has': { pos: 'verb', ko: '가지다(3)' },
  'had': { pos: 'verb', ko: '가졌다' },
  'do': { pos: 'verb', ko: '하다' },
  'does': { pos: 'verb', ko: '하다(3)' },
  'did': { pos: 'verb', ko: '했다' },
  'dance': { pos: 'verb', ko: '춤추다' },
  'dances': { pos: 'verb', ko: '춤추다(3)' },
  'dancing': { pos: 'verb', ko: '춤추는' },
  'look': { pos: 'verb', ko: '보다' },
  'looks': { pos: 'verb', ko: '보다(3)' },
  'looking': { pos: 'verb', ko: '보는' },
  'looked': { pos: 'verb', ko: '봤다' },
  'see': { pos: 'verb', ko: '보다' },
  'saw': { pos: 'verb', ko: '봤다' },
  'go': { pos: 'verb', ko: '가다' },
  'goes': { pos: 'verb', ko: '가다(3)' },
  'went': { pos: 'verb', ko: '갔다' },
  'come': { pos: 'verb', ko: '오다' },
  'came': { pos: 'verb', ko: '왔다' },
  'relax': { pos: 'verb', ko: '긴장 풀다' },
  'nod': { pos: 'verb', ko: '끄덕이다' },
  'nodded': { pos: 'verb', ko: '끄덕였다' },
  'leave': { pos: 'verb', ko: '떠나다' },
  'left': { pos: 'verb', ko: '떠났다' },
  'save': { pos: 'verb', ko: '남겨두다' },
  'wait': { pos: 'verb', ko: '기다리다' },
  'waiting': { pos: 'verb', ko: '기다리는' },
  'enjoy': { pos: 'verb', ko: '즐기다' },
  'enjoyed': { pos: 'verb', ko: '즐겼다' },
  'learn': { pos: 'verb', ko: '배우다' },
  'learned': { pos: 'verb', ko: '배웠다' },
  'felt': { pos: 'verb', ko: '느꼈다' },
  'feel': { pos: 'verb', ko: '느끼다' },
  'think': { pos: 'verb', ko: '생각하다' },
  'thought': { pos: 'verb', ko: '생각했다' },
  'make': { pos: 'verb', ko: '만들다' },
  'made': { pos: 'verb', ko: '만들었다' },
  // 조동사
  'will': { pos: 'article', ko: '~할 것' },
  'would': { pos: 'article', ko: '~할 것' },
  'can': { pos: 'article', ko: '~할 수 있다' },
  'could': { pos: 'article', ko: '~할 수 있었다' },
  'shall': { pos: 'article', ko: '~할까' },
  'should': { pos: 'article', ko: '~해야 한다' },
  'may': { pos: 'article', ko: '~해도 된다' },
  'might': { pos: 'article', ko: '~일지도' },
  'must': { pos: 'article', ko: '~해야 한다' },
  "let's": { pos: 'article', ko: '~하자' },
  // 관사
  'the': { pos: 'article', ko: '그' },
  'a': { pos: 'article', ko: '어떤' },
  'an': { pos: 'article', ko: '어떤' },
  // 전치사
  'of': { pos: 'preposition', ko: '~의' },
  'to': { pos: 'preposition', ko: '~로' },
  'in': { pos: 'preposition', ko: '~안' },
  'on': { pos: 'preposition', ko: '~위' },
  'at': { pos: 'preposition', ko: '~에' },
  'for': { pos: 'preposition', ko: '~위해' },
  'with': { pos: 'preposition', ko: '~와' },
  'without': { pos: 'preposition', ko: '~없이' },
  'from': { pos: 'preposition', ko: '~부터' },
  'after': { pos: 'preposition', ko: '~후' },
  'before': { pos: 'preposition', ko: '~전' },
  'about': { pos: 'preposition', ko: '~에 대해' },
  // 접속사
  'and': { pos: 'conjunction', ko: '그리고' },
  'or': { pos: 'conjunction', ko: '또는' },
  'but': { pos: 'conjunction', ko: '그러나' },
  'if': { pos: 'conjunction', ko: '만약' },
  'that': { pos: 'conjunction', ko: '~라는' },
  'because': { pos: 'conjunction', ko: '때문에' },
  // 부사
  'not': { pos: 'adverb', ko: '아니' },
  "don't": { pos: 'adverb', ko: '~하지 마' },
  "doesn't": { pos: 'adverb', ko: '~하지 않음' },
  'very': { pos: 'adverb', ko: '매우' },
  'really': { pos: 'adverb', ko: '정말' },
  'now': { pos: 'adverb', ko: '지금' },
  'here': { pos: 'adverb', ko: '여기' },
  'there': { pos: 'adverb', ko: '거기' },
  'too': { pos: 'adverb', ko: '너무' },
  'also': { pos: 'adverb', ko: '또한' },
  'still': { pos: 'adverb', ko: '아직' },
  'already': { pos: 'adverb', ko: '이미' },
  'well': { pos: 'adverb', ko: '잘' },
  // 소유
  'my': { pos: 'article', ko: '내' },
  'your': { pos: 'article', ko: '네' },
  'his': { pos: 'article', ko: '그의' },
  'her': { pos: 'article', ko: '그녀의' },
  'our': { pos: 'article', ko: '우리의' },
  'their': { pos: 'article', ko: '그들의' },
  // 형용사
  'beautiful': { pos: 'adjective', ko: '아름다운' },
  'great': { pos: 'adjective', ko: '멋진' },
  'good': { pos: 'adjective', ko: '좋은' },
  'bad': { pos: 'adjective', ko: '나쁜' },
  'comfortable': { pos: 'adjective', ko: '편안한' },
  'tired': { pos: 'adjective', ko: '피곤한' },
  'new': { pos: 'adjective', ko: '새로운' },
  'next': { pos: 'adjective', ko: '다음' },
  'first': { pos: 'adjective', ko: '첫' },
  'last': { pos: 'adjective', ko: '마지막' },
  // 탱고 용어
  'tanda': { pos: 'object', ko: '탄다' },
  'milonga': { pos: 'object', ko: '밀롱가' },
  'floor': { pos: 'object', ko: '플로어' },
  'embrace': { pos: 'object', ko: '포옹' },
  'tango': { pos: 'object', ko: '탱고' },
};

// 중국어 (greedy match, 길이 긴 것부터)
const ZH_RAW_BASE: { w: string; pos: PartOfSpeech; ko?: string }[] = [
  // 인사
  { w: '谢谢', pos: 'interjection', ko: '고마워' },
  { w: '对不起', pos: 'interjection', ko: '미안해' },
  { w: '不好意思', pos: 'interjection', ko: '죄송해' },
  { w: '抱歉', pos: 'interjection', ko: '죄송해' },
  { w: '欢迎', pos: 'interjection', ko: '환영해' },
  { w: '请', pos: 'verb', ko: '부탁/청하다' },
  // 주어
  { w: '我们', pos: 'subject', ko: '우리' },
  { w: '你们', pos: 'subject', ko: '너희' },
  { w: '他们', pos: 'subject', ko: '그들' },
  { w: '她们', pos: 'subject', ko: '그녀들' },
  { w: '我', pos: 'subject', ko: '나' },
  { w: '你', pos: 'subject', ko: '너' },
  { w: '他', pos: 'subject', ko: '그' },
  { w: '她', pos: 'subject', ko: '그녀' },
  { w: '它', pos: 'subject', ko: '그것' },
  // 동사
  { w: '跳舞', pos: 'verb', ko: '춤추다' },
  { w: '跳', pos: 'verb', ko: '뛰다/추다' },
  { w: '是', pos: 'verb', ko: '~이다' },
  { w: '有', pos: 'verb', ko: '있다/가지다' },
  { w: '没有', pos: 'verb', ko: '없다' },
  { w: '没', pos: 'adverb', ko: '~안' },
  { w: '去', pos: 'verb', ko: '가다' },
  { w: '来', pos: 'verb', ko: '오다' },
  { w: '看', pos: 'verb', ko: '보다' },
  { w: '听', pos: 'verb', ko: '듣다' },
  { w: '想', pos: 'verb', ko: '생각/원하다' },
  { w: '邀请', pos: 'verb', ko: '초대하다' },
  { w: '喜欢', pos: 'verb', ko: '좋아하다' },
  { w: '感谢', pos: 'verb', ko: '감사하다' },
  { w: '放松', pos: 'verb', ko: '긴장 풀다' },
  { w: '学', pos: 'verb', ko: '배우다' },
  { w: '等', pos: 'verb', ko: '기다리다' },
  { w: '点头', pos: 'verb', ko: '끄덕이다' },
  // 조동사
  { w: '可以', pos: 'article', ko: '~할 수 있다' },
  { w: '能', pos: 'article', ko: '~할 수 있다' },
  { w: '要', pos: 'article', ko: '~할 것이다' },
  { w: '会', pos: 'article', ko: '~할 줄 알다' },
  { w: '得', pos: 'article', ko: '~해야 한다' },
  // 관사·지시
  { w: '这个', pos: 'article', ko: '이것' },
  { w: '那个', pos: 'article', ko: '저것' },
  { w: '这首', pos: 'article', ko: '이 곡' },
  { w: '这', pos: 'article', ko: '이' },
  { w: '那', pos: 'article', ko: '저' },
  // 전치사/조사
  { w: '在', pos: 'preposition', ko: '~에' },
  { w: '从', pos: 'preposition', ko: '~부터' },
  { w: '到', pos: 'preposition', ko: '~까지' },
  { w: '和', pos: 'preposition', ko: '~와' },
  { w: '跟', pos: 'preposition', ko: '~와' },
  { w: '给', pos: 'preposition', ko: '~에게' },
  { w: '对', pos: 'preposition', ko: '~에게/맞다' },
  { w: '的', pos: 'particle', ko: '~의' },
  { w: '了', pos: 'particle', ko: '완료/변화' },
  { w: '吗', pos: 'particle', ko: '?(의문)' },
  { w: '吧', pos: 'particle', ko: '~하자' },
  { w: '呢', pos: 'particle', ko: '~은?' },
  { w: '啊', pos: 'particle', ko: '~아!' },
  { w: '着', pos: 'particle', ko: '~하고 있다' },
  // 부사
  { w: '很', pos: 'adverb', ko: '매우' },
  { w: '非常', pos: 'adverb', ko: '대단히' },
  { w: '都', pos: 'adverb', ko: '모두' },
  { w: '也', pos: 'adverb', ko: '또한' },
  { w: '还', pos: 'adverb', ko: '아직' },
  { w: '就', pos: 'adverb', ko: '바로' },
  { w: '不', pos: 'adverb', ko: '아니' },
  { w: '别', pos: 'adverb', ko: '~하지 마' },
  { w: '一起', pos: 'adverb', ko: '같이' },
  // 형용사
  { w: '美好', pos: 'adjective', ko: '아름다운' },
  { w: '漂亮', pos: 'adjective', ko: '예쁜' },
  { w: '好', pos: 'adjective', ko: '좋다' },
  { w: '舒服', pos: 'adjective', ko: '편안한' },
  { w: '累', pos: 'adjective', ko: '피곤한' },
  { w: '新', pos: 'adjective', ko: '새로운' },
  // 접속사
  { w: '如果', pos: 'conjunction', ko: '만약' },
  { w: '但是', pos: 'conjunction', ko: '그러나' },
  { w: '因为', pos: 'conjunction', ko: '때문에' },
  // 탱고 용어
  { w: '探戈', pos: 'object', ko: '탱고' },
  { w: '舞池', pos: 'object', ko: '댄스플로어' },
  { w: '拥抱', pos: 'object', ko: '포옹' },
  { w: '音乐', pos: 'object', ko: '음악' },
  // 숫자 기본
  { w: '一', pos: 'adjective', ko: '하나' },
  { w: '两', pos: 'adjective', ko: '둘' },
  { w: '首', pos: 'particle', ko: '곡(양사)' },
  { w: '次', pos: 'particle', ko: '번(양사)' },
];

// extra 사전 병합 (Claude/사용자 추가) — base 우선, extra는 누락된 것만 보강
const ES: Record<string, { pos: PartOfSpeech; ko?: string }> = { ...ES_EXTRA, ...ES_BASE };
const EN: Record<string, { pos: PartOfSpeech; ko?: string }> = { ...EN_EXTRA, ...EN_BASE };
const ZH_RAW = [...ZH_RAW_BASE, ...ZH_EXTRA];

// 길이 내림차순 정렬
const ZH = ZH_RAW.slice().sort((a, b) => b.w.length - a.w.length);

// 구두점·공백 정리
const stripPunct = (s: string) => s.replace(/[¿?¡!.,;:()「」""''""…—-]/g, '');

export function tagEnglishOrSpanish(text: string, dict: typeof ES): PosToken[] {
  // 공백 단위로 나누되, 구두점은 별도 토큰
  const tokens: PosToken[] = [];
  const parts = text.split(/(\s+|[¿?¡!.,;:]+)/).filter((p) => p.length > 0);

  for (const part of parts) {
    if (/^\s+$/.test(part)) continue;
    if (/^[¿?¡!.,;:]+$/.test(part)) {
      // 구두점은 이전 토큰에 붙이거나 별도
      tokens.push({ text: part, pos: 'none' });
      continue;
    }
    const clean = stripPunct(part).toLowerCase();
    const entry = dict[clean];
    if (entry) {
      tokens.push({ text: part, pos: entry.pos, ko: entry.ko });
    } else {
      tokens.push({ text: part, pos: 'none' });
    }
  }
  return tokens;
}

export function tagChinese(text: string): PosToken[] {
  const tokens: PosToken[] = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    // 공백·구두점
    if (/[\s，。？！、：；""''（）]/.test(ch)) {
      tokens.push({ text: ch, pos: 'none' });
      i++;
      continue;
    }
    // greedy 매칭
    let matched = false;
    for (const entry of ZH) {
      if (text.substr(i, entry.w.length) === entry.w) {
        tokens.push({ text: entry.w, pos: entry.pos, ko: entry.ko });
        i += entry.w.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push({ text: ch, pos: 'none' });
      i++;
    }
  }
  return tokens;
}

export function tagText(text: string, mode: LearningMode): PosToken[] {
  if (mode === 'es') return tagEnglishOrSpanish(text, ES);
  if (mode === 'en') return tagEnglishOrSpanish(text, EN);
  return tagChinese(text);
}
