export type TokenCand = { token: string; prob: number };

/* prefix → 다음 후보(원 확률). 사전 정의 트리. 미정의 prefix면 문장 종료 후보만. */
const TREE: Record<string, TokenCand[]> = {
  "": [
    { token: "고양이는", prob: 0.6 }, { token: "오늘", prob: 0.25 }, { token: "인공지능은", prob: 0.15 },
  ],
  "고양이는": [
    { token: " 창밖을", prob: 0.5 }, { token: " 잠을", prob: 0.3 }, { token: " 우주를", prob: 0.2 },
  ],
  "고양이는 창밖을": [
    { token: " 바라본다.", prob: 0.7 }, { token: " 정복했다.", prob: 0.3 },
  ],
  "고양이는 잠을": [
    { token: " 잔다.", prob: 0.8 }, { token: " 설계한다.", prob: 0.2 },
  ],
  "고양이는 우주를": [
    { token: " 여행한다.", prob: 0.6 }, { token: " 계산한다.", prob: 0.4 },
  ],
};

/* temperature로 분포 재조정: 낮으면 뾰족(확률 높은 것 강조), 높으면 평평. */
function applyTemperature(cands: TokenCand[], t: number): TokenCand[] {
  const temp = Math.max(0.05, t);
  const logits = cands.map((c) => Math.log(Math.max(c.prob, 1e-6)) / temp);
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return cands.map((c, i) => ({ token: c.token, prob: exps[i] / sum }))
    .sort((a, b) => b.prob - a.prob);
}

export function nextTokenCandidates(prefix: string, temperature: number): TokenCand[] {
  const base = TREE[prefix];
  if (!base) return []; // 종료
  return applyTemperature(base, temperature);
}

/* ── PromptPattern (s05–s06) ── */
export type PatternKey = "zero" | "few" | "cot" | "structured";
export type PatternSample = { key: PatternKey; label: string; prompt: string; output: string[]; structured?: boolean; note?: string };

export const promptPatterns: PatternSample[] = [
  {
    key: "zero", label: "Zero-shot",
    prompt: "다음 리뷰의 감성을 분류해줘.\n리뷰: \"배송은 빨랐지만 품질이 별로였다\"",
    output: ["부정"],
    note: "예시 없이 지시만. 형식이 흔들릴 수 있어 간단한 작업에 적합.",
  },
  {
    key: "few", label: "Few-shot",
    prompt: "예시)\n\"최고예요\" → 긍정\n\"다신 안 사요\" → 부정\n\n리뷰: \"배송은 빨랐지만 품질이 별로였다\" →",
    output: ["부정"],
    note: "예시 2~5개가 출력 형식을 고정한다(in-context learning).",
  },
  {
    key: "cot", label: "CoT",
    prompt: "다음 리뷰를 단계적으로 생각해서 분류해줘.\n리뷰: \"배송은 빨랐지만 품질이 별로였다\"",
    output: [
      "1) 배송: 빠름 → 긍정 신호",
      "2) 품질: 별로 → 부정 신호",
      "3) 핵심은 제품 품질 → 종합 부정",
      "결론: 부정",
    ],
    note: "'단계적으로'가 중간 추론을 펼치게 해 정확도를 높인다.",
  },
  {
    key: "structured", label: "구조화 출력", structured: true,
    prompt: "리뷰를 분류하고 JSON으로만 답해줘. 스키마: {sentiment, confidence, aspects[]}",
    output: [
      "{",
      '  "sentiment": "negative",',
      '  "confidence": 0.82,',
      '  "aspects": [',
      '    { "name": "배송", "polarity": "positive" },',
      '    { "name": "품질", "polarity": "negative" }',
      "  ]",
      "}",
    ],
    note: "같은 답을 코드가 바로 쓸 수 있는 JSON으로 못 박는다.",
  },
];

/* ── RagPipeline (s08) ── */
export type RagStageRow = { stage: string; en: string; withRag: string; withoutRag: string };

