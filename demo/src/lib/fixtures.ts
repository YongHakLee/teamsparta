import raw from "@/data/fixtures.json";

export type Fixture = {
  presetId: string;
  variantLabel: string;
  text: string;
  usage: { input_tokens: number; output_tokens: number };
};

/**
 * 리허설 중 기록해 둔 실제 응답.
 * 손으로 쓰지 않는다 — 기록 모드(?record=1)에서 받은 것을 그대로 붙여 넣는다.
 */
const byKey = new Map<string, Fixture>(
  (raw as Fixture[]).map((f) => [`${f.presetId}::${f.variantLabel}`, f]),
);

export function loadFixture(
  presetId: string,
  variantLabel: string,
): Fixture | null {
  return byKey.get(`${presetId}::${variantLabel}`) ?? null;
}
