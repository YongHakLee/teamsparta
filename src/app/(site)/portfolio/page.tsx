import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { asset } from "@/lib/paths";
import { profile } from "@/data/profile";
import { certificates } from "@/data/career";
import { lectureSeries, videoUrl } from "@/data/lectures";
import { projects } from "@/data/projects";
import { publications, patents, rndProjects } from "@/data/research";

export const metadata: Metadata = {
  title: "포트폴리오",
  description: "강의, 프로젝트, 연구로 정리한 이용학의 포트폴리오",
};

/* authors 문자열에서 본인(Lee Y. / Lee Y.*)만 굵게 표시 */
function Authors({ text }: { text: string }) {
  const parts = text.split(/(Lee Y\.\*?)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("Lee Y.") ? (
          <strong key={i} className="font-bold text-ink">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export default function PortfolioPage() {
  return (
    <div className="pt-14 pb-6">
      {/* 인트로 */}
      <header>
        <h1 className="text-[28px] font-extrabold leading-[1.3] tracking-[-0.02em]">
          실무에서 풀어본 문제를,
          <br />
          <span className="text-accent">따라 할 수 있는 배움</span>으로 만듭니다
        </h1>
        <p className="mt-5 max-w-xl text-[14.5px] leading-[1.75] text-muted">
          미세먼지 측정부터 모바일 LiDAR 3D 계측까지 — 문제를 정의하고, 모델을 만들고, 결과를
          논문과 특허로 정리해왔습니다. 이 페이지는 제가 만든 강의와 프로젝트, 그리고 그 근거가
          된 연구들의 기록입니다.
        </p>
      </header>

      {/* 01 교육 콘텐츠 */}
      <section id="lectures" className="mt-16 scroll-mt-8">
        <SectionHeading no="01" title="교육 콘텐츠" />
        <div className="mt-6 space-y-12">
          {lectureSeries.map((s) => (
            <article key={s.id}>
              <div className="flex items-baseline justify-between">
                <h3 className="text-[18px] font-extrabold tracking-tight">{s.title}</h3>
                <a
                  href={s.playlistUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[12px] font-semibold text-accent"
                >
                  재생목록 ↗
                </a>
              </div>
              <p className="mt-1 text-[12.5px] text-faint">
                YouTube · {s.count}편 · {s.audience}
              </p>
              <p className="mt-3 max-w-xl text-[13.5px] leading-[1.75] text-muted">{s.design}</p>

              <ul className="mt-5 border-t border-ink">
                {s.lectures.map((l) => (
                  <li key={l.videoId} className="border-b border-hairline">
                    <a
                      href={videoUrl(l.videoId)}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-4 py-2.5"
                    >
                      <img
                        src={asset(l.thumb)}
                        alt=""
                        className="w-24 h-[54px] object-cover shrink-0"
                        loading="lazy"
                      />
                      <span className="text-[11px] font-bold text-accent tabular-nums">{l.no}</span>
                      <span className="flex-1 text-[14px] font-semibold leading-snug group-hover:text-accent">
                        {l.title}
                      </span>
                      <span className="shrink-0 text-[12px] text-faint">보기 ↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* 특별 섹션 배너 */}
      <Link
        href="/portfolio/ax"
        className="group mt-16 flex items-baseline justify-between gap-4 border border-ink px-5 py-4"
      >
        <span>
          <span className="block text-[11px] font-bold tracking-[0.14em] text-accent">
            AI AGENT / FULL-STACK AX
          </span>
          <span className="mt-1 block text-[16px] font-extrabold tracking-tight">
            AI Agent / Full-stack AX 포트폴리오
          </span>
          <span className="mt-1 block text-[12.5px] text-muted">
            데이터바우처 · 3D 역설계 · AI 쇼핑 어시스턴트 — 데이터 생성부터 배포까지
          </span>
        </span>
        <span className="shrink-0 text-[12.5px] font-semibold text-muted group-hover:text-ink">
          가로 화면으로 보기 →
        </span>
      </Link>

      {/* 02 프로젝트 */}
      <section id="projects" className="mt-20 scroll-mt-8">
        <SectionHeading no="02" title="프로젝트" />
        <div className="mt-6 space-y-16">
          {projects.map((p) => (
            <article key={p.no}>
              <div className="flex items-baseline gap-4">
                <span className="text-[13px] font-bold text-accent tabular-nums">{p.no}</span>
                <div className="flex-1">
                  <h3 className="text-[17px] font-extrabold leading-[1.4] tracking-tight">{p.title}</h3>
                  <p className="mt-1 text-[12.5px] text-faint tabular-nums">{p.period}</p>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-[13px] text-muted">
                <p>
                  <span className="text-faint">역할 </span>
                  {p.role}
                </p>
                <p>
                  <span className="text-faint">기술 </span>
                  {p.tech.join(" · ")}
                </p>
              </div>

              <div className="mt-5 grid gap-8 sm:grid-cols-2">
                <div>
                  <h4 className="text-[12px] font-bold tracking-[0.12em] text-faint">문제 상황</h4>
                  <ul className="mt-2 space-y-2 text-[13.5px] leading-[1.65]">
                    {p.problems.map((pt) => (
                      <li key={pt.lead}>
                        <span className="font-bold">{pt.lead}</span>
                        <span className="text-muted"> — {pt.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[12px] font-bold tracking-[0.12em] text-faint">해결과 성과</h4>
                  <ul className="mt-2 space-y-2 text-[13.5px] leading-[1.65]">
                    {p.solutions.map((pt) => (
                      <li key={pt.lead}>
                        <span className="font-bold">{pt.lead}</span>
                        <span className="text-muted"> — {pt.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {p.images.map((img) => (
                  <img
                    key={img.src}
                    src={asset(img.src)}
                    alt={img.alt}
                    className="w-full border border-hairline bg-white"
                    loading="lazy"
                  />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 03 연구 성과 */}
      <section id="research" className="mt-20 scroll-mt-8">
        <SectionHeading no="03" title="연구 성과" />

        <h3 className="mt-6 text-[12px] font-bold tracking-[0.12em] text-faint">논문 {publications.length}편</h3>
        <ul className="mt-2 border-t border-ink">
          {publications.map((pub) => (
            <li key={pub.title} data-pub className="border-b border-hairline py-4">
              <div className="flex items-baseline gap-3">
                <span className="text-[12px] text-faint tabular-nums shrink-0">{pub.year}</span>
                <div className="flex-1">
                  <p className="text-[14px] font-bold leading-snug">{pub.title}</p>
                  <p className="mt-1 text-[12.5px] text-accent">
                    {pub.venue}
                    {pub.role ? ` · ${pub.role}` : ""}
                  </p>
                  <p className="mt-1 text-[12.5px] text-faint">
                    <Authors text={pub.authors} />
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{pub.summary}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="mt-10 text-[12px] font-bold tracking-[0.12em] text-faint">특허</h3>
        <div className="mt-2 border-t border-ink pt-4">
          {patents.map((pt) => (
            <div key={pt.title}>
              <p className="text-[14px] font-bold leading-snug">{pt.title}</p>
              <p className="mt-1 text-[12px] italic text-faint">{pt.titleEn}</p>
              <p className="mt-1.5 text-[13px] text-muted">
                {pt.applied} · {pt.registered}
              </p>
              <p className="mt-1 text-[12.5px] text-faint">발명자 {pt.inventors}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-10 text-[12px] font-bold tracking-[0.12em] text-faint">국가 R&D</h3>
        <ul className="mt-2 border-t border-ink">
          {rndProjects.map((r) => (
            <li key={r.title} className="flex items-baseline gap-3 border-b border-hairline py-3 text-[13.5px]">
              <span className="text-[12px] text-faint tabular-nums shrink-0">{r.period}</span>
              <span className="flex-1 font-semibold leading-snug">{r.title}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 04 자격증 · 수상 + 마무리 */}
      <section className="mt-20">
        <SectionHeading no="04" title="자격증 · 수상" />
        <ul className="mt-4 space-y-2">
          {certificates.map((c) => (
            <li key={c.name} className="flex items-baseline gap-3 text-[13.5px]">
              <span className="flex-1">{c.name}</span>
              <span className="text-[12px] text-muted">{c.org}</span>
              <span className="text-[12px] text-faint tabular-nums">{c.date}</span>
            </li>
          ))}
        </ul>

        <div className="mt-16 border-t border-ink pt-6 text-center">
          <p className="text-[15px] font-bold">함께 일할 이야기가 있다면</p>
          <p className="mt-2 text-[13.5px]">
            <a href={`mailto:${profile.email}`} className="text-accent font-semibold">
              {profile.email}
            </a>
            <span className="mx-3 text-hairline">|</span>
            <Link href="/resume" className="text-muted hover:text-ink">
              이력서 보기 →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
