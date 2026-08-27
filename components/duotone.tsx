import type { ReactNode } from "react";

export const DUOTONE_CONTAINER =
  "bg-[#f6e9e1] [filter:saturate(1.15)] [isolation:isolate] dark:bg-[#220d03] dark:[filter:saturate(1.35)]";

export const DUOTONE_BASE =
  "[filter:grayscale(1)_contrast(0.85)_brightness(1.55)] dark:[filter:grayscale(1)_contrast(1.2)_brightness(1.08)]";

export function DuotoneOverlay(): ReactNode {
  return (
    <>
      <div className="absolute inset-0 bg-[#b8500c] mix-blend-color dark:bg-[#8f3d09]" />
      <div className="absolute inset-0 bg-[#e4a37e] opacity-30 mix-blend-multiply dark:bg-[#4a1d05] dark:opacity-40" />
      <div className="absolute inset-0 bg-white opacity-25 mix-blend-screen dark:bg-[#c96a34] dark:opacity-25" />
    </>
  );
}
