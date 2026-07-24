export type Part = { id: "p1" | "p2" | "p3"; label: string; title: string };
export type DemoId = "nextToken" | "promptPattern" | "ragPipeline" | "llmOps";

export type Slide = {
  id: string;
  partId?: Part["id"];
  eyebrow: string;
  kind: "cover" | "content" | "closing";
  demo?: DemoId;
  steps?: number;
  title?: string;
  body?: string[];
};

export const deckMeta = {
  title: "AI 리터러시 · RAG · LLMOps",
  subtitle: "AI 서비스를 설계 → 연결 → 운영하는 세 축",
  author: "이용학",
};

export const parts: Part[] = [
  { id: "p1", label: "PART 1", title: "AI 리터러시 & 프롬프트 엔지니어링" },
  { id: "p2", label: "PART 2", title: "RAG" },
  { id: "p3", label: "PART 3", title: "LLMOps" },
];

export const slides: Slide[] = [
  {
    id: "s01",
    eyebrow: "AI ENGINEERING · 15MIN",
    kind: "cover",
    title: deckMeta.title,
    body: [deckMeta.subtitle],
  },
  {
    id: "s02",
    eyebrow: "OVERVIEW",
    kind: "content",
    title: "AI 서비스는 세 축으로 완성된다",
    steps: 3,
    body: [
      "설계 — 모델을 이해하고 올바르게 지시한다 (프롬프트 엔지니어링)",
      "연결 — 신뢰할 수 있는 외부 지식을 붙인다 (RAG)",
      "운영 — 안정적으로 지표를 보며 배포·관리한다 (LLMOps)",
    ],
  },
  {
    id: "s03",
    partId: "p1",
    eyebrow: "PART 1 · 동작 원리",
    kind: "content",
    demo: "nextToken",
    title: "LLM은 '다음 단어'를 확률로 고른다",
    body: ["아래에서 직접 다음 토큰을 골라 문장을 이어보세요."],
  },
  {
    id: "s04",
    partId: "p1",
    eyebrow: "PART 1 · 한계",
    kind: "content",
    steps: 3,
    title: "그래서 생기는 세 가지 한계",
    body: [
      "환각 — 그럴듯한 거짓을 자신 있게 만든다",
      "지식 컷오프 — 학습 시점 이후를 모른다",
      "편향 — 학습 데이터의 치우침을 물려받는다",
    ],
  },
  {
    id: "s05",
    partId: "p1",
    eyebrow: "PART 1 · 프롬프팅",
    kind: "content",
    demo: "promptPattern",
    steps: 0,
    title: "같은 질문, 다른 지시 방법",
    body: ["Zero-shot · Few-shot · CoT를 아래에서 전환해 비교하세요."],
  },
  {
    id: "s06",
    partId: "p1",
    eyebrow: "PART 1 · 구조화 출력",
    kind: "content",
    demo: "promptPattern",
    title: "출력을 JSON으로 못 박는 이유",
    body: ["자유 텍스트 vs JSON 스키마 — 데모의 '구조화' 탭을 보세요."],
  },
  {
    id: "s07",
    partId: "p2",
    eyebrow: "PART 2 · 필요성",
    kind: "content",
    steps: 2,
    title: "모르는 것은 '찾아서' 답하게 한다",
    body: [
      "문제 — 최신·사내 지식은 모델 안에 없다 (컷오프·환각)",
      "해법 — 질문에 맞는 문서를 찾아 프롬프트에 넣어준다 (RAG)",
    ],
  },
  {
    id: "s08",
    partId: "p2",
    eyebrow: "PART 2 · 파이프라인",
    kind: "content",
    demo: "ragPipeline",
    title: "RAG 파이프라인 한눈에",
    body: ["질문 → 임베딩 → 검색 → 증강 → 생성. 아래에서 ▶로 재생하세요."],
  },
  {
    id: "s09",
    partId: "p2",
    eyebrow: "PART 2 · 검색 품질",
    kind: "content",
    steps: 4,
    title: "검색 품질을 좌우하는 것들",
    body: [
      "청킹 — 문서를 적당한 크기로 쪼갠다",
      "임베딩 — 의미를 잘 담는 모델을 고른다",
      "top-k — 몇 개를 가져올지 균형을 잡는다",
      "리랭킹 — 가져온 것 중 진짜 관련된 걸 위로",
    ],
  },
  {
    id: "s10",
    partId: "p3",
    eyebrow: "PART 3 · 지표",
    kind: "content",
    demo: "llmOps",
    title: "운영은 '보이게' 만드는 것부터",
    body: ["지연(p50/p95) · 요청당 비용 · 토큰 · 품질 점수를 추적한다."],
  },
  {
    id: "s11",
    partId: "p3",
    eyebrow: "PART 3 · 배포",
    kind: "content",
    demo: "llmOps",
    title: "프롬프트도 버전이 있다 — 카나리와 롤백",
    body: ["신버전을 소수 트래픽에만 흘리고(카나리), 지표가 나빠지면 즉시 되돌린다(롤백)."],
  },
  {
    id: "s12",
    partId: "p3",
    eyebrow: "PART 3 · 자동 평가",
    kind: "content",
    steps: 3,
    title: "자동 평가(Evals)로 회귀를 막는다",
    body: [
      "평가셋 — 대표 질문·기대 답을 모은다",
      "실행 — 새 프롬프트/모델을 평가셋에 돌린다",
      "게이트 — 점수가 기준 미달이면 배포를 막는다",
    ],
  },
  {
    id: "s13",
    eyebrow: "정리",
    kind: "content",
    steps: 3,
    title: "세 축을 한 장으로",
    body: [
      "설계 — 모델을 이해하고 올바르게 지시한다",
      "연결 — 신뢰할 지식을 붙여 환각·컷오프를 메운다",
      "운영 — 지표·버전·평가로 안정적으로 굴린다",
    ],
  },
  {
    id: "s14",
    eyebrow: "END",
    kind: "closing",
    title: "감사합니다",
    body: [
      "설계 → 연결 → 운영, 세 축으로 AI 서비스는 완성됩니다.",
      "질문 환영합니다.",
    ],
  },
];
