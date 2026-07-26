import generated from "@/data/snippets.generated.json";

export type Snippet = { lang: string; source: string; html: string };

const snippets = generated as Record<string, Snippet>;

/** 없는 id를 요구하면 즉시 실패한다 — 화면에 빈 코드 블록이 뜨는 것보다 낫다. */
export function getSnippet(id: string): Snippet {
  const s = snippets[id];
  if (!s) {
    throw new Error(
      `스니펫 '${id}'가 없습니다. npm run build:snippets 를 실행했는지 확인하세요.`,
    );
  }
  return s;
}
