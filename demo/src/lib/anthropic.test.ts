import { describe, expect, it } from "vitest";
import { buildMessageParams } from "./anthropic";
import { LimitError, MAX_TOKENS_CAP } from "./limits";

describe("buildMessageParams", () => {
  it("최소 요청을 messages 배열로 만든다", () => {
    const p = buildMessageParams({ model: "claude-haiku-4-5", user: "안녕" });
    expect(p.model).toBe("claude-haiku-4-5");
    expect(p.messages).toEqual([{ role: "user", content: "안녕" }]);
    expect(p.max_tokens).toBe(MAX_TOKENS_CAP);
  });

  it("system이 있으면 넣고 없으면 키 자체를 넣지 않는다", () => {
    const withSys = buildMessageParams({
      model: "claude-haiku-4-5",
      user: "안녕",
      system: "너는 분류기다",
    });
    expect(withSys.system).toBe("너는 분류기다");
    expect(buildMessageParams({ model: "claude-haiku-4-5", user: "안녕" }))
      .not.toHaveProperty("system");
  });

  it("샘플링 파라미터를 지정한 것만 넘긴다", () => {
    const p = buildMessageParams({
      model: "claude-haiku-4-5",
      user: "안녕",
      temperature: 0,
      top_k: 5,
    });
    expect(p.temperature).toBe(0);
    expect(p.top_k).toBe(5);
    expect(p).not.toHaveProperty("top_p");
  });

  it("opus-5에 temperature를 보내도 막지 않는다 — 400 시연이 목적이다", () => {
    const p = buildMessageParams({
      model: "claude-opus-5",
      user: "안녕",
      temperature: 0.7,
    });
    expect(p.temperature).toBe(0.7);
  });

  it("effort를 output_config 안에 넣는다", () => {
    const p = buildMessageParams({
      model: "claude-opus-5",
      user: "안녕",
      effort: "low",
    });
    expect(p.output_config).toEqual({ effort: "low" });
  });

  it("json_schema를 output_config.format으로 넣는다", () => {
    const schema = { type: "object", properties: {} };
    const p = buildMessageParams({
      model: "claude-haiku-4-5",
      user: "안녕",
      json_schema: schema,
    });
    expect(p.output_config).toEqual({
      format: { type: "json_schema", schema },
    });
  });

  it("max_tokens를 상한으로 자른다", () => {
    const p = buildMessageParams({
      model: "claude-haiku-4-5",
      user: "안녕",
      max_tokens: 99999,
    });
    expect(p.max_tokens).toBe(MAX_TOKENS_CAP);
  });

  it("화이트리스트 밖 모델을 거부한다", () => {
    expect(() =>
      buildMessageParams({ model: "claude-fable-5", user: "안녕" }),
    ).toThrowError(LimitError);
  });

  it("system과 user를 합친 길이로 프롬프트 상한을 검사한다", () => {
    expect(() =>
      buildMessageParams({
        model: "claude-haiku-4-5",
        system: "가".repeat(5000),
        user: "나".repeat(5000),
      }),
    ).toThrowError(LimitError);
  });
});
