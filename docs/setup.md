# GitHub Pages + Next.js 사전 설정 가이드

이력서(`/resume`)와 포트폴리오(`/portfolio`) 페이지를 담을 Next.js 사이트를
GitHub Pages에 배포하기 위한 **사전 준비 설정** 문서입니다.
페이지 자체를 만드는 내용은 다루지 않습니다.

## 결정된 구성

| 항목        | 선택                                               |
| ----------- | -------------------------------------------------- |
| 저장소 구조 | 이 저장소(`teamsparta`) 하나에 Next.js 사이트 하나 |
| 페이지 구성 | `/resume`, `/portfolio` 두 페이지                  |
| 최종 주소   | `https://yonghaklee.github.io/teamsparta/`         |
| 배포 방식   | GitHub Actions 자동 배포 (main에 push하면 배포)    |
| 기술 스택   | Next.js (App Router) + TypeScript + Tailwind CSS   |

> GitHub Pages는 무료 계정에서 **Public 저장소**만 지원합니다.
> 이 저장소는 현재 Public이므로 문제없습니다.

---

## 1. 환경 준비: WSL에 Node.js 설치

### 왜 필요한가

현재 WSL에서 `npm`을 실행하면 Windows에 설치된 Node.js(`/mnt/c/Program Files/nodejs`)가
실행됩니다. Windows용 Node로 WSL 파일시스템의 프로젝트를 다루면 **매우 느리고
오류가 자주 발생**하므로, WSL 안에 리눅스용 Node.js를 따로 설치해야 합니다.

Node 버전 관리자인 **nvm**으로 설치합니다. (버전 교체가 쉬워서 권장되는 방식)

### 따라하기

```bash
# 1) nvm 설치 (최신 버전 번호는 https://github.com/nvm-sh/nvm/releases 에서 확인)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# 2) 셸 설정 다시 읽기 (또는 터미널을 껐다 켜기)
source ~/.zshrc

# 3) Node.js LTS(장기 지원 버전) 설치
nvm install --lts
```

### 확인

```bash
which node   # → /home/dragon/.nvm/... 경로가 나와야 함 (/mnt/c/... 이면 잘못된 것)
node -v      # → v22.x 이상
npm -v
```

---

## 2. Next.js 프로젝트 생성

### 왜 이렇게 하는가

`create-next-app`은 대상 폴더에 자신이 모르는 파일이 있으면 실행을 거부합니다.
현재 저장소에 있는 `README.md`, `prompt.md`가 걸릴 수 있으므로 **잠시 밖으로
옮겨둔 뒤** 생성하고, 끝나면 되돌립니다.

### 따라하기

```bash
cd ~/github/teamsparta

# 1) 기존 파일 임시 대피
mkdir -p /tmp/teamsparta-backup
mv README.md prompt.md /tmp/teamsparta-backup/

# 2) 현재 폴더(.)에 Next.js 프로젝트 생성
npx create-next-app@latest . \
  --ts \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --turbopack \
  --import-alias "@/*"

# 3) 대피시킨 파일 복원
mv /tmp/teamsparta-backup/prompt.md .
#   README.md는 create-next-app이 새로 만들었으므로,
#   기존 내용(제목 한 줄)을 새 README.md 위쪽에 직접 붙여넣으면 됩니다.
cat /tmp/teamsparta-backup/README.md   # 기존 내용 확인용
```

각 옵션의 의미:

| 옵션                   | 의미                                                |
| ---------------------- | --------------------------------------------------- |
| `--ts`                 | TypeScript 사용                                     |
| `--tailwind`           | Tailwind CSS 포함                                   |
| `--eslint`             | 코드 검사 도구 ESLint 포함                          |
| `--app`                | App Router 사용 (현재 표준 라우팅 방식)             |
| `--src-dir`            | 소스 코드를 `src/` 폴더 아래로 정리                 |
| `--turbopack`          | 개발 서버에 Turbopack(빠른 번들러) 사용             |
| `--import-alias "@/*"` | `import x from "@/components/..."` 형태의 경로 별칭 |

> 버전에 따라 옵션 이름이 바뀌어 "unknown option" 오류가 날 수 있습니다.
> 그럴 땐 옵션 없이 `npx create-next-app@latest .` 만 실행하고,
> 화면에 나오는 질문에 위 표와 같은 의미로 답하면 됩니다.

### 확인

```bash
# .gitignore에 prompt.md 무시 규칙이 남아 있는지 확인, 없으면 추가
grep prompt.md .gitignore || echo "prompt.md" >> .gitignore

# 개발 서버 실행 → 브라우저에서 http://localhost:3000 접속, 기본 화면이 보이면 성공
npm run dev
```

