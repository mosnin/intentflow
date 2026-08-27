import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function Logo(): ReactNode {
  return (
    <Link
      href="/"
      className="focus-ring group inline-flex items-center gap-2.5"
      aria-label="IntentFlow home"
    >
      <Image
        src="/brand/intentflow-mark-256.png"
        width={30}
        height={30}
        alt=""
        className="h-[30px] w-[30px] object-contain transition-transform duration-300 group-hover:rotate-3"
        priority
      />
      <span className="text-[17px] font-semibold tracking-[-0.035em]">
        IntentFlow
      </span>
    </Link>
  );
}
