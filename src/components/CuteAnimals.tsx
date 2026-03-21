import type { CSSProperties } from "react";

type Props = {
  className?: string;
  style?: CSSProperties;
};

export function CatBlob({ className, style }: Props) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M52 96c0-38 31-69 68-69s68 31 68 69v48c0 38-31 69-68 69S52 182 52 144V96Z"
        fill="#93C5FD"
        opacity="0.35"
      />
      <path
        d="M75 86 55 57l9-6 23 23M165 86l20-29-9-6-23 23"
        stroke="#2563EB"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="98" cy="120" r="8" fill="#1D4ED8" />
      <circle cx="142" cy="120" r="8" fill="#1D4ED8" />
      <path
        d="M120 128c-6 0-11 5-11 11 0 6 5 11 11 11 6 0 11-5 11-11 0-6-5-11-11-11Z"
        fill="#1D4ED8"
        opacity="0.9"
      />
      <path
        d="M88 148c10 10 24 16 32 16s22-6 32-16"
        stroke="#1D4ED8"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M74 132c-18 4-30 10-38 18M166 132c18 4 30 10 38 18"
        stroke="#60A5FA"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

export function WhaleBlob({ className, style }: Props) {
  return (
    <svg
      viewBox="0 0 260 220"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M30 120c0-42 40-76 90-76h34c54 0 96 33 96 76 0 44-42 80-96 80h-34c-50 0-90-36-90-80Z"
        fill="#7DD3FC"
        opacity="0.35"
      />
      <path
        d="M85 122c0-18 18-32 40-32h22c24 0 44 14 44 32 0 19-20 34-44 34h-22c-22 0-40-15-40-34Z"
        fill="#2563EB"
        opacity="0.85"
      />
      <circle cx="150" cy="116" r="5" fill="#0B2A6F" />
      <path
        d="M202 118c18-6 30-18 30-32 0 22 0 58-10 72-12-18-30-28-52-32"
        stroke="#2563EB"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M120 80c-8-14-18-22-30-24 10 8 14 18 14 30"
        stroke="#38BDF8"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}
