export type TokenCand = { token: string; prob: number };

/* prefix → 다음 후보(원 확률). 사전 정의 트리. 미정의 prefix면 문장 종료 후보만. */
const TREE: Record<string, TokenCand[]> = {
  "": [
    { token: "고양이는", prob: 0.6 },
    { token: "오늘", prob: 0.25 },
    { token: "인공지능은", prob: 0.15 },
  ],
  고양이는: [
    { token: " 창밖을", prob: 0.5 },
    { token: " 잠을", prob: 0.3 },
    { token: " 우주를", prob: 0.2 },
  ],
  "고양이는 창밖을": [
    { token: " 바라본다.", prob: 0.7 },
    { token: " 정복했다.", prob: 0.3 },
  ],
  "고양이는 잠을": [
    { token: " 잔다.", prob: 0.8 },
    { token: " 설계한다.", prob: 0.2 },
  ],
  "고양이는 우주를": [
    { token: " 여행한다.", prob: 0.6 },
    { token: " 계산한다.", prob: 0.4 },
  ],
};

/* temperature로 분포 재조정: 낮으면 뾰족(확률 높은 것 강조), 높으면 평평. */
function applyTemperature(cands: TokenCand[], t: number): TokenCand[] {
  const temp = Math.max(0.05, t);
  const logits = cands.map((c) => Math.log(Math.max(c.prob, 1e-6)) / temp);
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return cands
    .map((c, i) => ({ token: c.token, prob: exps[i] / sum }))
    .sort((a, b) => b.prob - a.prob);
}

export function nextTokenCandidates(
  prefix: string,
  temperature: number,
): TokenCand[] {
  const base = TREE[prefix];
  if (!base) return []; // 종료
  return applyTemperature(base, temperature);
}

/* ── PromptPattern (s05 · s07) ── */
export type PatternKey = "zero" | "few" | "cot" | "structured";
export type PatternSample = {
  key: PatternKey;
  label: string;
  prompt: string;
  output: string[];
  structured?: boolean;
  note?: string;
};

export const promptPatterns: PatternSample[] = [
  {
    key: "zero",
    label: "Zero-shot",
    prompt:
      '다음 리뷰의 감성을 분류해줘.\n리뷰: "배송은 빨랐지만 품질이 별로였다"',
    output: ["부정"],
    note: "예시 없이 지시만. 형식이 흔들릴 수 있어 간단한 작업에 적합.",
  },
  {
    key: "few",
    label: "Few-shot",
    prompt:
      '예시)\n"최고예요" → 긍정\n"다신 안 사요" → 부정\n\n리뷰: "배송은 빨랐지만 품질이 별로였다" →',
    output: ["부정"],
    note: "예시 2~5개가 출력 형식을 고정한다(in-context learning).",
  },
  {
    key: "cot",
    label: "CoT",
    prompt:
      '다음 리뷰를 단계적으로 생각해서 분류해줘.\n리뷰: "배송은 빨랐지만 품질이 별로였다"',
    output: [
      "1) 배송: 빠름 → 긍정 신호",
      "2) 품질: 별로 → 부정 신호",
      "3) 핵심은 제품 품질 → 종합 부정",
      "결론: 부정",
    ],
    note: "'단계적으로'가 중간 추론을 펼치게 해 정확도를 높인다.",
  },
  {
    key: "structured",
    label: "구조화 출력",
    structured: true,
    prompt:
      "리뷰를 분류하고 JSON으로만 답해줘. 스키마: {sentiment, confidence, aspects}",
    /* s07 본문이 세 줄이라 출력은 4줄이 상한이다. sentiment·confidence를 한 줄로 접고,
       aspects는 속성→극성 맵으로 접어 「배송은 긍정 · 품질은 부정」 대비를 남긴다. */
    output: [
      "{",
      '  "sentiment": "negative", "confidence": 0.82,',
      '  "aspects": { "배송": "positive", "품질": "negative" }',
      "}",
    ],
    /* note를 넣으면 슬라이드가 16:9를 넘는다. 설명은 본문 「왜」 줄이 이미 하고 있다. */
  },
];

/* ── RagPipeline (s10) ── */
export type RagStageRow = {
  stage: string;
  en: string;
  withRag: string;
  withoutRag: string;
};

export const ragStageRows: RagStageRow[] = [
  {
    stage: "질문",
    en: "query",
    withRag: "우리 회사 환불 정책은 며칠까지 가능해?",
    withoutRag: "우리 회사 환불 정책은 며칠까지 가능해?",
  },
  {
    stage: "임베딩",
    en: "embedding",
    withRag: "질문을 의미 벡터로 변환",
    withoutRag: "— (검색 안 함)",
  },
  {
    stage: "검색",
    en: "retrieval",
    withRag: "policy-04(0.94) · policy-07(0.71) 검색",
    withoutRag: "— (근거 없음)",
  },
  {
    stage: "증강",
    en: "augmentation",
    withRag: "찾은 문서를 프롬프트에 근거로 주입",
    withoutRag: "— (모델 내부 기억에만 의존)",
  },
  {
    stage: "생성",
    en: "generation",
    withRag:
      "환불은 구매일로부터 14일 이내, 미개봉 상품 한정 (근거: policy-04)",
    withoutRag:
      "보통 30일 정도면 되는 경우가 많습니다. (근거 없음 — 실제와 다를 수 있음)",
  },
];

/* ── 표 계열 데모 공용 (s06 · s09 · s12) ──
   ComparisonTable이 그리는 데이터. 첫 열은 CSS가 굵게 처리하므로 항목명을 둔다. */
