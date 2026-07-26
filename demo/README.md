# AI Engineering 강의 시연

강의 「AI 리터러시 · 프롬프트 엔지니어링 · RAG」의 부속 시연 앱입니다.
레포 루트의 정적 사이트와 분리된 독립 Next 앱이며, Vercel에 배포합니다.
정적 export에 담을 수 없는 서버 라우트(`/api/generate`)가 있어 GitHub Pages에는 올라가지 않습니다.

**무대에서 무엇을 누르고 무엇이 보이는지**는 [시연 앱 사용법](../docs/lecture/ai-engineering-시연사용법.md)에
따로 정리했습니다. 이 문서는 설치·배포·리허설 절차를 다룹니다.

## 실행

```bash
npm install
cp .env.example .env.local   # ANTHROPIC_API_KEY 채우기
npm run build:snippets       # 코드 탭 스니펫 생성 (gitignore된 생성물이라 먼저 돌려야 한다)
npm run dev                  # http://localhost:3100
```

`src/data/snippets.generated.json`은 gitignore 대상이라 저장소에 없습니다.
`npm run typecheck`·`npm run dev`보다 **먼저** `npm run build:snippets`를 돌려야
타입 검사와 `/promptops`의 `코드` 탭이 정상 동작합니다. `npm run build`는
`prebuild` 스크립트로 `build:snippets`를 자동으로 먼저 실행합니다.

## 배포

Vercel 프로젝트의 **Root Directory를 `demo`로** 설정합니다.
환경변수는 `ANTHROPIC_API_KEY` 하나만 등록하면 됩니다.

## 검증

이 레포는 NFS 마운트라 `next build`가 실패합니다. 로컬 검증은 다음으로 합니다.

```bash
npm run build:snippets && npm run typecheck && npm run lint && npm run test
```

프로덕션 빌드 검증은 Vercel 배포가 대신합니다.

## 발표 전 리허설 체크리스트

- [ ] `.env.local`에 유효한 `ANTHROPIC_API_KEY`가 있다
- [ ] `npm run build:snippets`가 성공하고 스니펫 5개가 추출된다
      (`sampling` · `prompt-patterns` · `structured-output` · `structured-validate` · `structured-retry`)
- [ ] `/promptops`에서 temperature 슬라이더를 움직이면 `요청` 탭 JSON이 바뀐다
- [ ] **무작위성** 전체 실행 — temperature 0 열은 결과가 거의 같고, 1.0 열은 갈린다
- [ ] **지시 방법** 전체 실행 — CoT 열의 출력 토큰 수가 가장 크다
- [ ] **안티패턴** 전체 실행 — ③ 한 번에 여러 작업 짝을 확인한다. 나쁜 예는
      요청하지 않은 것(이모지 머리글·별점 표 등)을 덧붙이고 형식이 흔들리며
      출력 토큰이 2배 이상(관측치: 255 vs 107) 나온다. 고친 예는 1)2)3) 라벨을
      정확히 지킨다
- [ ] **구조화 출력** 전체 실행 — 세 변형이다. `JSON 스키마 강제`는 1회차
      검증 통과가 뜬다(Structured Outputs가 디코딩 단계에서 스키마를 강제하므로
      애초에 어긋날 수 없다). `JSON 요청 — 형식 강제 없이`는 검증 실패 →
      `— 재요청 N회차 —` → 최대 2회 재요청 후 정지가 뜬다. 단, 모델 출력이
      비결정적이라 `JSON 요청 — 형식 강제 없이`도 1회차에 통과할 수 있다 —
      그러면 그것도 정상이다
- [ ] 모델을 `claude-opus-5`로 바꾸고 temperature 강제 전송 → **`HTTP 400 · BadRequestError`가 뜬다**
- [ ] 강제 전송을 끄고 다시 실행 → **정상 응답이 나온다** (막다른 길이 아님을 확인).
      **무작위성** 프리셋(변형의 `max_tokens`가 64)에서는 하지 마라 — opus-5는 thinking이
      기본으로 돌고 max_tokens가 사고+응답 합계에 걸리는 상한이라 빈 출력으로 끝날 수
      있다. 모델 전환은 opus-5로 바꾸면 `max_tokens`가 자동으로 올라가는 지점(왼쪽
      조작부의 MAX_TOKENS 슬라이더, 또는 `요청` 탭 JSON)에서 확인하고, 프리셋은 **지시
      방법**처럼 max_tokens가 애초에 256 이상인 프리셋에서 하는 편이 안전하다
- [ ] 프리셋을 바꾸면 `코드` 탭의 스니펫과 출처 경로가 바뀐다 — 단, **안티패턴**은
      **무작위성**과 같은 `sampling` 스니펫을 쓴다(프리셋 4개에 서로 다른 스니펫은 3개)
- [ ] `src/data/fixtures.json`에 12개 항목이 들어 있다 (무작위성 2 · 지시 방법 3 ·
      안티패턴 4 · 구조화 출력 3)
- [ ] `.env.local`의 키를 망가뜨린 상태에서 변형 버튼을 눌러 선택한 뒤 `실행`으로
      확인하면 `저장된 응답` 배지가 뜬다. 폴백은 왼쪽 조작부의 단일 `실행`
      경로에만 걸려 있고, `프리셋 전체 실행`(변형 그리드)에는 걸려 있지 않다
- [ ] **`.env.local`의 API 키를 원래 값으로 되돌렸다** (`.env.local.bak` 백업 파일이
      남지 않았는지 확인)

### fixture 기록 절차 (참고)

`http://localhost:3100/promptops?record=1`로 열고 프리셋 4개를 각각
`프리셋 전체 실행`하면 브라우저 콘솔에 `[fixtures]` 배열이 찍힙니다. 개발
모드에서는 React가 상태 갱신 함수를 두 번 호출할 수 있어 **같은 로그가 두 번
찍힐 수 있습니다 — 정상이니 한 블록만 복사**해 `src/data/fixtures.json`에
합칩니다.

### 배포 후 확인

에러 프레임의 이름은 `instanceof Anthropic.BadRequestError` 같은 체인으로
잡습니다(`route.ts`의 `toErrorFrame`). Vercel 프로덕션 번들 최소화로 클래스
이름 문자열이 뭉개져도 `instanceof` 판정 자체는 영향받지 않으므로 별도 확인
절차는 필요 없습니다.

## 강의 종료 후

Vercel 대시보드에서 배포를 삭제하거나 `ANTHROPIC_API_KEY`를 비웁니다.
