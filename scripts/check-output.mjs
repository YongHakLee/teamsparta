// out/ 산출물이 스펙의 불변 조건을 지키는지 검사한다.
// 사용법: npm run build 후 `node scripts/check-output.mjs`
import { readFile, readdir, stat } from "node:fs/promises";

async function readPage(name) {
  for (const p of [`out/${name}.html`, `out/${name}/index.html`]) {
    try {
      return await readFile(p, "utf8");
    } catch {
      /* 다음 후보 */
    }
  }
  throw new Error(`페이지 없음: ${name}`);
}

const index = await readPage("index");
const resume = await readPage("resume");
const portfolio = await readPage("portfolio");
const axDeck = await readPage("portfolio/ax");
const all = index + resume + portfolio;

const lectureThumbs = await readdir("out/images/lectures");
const videoStat = await stat("out/videos/ax-3d-demo.mp4").catch(() => null);

// HTML에는 DOM과 RSC 페이로드가 함께 들어가 단순 문자열 검색이 2배로 잡히므로,
// 링크·속성은 DOM에만 나타나는 형태(href="…", data-pub="true")로 센다.
const checks = [
  ["전화번호 미노출", !all.includes("8295")],
  ["이력서에 이메일 노출", resume.includes("feint225@gmail.com")],
  ["유튜브 강의 링크 12건", (portfolio.match(/href="https:\/\/www\.youtube\.com\/watch\?v=/g) || []).length === 12],
  ["논문 9편", (portfolio.match(/data-pub="true"/g) || []).length === 9],
  ["project05 미사용", !all.includes("project05")],
  ["프로필 사진 basePath 경로", resume.includes("/teamsparta/images/yonghaklee.jpg")],
  ["강의 썸네일 12장", lectureThumbs.length === 12],
  ["랜딩 헤드라인", index.includes("따라 할 수 있게")],
  ["포트폴리오 앵커", portfolio.includes('id="lectures"') && portfolio.includes('id="projects"') && portfolio.includes('id="research"')],
  ["AX 덱: 슬라이드 7장", (axDeck.match(/data-slide="/g) || []).length === 7], // 프로젝트 수×2+3 (src/data/ax.ts 변경 시 갱신)
  ["AX 덱: 표지 카피", axDeck.includes("AI Agent / Full-stack AX")],
  ["AX 덱: 데모 접속 정보 노출", axDeck.includes("admin1234")], // 의도된 공개 (스펙 §2)
  ["AX 덱: 시연 영상 참조", axDeck.includes("/teamsparta/videos/ax-3d-demo.mp4")],
  ["AX 덱: 영상 파일 20MB 이하", videoStat !== null && videoStat.size < 20 * 1024 * 1024],
  ["AX 덱: PDF 안내장", axDeck.includes("웹에서 보시길 권장")],
  ["AX 덱: QR 포함", axDeck.includes('class="ax-qr')],
  ["포트폴리오→AX 덱 배너", portfolio.includes('href="/teamsparta/portfolio/ax"')],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failed += 1;
}

if (failed > 0) {
  console.error(`\n${failed}개 검사 실패`);
  process.exit(1);
}
console.log("\nALL CHECKS PASSED");
