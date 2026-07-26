// 소스에서 #region snippet:<id> ... #endregion 구간을 뽑아 shiki로 하이라이트한다.
// 손으로 쓴 스니펫은 반드시 실제 코드와 어긋나므로, 표시용 코드는 항상 여기서 만든다.
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { createHighlighter } from "shiki";

const SRC = path.join(process.cwd(), "src");
const OUT = path.join(SRC, "data", "snippets.generated.json");

// 반드시 존재해야 하는 스니펫. 하나라도 없으면 빌드를 실패시켜 조용한 유실을 막는다.
const REQUIRED = ["sampling"];

const START = /^\s*\/\/\s*#region\s+snippet:([\w-]+)\s*$/;
const END = /^\s*\/\/\s*#endregion\s*$/;

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(ts|tsx)$/.test(e.name) && !e.name.endsWith(".test.ts")) {
      out.push(p);
    }
  }
  return out;
}

function extract(text) {
  const found = [];
  const lines = text.split("\n");
  let id = null;
  let buf = [];
  for (const line of lines) {
    const m = line.match(START);
    if (m) {
      id = m[1];
      buf = [];
      continue;
    }
    if (id && END.test(line)) {
      found.push({ id, source: buf.join("\n").trimEnd() });
      id = null;
      continue;
    }
    if (id) buf.push(line);
  }
  return found;
}

const files = await walk(SRC);
const snippets = {};

for (const file of files) {
  const text = await readFile(file, "utf8");
  for (const { id, source } of extract(text)) {
    if (snippets[id]) {
      throw new Error(`스니펫 id 중복: ${id} (${file})`);
    }
    snippets[id] = { lang: "ts", source };
  }
}

const missing = REQUIRED.filter((id) => !snippets[id]);
if (missing.length > 0) {
  throw new Error(
    `필수 스니펫 마커가 없습니다: ${missing.join(", ")}\n` +
      `소스에서 // #region snippet:<id> 주석이 지워졌는지 확인하세요.`,
  );
}

const highlighter = await createHighlighter({
  themes: ["github-light"],
  langs: ["ts"],
});

for (const [id, s] of Object.entries(snippets)) {
  snippets[id].html = highlighter.codeToHtml(s.source, {
    lang: s.lang,
    theme: "github-light",
  });
}

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(snippets, null, 2) + "\n", "utf8");
console.log(
  `스니펫 ${Object.keys(snippets).length}개 추출: ${Object.keys(snippets).join(", ")}`,
);
