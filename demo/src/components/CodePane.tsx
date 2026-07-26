import { getSnippet } from "@/lib/snippets";

/**
 * 실제 소스에서 추출한 코드를 보여준다.
 * 현재 슬라이더 값을 끼워 넣지 않는다 — 값은 `요청` 탭이, 설계는 이 탭이 맡는다.
 */
export default function CodePane({
  id,
  caption,
}: {
  id: string;
  caption: string;
}) {
  const snippet = getSnippet(id);
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] leading-relaxed text-muted">{caption}</p>
      <div
        className="demo-mono overflow-x-auto border border-hairline bg-paper p-3 text-[13px] leading-relaxed [&_pre]:!bg-transparent"
        dangerouslySetInnerHTML={{ __html: snippet.html }}
      />
      <p className="text-[12px] text-faint">
        이 코드는 <code className="demo-mono">{snippet.sourceFile}</code>에서
        빌드 시점에 추출한 실제 실행 코드입니다.
      </p>
    </div>
  );
}
