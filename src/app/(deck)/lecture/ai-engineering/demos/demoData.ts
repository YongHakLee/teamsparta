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
