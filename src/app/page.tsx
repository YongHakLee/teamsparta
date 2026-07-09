import Link from "next/link";
import { profile } from "@/data/profile";

const selectedWork = [
  {
    no: "01",
    title: "도커로 딥러닝 따라하기 — 강의 8편",
    meta: "교육 콘텐츠",
    href: "/portfolio#lectures",
  },
  {
    no: "02",
    title: "모바일 LiDAR 3D 계측 프레임워크",
    meta: "2023 – 26",
    href: "/portfolio#projects",
  },
  {
    no: "03",
    title: "논문 9편 · 등록 특허 1건",
    meta: "연구 성과",
    href: "/portfolio#research",
  },
];

export default function Home() {
  return (
    <div className="pt-20 pb-10">
      <h1 className="text-4xl sm:text-[44px] font-extrabold leading-[1.24] tracking-[-0.03em]">
        복잡한 AI를
        <br />
        <span className="text-accent">따라 할 수 있게</span>
      </h1>
      <p className="mt-5 text-[15px] leading-relaxed text-muted">
        {profile.role} · 강의 12편 제작
      </p>

      <div className="mt-9 flex gap-7 text-[14px]">
        <Link
          href="/resume"
          className="font-bold border-b-2 border-accent pb-1 hover:text-accent"
        >
          이력서 보기 →
        </Link>
        <Link
          href="/portfolio"
          className="font-semibold text-muted border-b border-hairline pb-1 hover:text-ink"
        >
          포트폴리오 →
        </Link>
      </div>

      <section className="mt-24">
        <div className="text-[11px] font-bold tracking-[0.16em] text-faint">
          SELECTED WORK
        </div>
        <ul className="mt-2 border-t border-ink">
          {selectedWork.map((w) => (
            <li key={w.no} className="border-b border-hairline last:border-b-0">
              <Link
                href={w.href}
                className="flex items-baseline gap-5 py-4 group"
              >
                <span className="text-[12px] font-bold text-accent tabular-nums">
                  {w.no}
                </span>
                <span className="flex-1 text-[15px] font-bold group-hover:text-accent">
                  {w.title}
                </span>
                <span className="text-[12px] text-faint">{w.meta}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
