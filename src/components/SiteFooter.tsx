export default function SiteFooter() {
  return (
    <footer className="no-print w-full max-w-3xl mx-auto px-6 pb-10 pt-16">
      <div className="flex items-baseline justify-between border-t border-ink pt-4 text-[13px] text-muted">
        <span>© 2026 이용학</span>
        <a
          href="mailto:feint225@gmail.com"
          className="underline decoration-hairline underline-offset-4 hover:text-ink"
        >
          feint225@gmail.com
        </a>
      </div>
    </footer>
  );
}
