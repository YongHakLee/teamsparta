import Link from "next/link";

export default function DemoShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="w-full px-6 pt-6">
        <div className="flex items-baseline justify-between border-b border-ink pb-3">
          <Link href="/" className="text-[15px] font-extrabold tracking-tight">
            AI Engineering 시연
          </Link>
          <span className="demo-mono text-[12px] tracking-[0.14em] text-faint">
            {title}
          </span>
        </div>
      </header>
      <main className="flex-1 px-6 py-6">{children}</main>
      <footer className="w-full px-6 pb-6">
        <div className="border-t border-hairline pt-3 text-[12px] text-muted">
          강의 「AI 리터러시 · 프롬프트 엔지니어링 · RAG」 부속 시연 · 이용학
        </div>
      </footer>
    </div>
  );
}
