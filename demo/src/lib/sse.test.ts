import { afterEach, describe, expect, it, vi } from "vitest";
import { parseSseChunk, streamGenerate } from "./sse";
import type { SseFrame } from "./wire";

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

describe("streamGenerate", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetch가 throw하면 NetworkError 에러 프레임으로 콜백을 부르고 스스로는 reject하지 않는다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("연결이 끊겼습니다")),
    );
    const onFrame = vi.fn<(f: SseFrame) => void>();

    await expect(
      streamGenerate({ model: "claude-haiku-4-5", user: "hi" }, onFrame),
    ).resolves.toBeUndefined();

    expect(onFrame).toHaveBeenCalledTimes(1);
    expect(onFrame).toHaveBeenCalledWith({
      type: "error",
      status: 0,
      name: "NetworkError",
      message: expect.stringContaining("연결이 끊겼습니다"),
    });
  });

  it("정상 경로에서는 스트림 본문의 프레임을 순서대로 콜백에 전달한다", async () => {
    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(
          encoder.encode('data: {"type":"delta","text":"가"}\n\n'),
        );
        controller.enqueue(
          encoder.encode('data: {"type":"delta","text":"나"}\n\n'),
        );
        controller.close();
      },
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(body)),
    );
    const onFrame = vi.fn<(f: SseFrame) => void>();

    await streamGenerate({ model: "claude-haiku-4-5", user: "hi" }, onFrame);

    expect(onFrame.mock.calls[0]?.[0]).toEqual({ type: "delta", text: "가" });
    expect(onFrame.mock.calls[1]?.[0]).toEqual({ type: "delta", text: "나" });
  });
});
