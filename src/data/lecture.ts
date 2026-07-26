export type Part = { id: "p1" | "p2"; label: string; title: string };
export type DemoId =
  | "nextToken"
  | "promptPattern"
  | "ragPipeline"
  | "antiPattern"
  | "embedding"
  | "ragFailure";

export type Slide = {
  id: string;
  partId?: Part["id"];
  eyebrow: string;
  kind: "cover" | "content" | "closing";
  demo?: DemoId;
  /* promptPattern 데모가 어떤 탭 집합을 보일지. 슬라이드 id에 의존하지 않도록 데이터로 둔다. */
  demoVariant?: "patterns" | "structured";
  steps?: number;
  title?: string;
  body?: string[];
};

export const deckMeta = {
  title: "AI 리터러시 · 프롬프트 엔지니어링 / RAG",
  subtitle:
    "모델을 이해하여 올바르게 지시하고, 신뢰할 수 있는 정보를 연결한다.",
  author: "이용학",
};

export const parts: Part[] = [
  { id: "p1", label: "PART 1", title: "이해·지시 — 리터러시 & 프롬프팅" },
  { id: "p2", label: "PART 2", title: "연결 — RAG" },
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
    steps: 2,
    title: "두 가지 방식으로 AI를 다룬다",
    body: [
      "이해하고 지시한다 — 모델이 답을 만드는 방식을 이해하고, 프롬프트 엔지니어링(prompt engineering)으로 정확히 지시한다.",
      "연결한다 — 모델이 모르는 최신·세부 지식을 RAG(Retrieval-Augmented Generation)로 붙인다.",
    ],
  },
  {
    id: "s03",
    partId: "p1",
    eyebrow: "PART 1 · 동작 원리",
    kind: "content",
    demo: "nextToken",
    steps: 3,
    title: "LLM은 '다음 단어'를 확률로 고른다.",
    body: [
      "토큰(token) — 모델은 글자가 아니라 토큰 단위로 문장을 쪼개 읽는다.",
      "확률분포 — 다음에 올 토큰 후보에 확률을 매기고 그중 하나를 골라 이어붙인다.",
      "temperature · top-p — 토큰 선택의 무작위성을 조절한다.",
    ],
  },
  {
    id: "s04",
    partId: "p1",
    eyebrow: "PART 1 · 한계",
    kind: "content",
    steps: 3,
    title: "그래서 생기는 세 가지 한계",
    body: [
      "환각(hallucination) — 그럴듯한 거짓을 자신 있게 만든다.",
      "지식 컷오프(knowledge cutoff) — 학습 시점 이후를 모른다.",
      "편향(bias) — 학습 데이터의 치우침을 물려받는다.",
    ],
  },
  {
    id: "s05",
    partId: "p1",
    eyebrow: "PART 1 · 프롬프팅",
    kind: "content",
    demo: "promptPattern",
    demoVariant: "patterns",
    steps: 3,
    title: "같은 질문, 다른 지시 방법",
    body: [
      "Zero-shot — 예시 없이 지시만 준다. 빠르고 저렴, 형식은 흔들릴 수 있다.",
      "Few-shot(in-context learning) — 예시 2~5개로 형식·톤을 고정한다.",
      "CoT(Chain-of-Thought) — '단계적으로 생각하라'로 추론 정확도를 높인다.",
    ],
  },
  {
    id: "s06",
    partId: "p1",
    eyebrow: "PART 1 · 안티패턴",
    kind: "content",
    demo: "antiPattern",
    steps: 4,
    title: "프롬프트 안티패턴 — 나쁜 지시가 만드는 나쁜 답",
    body: [
      "고치는 법은 늘 같다 — 무엇을, 어떤 형식으로, 근거가 없을 때는 어떻게 답할지까지 적는다.",
    ],
  },
  {
    id: "s07",
    partId: "p1",
    eyebrow: "PART 1 · 구조화 출력",
    kind: "content",
    demo: "promptPattern",
    demoVariant: "structured",
    steps: 3,
    title: "출력을 JSON으로 받는 이유",
    /* 세 줄이 상한이다 — 한 줄만 더 늘어도 「구조화 출력」 탭에서 16:9를 넘는다.
       각 줄도 한 줄에 들어와야 한다(70자 안팎). */
    body: [
      "왜 — 뒤의 코드가 답을 파싱·저장·분기하려면 형식이 매번 같아야 한다.",
      "어떻게 — 스키마·JSON 모드·함수 호출(function calling)로 형식을 강제한다.",
      "그래도 깨진다 — 받는 쪽에서 검증 → 틀린 곳을 붙여 재요청(횟수 상한) → 넘으면 기본값 + 로그.",
    ],
  },
  {
    id: "s08",
    partId: "p2",
    eyebrow: "PART 2 · 필요성",
    kind: "content",
    steps: 2,
    title: "모르는 것은 '찾아서' 답하게 한다.",
    body: [
      "문제 — 최신·세부 지식은 모델 안에 없다 (컷오프·환각)",
      "해법 — 질문에 맞는 문서를 찾아, 답변의 근거로 함께 제공한다. (프롬프트에 주입 · RAG)",
    ],
  },
  {
    id: "s09",
    partId: "p2",
    eyebrow: "PART 2 · 벡터 검색",
    kind: "content",
    demo: "embedding",
    steps: 4,
    title: "벡터 검색은 어떻게 의미를 찾나",
    body: [
      "임베딩(embedding) — 문장을 의미가 담긴 숫자 벡터로 바꾼다.",
      "코사인 유사도(cosine similarity) — 두 벡터가 이루는 각도로 의미가 가까운 순으로 top-k개를 가져온다.",
    ],
  },
  {
    id: "s10",
    partId: "p2",
    eyebrow: "PART 2 · 파이프라인",
    kind: "content",
    demo: "ragPipeline",
    steps: 5,
    title: "RAG 파이프라인 한눈에",
  },
  {
    id: "s11",
    partId: "p2",
    eyebrow: "PART 2 · 검색 품질",
    kind: "content",
    steps: 4,
    title: "검색 품질을 좌우하는 것들",
    body: [
      "청킹(chunking) — 문서를 적당한 크기로 쪼갠다.",
      "임베딩 — 의미를 잘 담는 모델을 고른다.",
      "top-k — 몇 개를 가져올지 균형을 잡는다.",
      "리랭킹(reranking) — 가져온 것 중 진짜 관련된 걸 위로",
    ],
  },
  {
    id: "s12",
    partId: "p2",
    eyebrow: "PART 2 · 실패와 처방",
    kind: "content",
    demo: "ragFailure",
    steps: 4,
    title: "RAG가 틀리는 순간 — 실패 유형과 처방",
    body: [
      "붙였다고 끝이 아니다. 어느 단계가 깨졌는지 나눠 봐야 고칠 수 있다.",
    ],
  },
  {
    id: "s13",
    eyebrow: "정리: 키포인트 두 가지",
    kind: "content",
    steps: 2,
    title: "정리: 키포인트 두 가지",
    body: [
      "이해하고 지시한다 — 확률로 답하는 모델의 한계(환각, 컷오프, 편향)를 이해하고, 형식과 근거(무엇을, 어떤 형식으로, 근거가 없을 때는 어떻게 답할지)까지 지시한다.",
      "연결한다 — 모델이 모르는 지식을 찾아 근거로 붙이고(임베딩, 유사도), 실패 지점을 나누어 고친다(청킹, 임베딩, top-k, 리랭킹).",
    ],
  },
  {
    id: "s14",
    eyebrow: "END",
    kind: "closing",
    title: "감사합니다",
    body: ["이해하고 지시한다 → 연결한다. 이 두 축이 AI 서비스의 뼈대입니다."],
  },
];
