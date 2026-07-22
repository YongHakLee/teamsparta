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
export type PatternSample = { key: PatternKey; label: string; prompt: string; output: string[]; structured?: boolean };

export const promptPatterns: PatternSample[] = [
  {
    key: "zero", label: "Zero-shot",
    prompt: "다음 리뷰의 감성을 분류해줘.\n리뷰: \"배송은 빨랐지만 품질이 별로였다\"",
    output: ["부정"],
  },
  {
    key: "few", label: "Few-shot",
    prompt: "예시)\n\"최고예요\" → 긍정\n\"다신 안 사요\" → 부정\n\n리뷰: \"배송은 빨랐지만 품질이 별로였다\" →",
    output: ["부정"],
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
  },
];

/* ── RagPipeline (s08) ── */
export type RagChunk = { id: string; text: string; score: number };
export type RagCase = {
  question: string;
  chunks: RagChunk[];
  groundedAnswer: string;
  ungroundedAnswer: string;
};

export const RAG_STAGES = ["질문", "임베딩", "검색", "증강", "생성"] as const;

export const ragCase: RagCase = {
  question: "우리 회사 환불 정책은 며칠까지 가능해?",
  chunks: [
    { id: "policy-04", text: "환불은 구매일로부터 14일 이내 미개봉 상품에 한해 가능하다.", score: 0.94 },
    { id: "policy-07", text: "단순 변심 환불 시 왕복 배송비는 고객이 부담한다.", score: 0.71 },
    { id: "faq-12", text: "교환은 상품 수령 후 7일 이내 신청할 수 있다.", score: 0.38 },
  ],
  groundedAnswer: "환불은 구매일로부터 14일 이내, 미개봉 상품에 한해 가능합니다. (근거: policy-04)",
  ungroundedAnswer: "보통 30일 정도면 환불되는 경우가 많습니다. (근거 없음 — 실제 정책과 다를 수 있음)",
};
