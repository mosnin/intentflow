import Image from "next/image";
import type { ReactNode } from "react";

export function NavVisual(): ReactNode {
  return (
    <div className="absolute inset-0 overflow-hidden bg-muted">
      <div
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--foreground) 20%, transparent) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />
      <div className="absolute inset-x-5 top-1/2 border-t border-dotted border-foreground/25" />
      <div className="absolute left-5 top-1/2 -translate-y-1/2 bg-muted pr-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
        Search
      </div>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 bg-muted pl-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
        Answer
      </div>
      <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-sm">
        <Image
          src="/brand/intentflow-mark-256.png"
          width={32}
          height={32}
          alt=""
          className="h-8 w-8 object-contain"
        />
      </div>
      <div className="absolute inset-x-0 bottom-3 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-[#b8500c]">
        IntentFlow intelligence layer
      </div>
    </div>
  );
}
