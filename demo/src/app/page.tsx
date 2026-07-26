import Link from "next/link";
import DemoShell from "@/components/DemoShell";

const demos = [
  {
    href: "/promptops",
    part: "PART 1",
    title: "PromptOps 콘솔",
    desc: "파라미터와 프롬프트를 바꾸면 요청 JSON과 응답이 어떻게 달라지는지 확인합니다.",
  },
  {
    href: "/agent",
    part: "PART 2",
    title: "AX 지식 에이전트",
    desc: "사내 문서를 검색해 근거와 함께 답합니다. (준비 중)",
    disabled: true,
  },
];

export default function Home() {
  return (
    <DemoShell title="INDEX">
      <div className="mx-auto grid max-w-4xl gap-4 pt-8 sm:grid-cols-2">
        {demos.map((d) =>
          d.disabled ? (
            <div
              key={d.href}
              className="border border-hairline p-5 opacity-50"
              aria-disabled
            >
              <div className="demo-mono text-[12px] tracking-[0.14em] text-faint">
                {d.part}
              </div>
              <h2 className="mt-2 text-lg font-bold">{d.title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                {d.desc}
              </p>
            </div>
          ) : (
            <Link
              key={d.href}
              href={d.href}
              className="border border-hairline p-5 transition-colors hover:border-accent"
            >
              <div className="demo-mono text-[12px] tracking-[0.14em] text-faint">
                {d.part}
              </div>
              <h2 className="mt-2 text-lg font-bold text-accent">{d.title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                {d.desc}
              </p>
            </Link>
          ),
        )}
      </div>
    </DemoShell>
  );
}
