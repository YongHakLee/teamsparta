import type { ReactNode } from "react";

type Props = {
  no: number;
  total: number;
  eyebrow: ReactNode;
  id?: string;
  className?: string;
  children: ReactNode;
};

export default function SlideFrame({ no, total, eyebrow, id, className, children }: Props) {
  return (
    <section data-slide={`${no}`} id={id} className="ax-viewport">
      <div className={`ax-slide ${className ?? ""}`}>
        <div className="ax-ebrow ax-mono">
          <span>{eyebrow}</span>
          <span>
            {String(no).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
        {children}
      </div>
    </section>
  );
}