export type TableCell = { text: string; en?: string; tone?: "bad" | "good" };
export type TableSpec = {
  columns: string[];
  rows: TableCell[][];
  note?: string;
};

/* 셀 축약 헬퍼 — 데이터가 길어져 읽기 어려워지는 것을 막는다. */
const c = (text: string, tone?: TableCell["tone"], en?: string): TableCell => ({
  text,
  tone,
  en,
});

/* s06 — 프롬프트 안티패턴 */
export const antiPatternTable: TableSpec = {
  columns: ["안티패턴", "나쁜 예", "증상", "고친 예"],
  rows: [
    [
      c("모호한 지시"),
      c('"리뷰 좀 정리해줘"', "bad"),
      c("요약인지 분류인지 모델이 추측 → 호출마다 형식이 달라진다.", "bad"),
      c(
        '"리뷰를 긍정/부정/중립 중 하나로 분류하고 한 단어로만 답해줘."',
        "good",
      ),
    ],
    [
      c("출력 형식 미지정"),
      c('"이 리뷰의 감성을 알려줘"', "bad"),
      c('"약간 부정적인 편입니다" 같은 문장이 와서 파싱에 실패한다.', "bad"),
      c(
        '"sentiment 키만 가진 JSON으로 답해줘. 값은 positive/negative/neutral 중 하나."',
        "good",
      ),
    ],
    [
      c("한 번에 여러 작업"),
      c('"요약하고 번역하고 키워드도 뽑아줘."', "bad"),
      c("뒤쪽 작업일수록 품질이 떨어질 수 있다.", "bad"),
      c("작업을 나눠 호출하거나, 출력 스키마에 항목을 각각 명시한다.", "good"),
    ],
    [
      c("부정형만 지시"),
      c('"틀린 말 하지 마."', "bad"),
      c("무엇을 해야 하는지가 없어 결국 그럴듯하게 지어낸다.", "bad"),
      c("\"제공된 문서에 근거가 없으면 '문서에 없음'이라고 답해줘.\"", "good"),
    ],
  ],
  note: "공통점은 하나다 — 무엇을, 어떤 형식으로, 근거가 없을 땐 어떻게 할지까지 적는다.",
};

/* s09 — 임베딩·유사도. 벡터는 실제 값이 아니라 이해를 돕는 축약 표기다. */
export const embeddingTable: TableSpec = {
  columns: ["문서 속 문장", "의미 벡터(축약)", "질문과의 유사도", "검색됨?"],
  rows: [
    [
      c("환불은 구매일로부터 14일 이내 가능합니다"),
      c("[0.82, -0.11, 0.44, …]"),
      c("0.94", "good"),
      c("1순위", "good"),
    ],
    [
      c("교환은 수령 후 7일 이내에 신청하세요"),
      c("[0.71, -0.08, 0.39, …]"),
      c("0.71", "good"),
      c("2순위", "good"),
    ],
    [
      c("배송은 영업일 기준 2~3일 걸립니다"),
      c("[0.12, 0.55, -0.20, …]"),
      c("0.28", "bad"),
      c("탈락", "bad"),
    ],
    [
      c("채용 공고는 상시 게시됩니다"),
      c("[-0.34, 0.09, 0.61, …]"),
      c("0.05", "bad"),
      c("탈락", "bad"),
    ],
  ],
  note: '질문 "환불은 며칠까지 되나요?"를 같은 방식으로 벡터([0.82, -0.15, 0.41, …])로 바꾼 뒤, 코사인 유사도가 높은 순으로 top-k개를 가져온다.',
};

/* s12 — RAG 실패 유형과 처방 */
export const ragFailureTable: TableSpec = {
  columns: ["실패 유형", "증상", "원인", "처방"],
  rows: [
    [
      c("검색 실패", undefined, "retrieval miss"),
      c('문서에 답이 있는데도 "모른다"고 답한다.', "bad"),
      c(
        "청크가 너무 커서 핵심 문장이 묻히거나, top-k가 모자라 정답 문서가 잘렸다.",
        "bad",
      ),
      c(
        "청크를 줄이고 오버랩을 할당 · top-k를 넉넉히 뽑고 리랭킹으로 정제",
        "good",
      ),
    ],
    [
      c("잡음 유입", undefined, "noise"),
      c("엉뚱한 문서를 근거로 들며 자신 있게 틀린다.", "bad"),
      c("유사도만으로 뽑아 주제가 다른 청크가 상위에 섞였다.", "bad"),
      c(
        "메타데이터 필터로 후보를 좁히고, 리랭킹으로 상위를 다시 정렬한다.",
        "good",
      ),
    ],
    [
      c("근거 무시", undefined, "groundedness"),
      c("근거를 줬는데도 모델이 제 기억으로 답한다.", "bad"),
      c("프롬프트가 근거 사용을 강제하지 않아 내부 지식이 이긴다.", "bad"),
      c(
        '"제공된 문서만 근거로 쓰고 없으면 없다고 답하라" + 출처 표기(citation) 요구.',
        "good",
      ),
    ],
    [
      c("최신성 실패", undefined, "staleness"),
      c("이미 바뀐 옛 정책을 근거로 답한다.", "bad"),
      c("원본이 바뀌었는데 색인이 따라가지 못했다.", "bad"),
      c(
        "문서 변경 시 재색인 · 문서에 유효일자 메타데이터를 붙여 필터링.",
        "good",
      ),
    ],
  ],
  note: "고칠 수 있으려면 어느 단계가 깨졌는지 나눠봐야 한다. 검색 지표(recall@k)와 생성 지표(faithfulness)를 따로 재면 검색이 문제인지 생성이 문제인지 바로 갈린다.",
};
