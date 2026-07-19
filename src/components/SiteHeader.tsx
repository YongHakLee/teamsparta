import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="no-print w-full max-w-3xl mx-auto px-6 pt-8">
      <div className="flex items-baseline justify-between border-b border-ink pb-4">
        <Link href="/" className="text-[15px] font-extrabold tracking-tight">
          이용학
        </Link>
        <nav className="flex gap-4 text-[13px] text-muted sm:gap-6">
          <Link href="/resume" className="whitespace-nowrap hover:text-ink">
            이력서
          </Link>
          <Link href="/portfolio" className="whitespace-nowrap hover:text-ink">
            포트폴리오
          </Link>
          {/* 강조색 — 사이트를 벗어나 가로 슬라이드로 넘어가는 링크라 나머지와 구분한다 */}
          <Link
            href="/portfolio/ax"
            className="whitespace-nowrap font-semibold text-accent hover:underline"
          >
            AX 포트폴리오 →
          </Link>
        </nav>
      </div>
    </header>
  );
}
