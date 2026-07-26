import { describe, expect, it } from "vitest";
import {
  LimitError,
  MAX_TOKENS_CAP,
  assertAllowedModel,
  assertPromptLength,
  clampMaxTokens,
} from "./limits";

describe("assertAllowedModel", () => {
  it("화이트리스트 모델을 통과시킨다", () => {
    expect(assertAllowedModel("claude-haiku-4-5")).toBe("claude-haiku-4-5");
    expect(assertAllowedModel("claude-opus-5")).toBe("claude-opus-5");
  });

  it("화이트리스트 밖의 모델을 400으로 거부한다", () => {
    expect(() => assertAllowedModel("claude-fable-5")).toThrowError(LimitError);
    try {
      assertAllowedModel("gpt-4");
    } catch (e) {
      expect((e as LimitError).status).toBe(400);
    }
  });
});

describe("clampMaxTokens", () => {
  it("값이 없으면 상한을 준다", () => {
    expect(clampMaxTokens(undefined)).toBe(MAX_TOKENS_CAP);
  });

  it("상한을 넘으면 잘라낸다", () => {
    expect(clampMaxTokens(999999)).toBe(MAX_TOKENS_CAP);
  });

  it("상한 이하는 그대로 둔다", () => {
    expect(clampMaxTokens(256)).toBe(256);
  });

  it("0 이하는 최소 1로 올린다", () => {
    expect(clampMaxTokens(0)).toBe(1);
    expect(clampMaxTokens(-5)).toBe(1);
  });

  it("소수는 내림한다", () => {
    expect(clampMaxTokens(10.9)).toBe(10);
  });
});

describe("assertPromptLength", () => {
  it("짧은 프롬프트를 통과시킨다", () => {
    expect(() => assertPromptLength("안녕")).not.toThrow();
  });

  it("너무 긴 프롬프트를 400으로 거부한다", () => {
    expect(() => assertPromptLength("가".repeat(8001))).toThrowError(LimitError);
  });
});
