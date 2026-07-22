export type Part = { id: "p1" | "p2" | "p3"; label: string; title: string };
export type DemoId = "nextToken" | "promptPattern" | "ragPipeline" | "llmOps";

export type PresenterNote = {
  script: string[];      // ① 말할 것(대본)
  background: string[];  // ② 배경 지식
  qa: { q: string; a: string }[]; // ③ 예상 질문/답변
  demoTips?: string[];   // ④ 데모 조작 팁
};

export type Slide = {
  id: string;
  partId?: Part["id"];
  eyebrow: string;
  kind: "cover" | "content" | "closing";
  demo?: DemoId;
  steps?: number;
  title?: string;
  body?: string[];
  note: PresenterNote;
};

export const deckMeta = {
  title: "AI 리터러시 · RAG · LLMOps",
  subtitle: "AI 서비스를 설계 → 연결 → 운영하는 세 축",
  author: "이용학",
  // 발표자 창 암호의 SHA-256 해시(HEX, 소문자). 임시값("test1234")—Task 5에서 강의자 지정값으로 교체.
  presenterPassHash: "937e8d5fbb48bd4949536cd65b8d35c426b80d2f830c5c308e2cdec422ae2244",
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
    note: {
      script: [
        "안녕하세요. 오늘은 AI 서비스를 만드는 엔지니어가 실제로 다루는 세 가지 축을 15분에 압축해서 보여드리겠습니다.",
        "설계(프롬프트) → 연결(RAG) → 운영(LLMOps) 순서로, 개념을 설명하고 슬라이드 안에서 직접 데모를 돌려 보겠습니다.",
      ],
      background: [
        "AX Agent Engineer는 모델을 '고르는' 사람이 아니라, 모델을 서비스로 '설계·연결·운영'하는 사람이다. 세 축은 그 작업 순서와 같다.",
      ],
      qa: [
        { q: "이 강의를 들으면 뭘 할 수 있게 되나요?", a: "LLM의 동작·한계를 설명하고, 프롬프트 패턴을 구분하고, RAG 파이프라인과 LLMOps 지표의 큰 그림을 그릴 수 있게 됩니다." },
      ],
    },
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
    note: {
      script: [
        "먼저 큰 그림입니다. AI 서비스는 이 세 축이 맞물려 돌아갑니다.",
        "하나씩 →로 등장시키며, 각 축이 '무엇을 해결하는지'만 먼저 걸어두겠습니다. 뒤에서 각각을 데모로 파고듭니다.",
      ],
      background: [
        "세 축은 독립적이지 않다. 프롬프트만으로 안 되는 '최신·사내 지식'을 RAG가 메우고, 그렇게 만든 서비스가 실제로 잘 도는지를 LLMOps가 지킨다.",
      ],
      qa: [
        { q: "왜 이 순서인가요?", a: "만드는 순서와 같습니다. 지시(설계) → 지식 연결 → 운영. 앞이 안 되면 뒤가 의미 없습니다." },
      ],
      demoTips: ["→를 세 번 눌러 한 줄씩 등장. 각 줄에서 잠깐 멈춰 설명."],
    },
  },
  {
    id: "s03",
    partId: "p1",
    eyebrow: "PART 1 · 동작 원리",
    kind: "content",
    demo: "nextToken",
    title: "LLM은 '다음 단어'를 확률로 고른다",
    body: ["아래에서 직접 다음 토큰을 골라 문장을 이어보세요."],
    note: {
      script: [
        "LLM이 '생각한다'고 느껴지지만, 핵심 동작은 단순합니다. 지금까지의 문장을 보고 '다음에 올 확률이 높은 토큰'을 고르는 것을 반복합니다.",
        "아래 데모에서 후보 막대를 클릭해 문장을 이어보세요. temperature를 올리면 확률 낮은 후보도 튀어나옵니다 — 이게 나중에 볼 '환각'의 씨앗입니다.",
      ],
      background: [
        "토큰은 단어 조각이다. 모델은 매 스텝 전체 어휘에 대한 확률분포를 내고, 샘플링 규칙(greedy/temperature/top-p)에 따라 하나를 뽑아 이어붙인다.",
        "temperature가 낮으면 분포에서 가장 확률 높은 토큰 위주로(결정적), 높으면 더 평평하게 섞어 뽑는다(다양·의외).",
      ],
      qa: [
        { q: "그럼 모델은 사실을 '아는' 게 아닌가요?", a: "사실 DB를 조회하는 게 아니라, 학습 분포에서 그럴듯한 다음 토큰을 이어붙입니다. 그래서 그럴듯한 거짓(환각)이 나옵니다 — 다음 슬라이드 주제입니다." },
      ],
      demoTips: ["temperature 슬라이더를 0.2와 1.2로 각각 두고 같은 문장을 이어보면 차이가 극적으로 드러남."],
    },
  },
];