확인 후 `Ctrl+C`로 서버를 종료합니다.

---

## 3. GitHub Pages용 Next.js 설정

### 왜 필요한가

GitHub Pages는 **정적 파일(HTML/CSS/JS)만** 서비스할 수 있고, 서버를 실행해주지
않습니다. 또한 사이트가 도메인 루트가 아니라 `/teamsparta`라는 **하위 경로**에
배포됩니다. 이 두 가지에 맞춰 Next.js 설정을 바꿔야 합니다.

### 따라하기

`next.config.ts` 파일을 열어 아래 내용으로 수정합니다.

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 서버 없이 동작하는 정적 사이트로 빌드 (결과물이 out/ 폴더에 생성됨)
  output: "export",

  // 사이트가 https://yonghaklee.github.io/teamsparta/ 에 배포되므로
  // 모든 경로 앞에 /teamsparta 를 붙임
  basePath: "/teamsparta",

  // next/image의 이미지 최적화는 서버가 필요하므로 끔
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

> **주의**: `basePath`를 설정하면 로컬 개발 서버에서도 주소가
> `http://localhost:3000/teamsparta` 로 바뀝니다.

### 확인

```bash
npm run build
ls out/   # index.html 등 정적 파일이 보이면 성공
```

---

## 4. GitHub Actions 배포 워크플로 작성

### 왜 필요한가

main 브랜치에 push할 때마다 GitHub가 알아서 빌드하고 Pages에 배포하도록
자동화 스크립트(워크플로)를 저장소에 넣어둡니다. 한 번 만들면 이후로는
push만 하면 됩니다.

### 따라하기

`.github/workflows/deploy.yml` 파일을 아래 내용으로 만듭니다.

```yaml
name: Deploy Next.js site to GitHub Pages

on:
  # main 브랜치에 push될 때마다 실행
  push:
    branches: [main]
  # GitHub 웹의 Actions 탭에서 수동 실행도 가능하게
  workflow_dispatch:

# 배포에 필요한 권한
permissions:
  contents: read
  pages: write
  id-token: write

# 배포가 겹치면 이전 것을 기다리도록
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 1단계: 빌드
  build:
    runs-on: ubuntu-latest
    steps:
      - name: 소스 코드 가져오기
        uses: actions/checkout@v4

      - name: Node.js 설치
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: 의존성 설치
        run: npm ci

      - name: 빌드 (out/ 폴더 생성)
        run: npm run build

      - name: 빌드 결과물 업로드
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  # 2단계: 배포
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: GitHub Pages에 배포
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 5. GitHub 저장소 설정 변경

### 왜 필요한가

GitHub Pages의 배포 소스가 기본값(브랜치)으로 되어 있으면 위 워크플로가
동작하지 않습니다. "GitHub Actions가 배포한다"고 저장소에 알려줘야 합니다.

### 따라하기 (웹 브라우저에서)

1. https://github.com/YongHakLee/teamsparta 접속
2. **Settings** 탭 → 왼쪽 메뉴에서 **Pages** 클릭
3. **Build and deployment** 섹션의 **Source**를 **GitHub Actions**로 변경

별도의 저장 버튼은 없고, 선택하는 즉시 적용됩니다.

---

## 6. 첫 배포 및 동작 확인

### 따라하기

```bash
git add .
git commit -m "Set up Next.js project with GitHub Pages deployment"
git push origin main
```

### 확인

1. https://github.com/YongHakLee/teamsparta/actions 에서 워크플로가 실행되는 것 확인
   (초록색 체크가 뜰 때까지 1~3분 소요)
2. https://yonghaklee.github.io/teamsparta/ 접속 → Next.js 기본 화면이 보이면 **설정 완료**

### 문제가 생기면

- **Actions 탭에서 빨간 X**: 실패한 단계를 클릭하면 로그가 보입니다.
  대부분 `npm run build` 단계의 오류이므로, 로컬에서 `npm run build`를 먼저
  성공시킨 뒤 다시 push하세요.
- **404 페이지가 뜸**: 5번 단계(Source: GitHub Actions)가 설정되었는지,
  `basePath`가 `/teamsparta`로 정확한지(대소문자 포함) 확인하세요.

---

## 다음 단계 (참고)

설정이 끝난 뒤 실제 페이지는 아래 위치에 만들게 됩니다. (이 문서의 범위 밖)

- 이력서: `src/app/resume/page.tsx` → `https://yonghaklee.github.io/teamsparta/resume`
- 포트폴리오: `src/app/portfolio/page.tsx` → `https://yonghaklee.github.io/teamsparta/portfolio`
- 첫 화면(두 페이지로 안내하는 랜딩): `src/app/page.tsx`
