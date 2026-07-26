# 이용학 — 이력서 · 포트폴리오

AI 엔지니어 · 응용통계학 박사과정. Team Sparta 지원용 이력서/포트폴리오 웹사이트입니다.

**https://yonghaklee.github.io/teamsparta/**

## 바로 가기

| 링크 | 내용 |
|---|---|
| [이력서](https://yonghaklee.github.io/teamsparta/resume) | 경력 · 학력 · 연구 |
| [포트폴리오](https://yonghaklee.github.io/teamsparta/portfolio) | 강의 · 프로젝트 · 연구 |
| [AX 포트폴리오](https://yonghaklee.github.io/teamsparta/portfolio/ax) | AI Agent / Full-stack (가로 슬라이드) |
| [AI 엔지니어링 강의 PPT](https://yonghaklee.github.io/teamsparta/lecture/ai-engineering) | 「AI 리터러시 · 프롬프트 엔지니어링 · RAG」 발표 덱 (←/→로 이동) |

## 강의 자료

강의 덱을 뒷받침하는 문서입니다.

- [개념정리 Part 1 — 리터러시 & 프롬프트](docs/lecture/part1-리터러시와-프롬프트.md)
- [개념정리 Part 2 — RAG](docs/lecture/part2-rag.md)
- [발표 스크립트](docs/lecture/ai-engineering-스크립트.md)
- [시연 앱 사용법](docs/lecture/ai-engineering-시연사용법.md)

## 시연 앱 (`demo/`)

강의 Part 1(s03~s07)의 파라미터·프롬프트 개념을 Anthropic API **실호출**로 보여주는
PromptOps 콘솔입니다. 조작한 값이 실제 요청 JSON의 어느 필드가 되는지, 그 값이 지나가는
소스 코드가 무엇인지, 응답이 어떻게 달라지는지를 한 화면에서 보여줍니다.

**https://ai-engineering-demo.vercel.app/promptops**

이 앱은 **위 GitHub Pages 사이트에 포함되지 않습니다.** 서버 라우트(`/api/generate`)가
있어 정적 export에 담을 수 없어서, 레포 루트와 분리된 독립 Next 앱으로 두고 Vercel에
따로 배포합니다(환경변수는 `ANTHROPIC_API_KEY` 하나).

```bash
cd demo
npm install
cp .env.example .env.local   # ANTHROPIC_API_KEY 채우기
npm run build:snippets       # 코드 탭 스니펫 생성 (저장소에 없는 생성물)
npm run dev                  # http://localhost:3100/promptops
```

- 무대에서 무엇을 누르고 무엇이 보이는지: [시연 앱 사용법](docs/lecture/ai-engineering-시연사용법.md)
- 설치·배포·리허설 체크리스트: [demo/README.md](demo/README.md)

## 기술 스택

**루트 사이트** Next.js 16 (App Router · 정적 export) · React 19 · TypeScript · Tailwind CSS 4 · GitHub Pages
**시연 앱(`demo/`)** Next.js 16 (서버 라우트 · SSE 스트리밍) · `@anthropic-ai/sdk` · shiki · Vitest · Vercel
