import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="no-print w-full max-w-3xl mx-auto px-6 pt-8">
      <div className="flex items-baseline justify-between border-b border-ink pb-4">
        <Link href="/" className="text-[15px] font-extrabold tracking-tight">
          이용학
        </Link>
        <nav className="flex gap-6 text-[13px] text-muted">
          <Link href="/resume" className="hover:text-ink">
            이력서
          </Link>
          <Link href="/portfolio" className="hover:text-ink">
            포트폴리오
          </Link>
        </nav>
      </div>
    </header>
  );
}
