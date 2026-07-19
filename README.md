# 이용학 — 이력서 · 포트폴리오

Team Sparta 지원용 이력서/포트폴리오 웹사이트.
https://yonghaklee.github.io/teamsparta/

- https://yonghaklee.github.io/teamsparta/resume — 이력서
- https://yonghaklee.github.io/teamsparta/portfolio — 강의 · 프로젝트 · 연구 포트폴리오
- https://yonghaklee.github.io/teamsparta/portfolio/ax — AI Agent / Full-stack AX 포트폴리오 (가로 슬라이드)

### AI Agent / Full-stack AX 포트폴리오를 PDF로 저장하기

덱을 연 상태에서 `Ctrl/⌘ + P`를 누르고, 인쇄 대화상자에서:

- **대상** — PDF로 저장
- **여백** — 없음
- **배경 그래픽** — 켬
- **배율** — 기본 (100%). "페이지에 맞추기"를 쓰면 한 장이 두 장으로 나뉜다.

용지 크기는 CSS가 297×167mm(16:9)로 지정하므로 따로 고를 필요가 없다.
슬라이드 9장 + 안내장 1장 = **10페이지**로 나와야 정상이다.

### AX 시연 영상 재인코딩

`projects/3D_reverse_engineering/movie2.mp4`(원본 77MB)를 웹용으로 줄여 `public/videos/`에 넣는다:

```bash
node scripts/encode-video.mjs
```
