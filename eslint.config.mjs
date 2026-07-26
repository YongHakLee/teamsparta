import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // demo/는 자체 eslint 설정을 가진 독립 앱이라 루트 린트에서 제외한다
    "demo/**",
  ]),
  {
    rules: {
      // 정적 export + unoptimized 환경이라 next/image 대신 <img>를 의도적으로 사용
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
