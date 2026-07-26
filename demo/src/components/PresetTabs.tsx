"use client";

import type { Preset } from "@/data/presets";

export default function PresetTabs({
  presets,
  activeId,
  onSelect,
}: {
  presets: Preset[];
  activeId: string | null;
  onSelect: (p: Preset) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelect(p)}
          className={
            p.id === activeId
              ? "border border-accent bg-accent px-3 py-1.5 text-[13px] font-semibold text-paper"
              : "border border-hairline px-3 py-1.5 text-[13px] text-muted hover:border-accent hover:text-ink"
          }
        >
          <span className="demo-mono mr-1.5 text-[11px] opacity-70">
            {p.slide}
          </span>
          {p.label}
        </button>
      ))}
    </div>
  );
}
