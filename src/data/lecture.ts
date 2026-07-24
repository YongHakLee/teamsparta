export type Part = { id: "p1" | "p2" | "p3"; label: string; title: string };
export type DemoId = "nextToken" | "promptPattern" | "ragPipeline" | "searchQuality" | "llmOpsMetrics" | "llmOpsCanary" | "evalRun";

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
    eyebrow: "AI ENGINEERING",
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
      "설계 — 모델을 이해하고 프롬프트 엔지니어링(prompt engineering)으로 올바르게 지시한다",
      "연결 — 신뢰할 수 있는 외부 지식을 RAG(Retrieval-Augmented Generation)로 붙인다",
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
  },
  {
    id: "s04",
    partId: "p1",
    eyebrow: "PART 1 · 한계",
    kind: "content",
    steps: 3,
    title: "그래서 생기는 세 가지 한계",
    body: [
      "환각(hallucination) — 그럴듯한 거짓을 자신 있게 만든다",
      "지식 컷오프(knowledge cutoff) — 학습 시점 이후를 모른다",
      "편향(bias) — 학습 데이터의 치우침을 물려받는다",
    ],
  },
  {
    id: "s05",
    partId: "p1",
    eyebrow: "PART 1 · 프롬프팅",
    kind: "content",
    demo: "promptPattern",
    steps: 3,
    title: "같은 질문, 다른 지시 방법",
    body: [
      "Zero-shot — 예시 없이 지시만 준다. 빠르고 저렴, 형식은 흔들릴 수 있다",
      "Few-shot(in-context learning) — 예시 2~5개로 형식·톤을 고정한다",
      "CoT(Chain-of-Thought) — '단계적으로 생각하라'로 추론 정확도를 높인다",
    ],
  },
  {
    id: "s06",
    partId: "p1",
    eyebrow: "PART 1 · 구조화 출력",
    kind: "content",
    demo: "promptPattern",
    steps: 3,
    title: "출력을 JSON으로 못 박는 이유",
    body: [
      "왜 — 뒤의 코드가 답을 파싱·저장·분기해야 한다. 형식이 매번 같아야 한다",
      "어떻게 — JSON 스키마 지정, JSON 모드, 함수 호출(function calling)로 형식을 강제한다",
      "안전장치 — 받는 쪽에서 스키마 검증(schema validation), 실패 시 재요청·기본값",
    ],
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
      "해법 — 질문에 맞는 문서를 찾아, 답변의 근거로 함께 제공한다 (프롬프트에 주입 · RAG)",
    ],
  },
  {
    id: "s08",
    partId: "p2",
    eyebrow: "PART 2 · 파이프라인",
    kind: "content",
    demo: "ragPipeline",
    title: "RAG 파이프라인 한눈에",
    steps: 5,
  },
  {
    id: "s09",
    partId: "p2",
    eyebrow: "PART 2 · 검색 품질",
    kind: "content",
    steps: 4,
    demo: "searchQuality",
    title: "검색 품질을 좌우하는 것들",
    body: [
      "청킹(chunking) — 문서를 적당한 크기로 쪼갠다",
      "임베딩(embedding) — 의미를 잘 담는 모델을 고른다",
      "top-k — 몇 개를 가져올지 균형을 잡는다",
      "리랭킹(reranking) — 가져온 것 중 진짜 관련된 걸 위로",
    ],
  },
  {
    id: "s10",
    partId: "p3",
    eyebrow: "PART 3 · 지표",
    kind: "content",
    demo: "llmOpsMetrics",
    title: "운영은 '보이게' 만드는 것부터",
    body: ["지연(latency) p50/p95 · 요청당 비용 · 토큰 · 품질 점수를 추적한다."],
  },
  {
    id: "s11",
    partId: "p3",
    eyebrow: "PART 3 · 배포",
    kind: "content",
    demo: "llmOpsCanary",
    title: "프롬프트도 버전이 있다 — 카나리와 롤백",
    body: ["카나리(canary)로 신버전을 소수 트래픽에만 흘리고, 지표가 나빠지면 롤백(rollback)으로 즉시 되돌린다."],
  },
  {
    id: "s12",
    partId: "p3",
    eyebrow: "PART 3 · 자동 평가",
    kind: "content",
    steps: 3,
    demo: "evalRun",
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
