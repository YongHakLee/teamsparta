export default function SectionHeading({ no, title }: { no: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 border-t border-ink pt-3">
      <span className="text-[12px] font-bold text-accent tabular-nums tracking-[0.08em]">{no}</span>
      <h2 className="text-[17px] font-extrabold tracking-tight">{title}</h2>
    </div>
  );
}
