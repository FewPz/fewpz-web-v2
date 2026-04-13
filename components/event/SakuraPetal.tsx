"use client";

export default function SakuraPetal({
  style,
  className,
}: {
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      style={style}
    >
      <path
        d="M16 2C16 2 10 8 10 16C10 20.5 12 24 16 28C20 24 22 20.5 22 16C22 8 16 2 16 2Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M16 6C16 6 8 10 6 16C4.5 20.5 6 24.5 10 27C12 23 12.5 19 14 16C16 12 16 6 16 6Z"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M16 6C16 6 24 10 26 16C27.5 20.5 26 24.5 22 27C20 23 19.5 19 18 16C16 12 16 6 16 6Z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}
