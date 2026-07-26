import { describe, expect, it } from "vitest";
import { buildRetryPrompt, validateAgainstSchema } from "./validate";

const SCHEMA = {
  type: "object",
  properties: {
    sentiment: { type: "string", enum: ["positive", "negative", "neutral"] },
    confidence: { type: "number" },
  },
  required: ["sentiment", "confidence"],
  additionalProperties: false,
} as const;

describe("validateAgainstSchema", () => {
  it("올바른 값에는 문제가 없다", () => {
    expect(
      validateAgainstSchema({ sentiment: "negative", confidence: 0.8 }, SCHEMA),
    ).toEqual([]);
  });

  it("필수 키 누락을 잡는다", () => {
    const issues = validateAgainstSchema({ sentiment: "negative" }, SCHEMA);
    expect(issues).toHaveLength(1);
    expect(issues[0].path).toBe("confidence");
    expect(issues[0].message).toContain("필수");
  });

  it("타입 불일치를 잡는다", () => {
    const issues = validateAgainstSchema(
      { sentiment: "negative", confidence: "높음" },
      SCHEMA,
    );
    expect(issues).toHaveLength(1);
    expect(issues[0].path).toBe("confidence");
    expect(issues[0].message).toContain("number");
  });

  it("enum 밖의 값을 잡는다", () => {
    const issues = validateAgainstSchema(
      { sentiment: "약간 부정적", confidence: 0.5 },
      SCHEMA,
    );
    expect(issues[0].path).toBe("sentiment");
    expect(issues[0].message).toContain("positive");
  });

  it("스키마에 없는 키를 잡는다", () => {
    const issues = validateAgainstSchema(
      { sentiment: "negative", confidence: 0.5, extra: 1 },
      SCHEMA,
    );
    expect(issues[0].path).toBe("extra");
  });

  it("객체가 아니면 루트 문제로 보고한다", () => {
    const issues = validateAgainstSchema("문자열", SCHEMA);
    expect(issues[0].path).toBe("(root)");
  });

  it("여러 문제를 모두 모은다", () => {
    const issues = validateAgainstSchema({ confidence: "x" }, SCHEMA);
    expect(issues.length).toBeGreaterThanOrEqual(2);
  });
});

describe("buildRetryPrompt", () => {
  it("원래 지시·받은 값·무엇이 틀렸는지를 모두 담는다", () => {
    const p = buildRetryPrompt("리뷰를 분석해줘", '{"sentiment":"x"}', [
      { path: "confidence", message: "필수 항목이 없습니다." },
    ]);
    expect(p).toContain("리뷰를 분석해줘");
    expect(p).toContain('{"sentiment":"x"}');
    expect(p).toContain("confidence");
    expect(p).toContain("필수 항목이 없습니다.");
  });
});