export const ragStageRows: RagStageRow[] = [
  { stage: "질문", en: "query", withRag: "우리 회사 환불 정책은 며칠까지 가능해?", withoutRag: "우리 회사 환불 정책은 며칠까지 가능해?" },
  { stage: "임베딩", en: "embedding", withRag: "질문을 의미 벡터로 변환", withoutRag: "— (검색 안 함)" },
  { stage: "검색", en: "retrieval", withRag: "policy-04(0.94) · policy-07(0.71) 검색", withoutRag: "— (근거 없음)" },
  { stage: "증강", en: "augmentation", withRag: "찾은 문서를 프롬프트에 근거로 주입", withoutRag: "— (모델 내부 기억에만 의존)" },
  { stage: "생성", en: "generation", withRag: "환불은 구매일로부터 14일 이내, 미개봉 상품 한정 (근거: policy-04)", withoutRag: "보통 30일 정도면 되는 경우가 많습니다 (근거 없음 — 실제와 다를 수 있음)" },
];

/* ── SearchQualityTable (s09) ── */
export type KnobRow = { knob: string; en: string; bad: string; good: string };

export const searchQualityRows: KnobRow[] = [
  { knob: "청킹", en: "chunking", bad: "너무 크면 한 청크에 여러 주제 → 검색 정밀도↓ / 너무 작으면 문맥 잘림", good: "문단 경계 + 오버랩, 수백 토큰 안팎에서 시작해 조정" },
  { knob: "임베딩", en: "embedding", bad: "도메인·언어와 안 맞는 모델 → 의미 유사도 부정확", good: "한국어·전문용어에 강한 모델 선택" },
  { knob: "top-k", en: "top-k", bad: "적으면 정답 문서 놓침(재현율↓) / 많으면 잡음·비용↑", good: "넉넉히 뽑고 리랭킹으로 정제" },
  { knob: "리랭킹", en: "reranking", bad: "벡터 검색 상위가 부정확할 때 그대로 사용", good: "관련도 재점수화로 진짜 관련 문서를 위로" },
];

/* ── LlmOpsMetrics (s10) / LlmOpsCanary (s11) ── */
export type Metric = { label: string; value: string; spark: number[]; desc: string };

export const opsMetrics: Metric[] = [
  { label: "지연(latency) p95", value: "1.8s", spark: [1.4, 1.6, 1.5, 1.9, 1.7, 1.8], desc: "상위 5% 느린 요청 기준선. 평균이 가리는 최악 경험을 본다." },
  { label: "요청당 비용", value: "$0.012", spark: [0.010, 0.011, 0.012, 0.012, 0.013, 0.012], desc: "비용은 토큰 수에 비례한다." },
  { label: "평균 토큰(token)", value: "1,240", spark: [1100, 1180, 1200, 1260, 1230, 1240], desc: "입력+출력 토큰. 곧 비용." },
  { label: "품질 점수", value: "92", spark: [90, 91, 89, 92, 93, 92], desc: "사람/자동 평가로 수치화한 답의 유용성." },
];

export const canarySteps = [5, 25, 50, 100] as const;

/* ── EvalRunTable (s12) ── */
export type EvalRow = { q: string; expected: string; got: string; score: number; pass: boolean };

export const evalRows: EvalRow[] = [
  { q: "환불 기간은?", expected: "14일 이내 미개봉", got: "14일 이내, 미개봉 상품", score: 0.95, pass: true },
  { q: "교환 기간은?", expected: "수령 후 7일 이내", got: "보통 2주 정도", score: 0.40, pass: false },
  { q: "배송비 부담은?", expected: "단순 변심 시 고객 부담", got: "단순 변심 시 고객이 왕복 배송비 부담", score: 0.92, pass: true },
];

/* 신버전 비율이 높아질수록(불량 신버전 가정) 에러율↑·품질↓. 40%↑에서 위험. */
export function canaryOutcome(canaryPct: number): { errorRate: number; quality: number; danger: boolean } {
  const p = Math.max(0, Math.min(100, canaryPct)) / 100;
  const errorRate = +(0.5 + p * p * 11).toFixed(1); // 0.5% → 최대 ~11.5%
  const quality = Math.round(92 - p * 22);           // 92 → 70
  return { errorRate, quality, danger: errorRate > 3 };
}
