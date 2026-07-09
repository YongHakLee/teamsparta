# 이용학 — 이력서 · 포트폴리오

Team Sparta 지원용 이력서/포트폴리오 웹사이트.
https://yonghaklee.github.io/teamsparta/

- `/resume` — 이력서 (브라우저 인쇄로 A4 PDF 저장 가능)
- `/portfolio` — 강의 · 프로젝트 · 연구 포트폴리오

## 개발

```bash
npm run dev    # http://localhost:3000/teamsparta
npm run build  # 정적 export → out/
node scripts/check-output.mjs  # 빌드 산출물 검증
```

콘텐츠는 `src/data/*.ts`에서 수정한다. 원본 이미지를 바꾸면
`node scripts/prepare-assets.mjs`로 웹용 이미지를 다시 생성한다.

main에 push하면 GitHub Actions가 자동으로 GitHub Pages에 배포한다.
