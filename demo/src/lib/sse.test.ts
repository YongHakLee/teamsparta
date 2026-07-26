import { describe, expect, it } from "vitest";
import { parseSseChunk } from "./sse";

describe("parseSseChunk", () => {
  it("완전한 프레임 하나를 파싱한다", () => {
    const { frames, rest } = parseSseChunk(
      'data: {"type":"delta","text":"안녕"}\n\n',
    );
    expect(frames).toEqual([{ type: "delta", text: "안녕" }]);
    expect(rest).toBe("");
  });

  it("한 청크에 담긴 여러 프레임을 순서대로 파싱한다", () => {
    const { frames } = parseSseChunk(
      'data: {"type":"delta","text":"가"}\n\ndata: {"type":"delta","text":"나"}\n\n',
    );
    expect(frames).toHaveLength(2);
    expect(frames[1]).toEqual({ type: "delta", text: "나" });
  });

  it("잘린 프레임은 rest로 남긴다", () => {
    const { frames, rest } = parseSseChunk('data: {"type":"del');
    expect(frames).toEqual([]);
    expect(rest).toBe('data: {"type":"del');
  });

  it("완전한 프레임과 잘린 프레임이 섞인 경우를 처리한다", () => {
    const { frames, rest } = parseSseChunk(
      'data: {"type":"delta","text":"가"}\n\ndata: {"type":"de',
    );
    expect(frames).toHaveLength(1);
    expect(rest).toBe('data: {"type":"de');
  });

  it("망가진 JSON은 건너뛴다", () => {
    const { frames } = parseSseChunk("data: {망가짐}\n\n");
    expect(frames).toEqual([]);
  });
});
