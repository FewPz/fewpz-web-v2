"use client";

export default function SakuraBranch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" className={className}>
      {/* Main branch */}
      <path
        d="M0 80 Q80 70 160 100 Q240 130 320 90 Q360 75 400 85"
        stroke="#8B6F5E"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Secondary branches */}
      <path
        d="M100 88 Q120 50 140 40"
        stroke="#8B6F5E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M200 110 Q220 70 250 55"
        stroke="#8B6F5E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M280 95 Q310 60 330 50"
        stroke="#8B6F5E"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Blossoms on branches */}
      {[
        { cx: 140, cy: 38, r: 14 },
        { cx: 130, cy: 48, r: 10 },
        { cx: 155, cy: 45, r: 11 },
        { cx: 250, cy: 53, r: 13 },
        { cx: 240, cy: 62, r: 10 },
        { cx: 260, cy: 60, r: 9 },
        { cx: 330, cy: 48, r: 12 },
        { cx: 320, cy: 55, r: 9 },
        { cx: 340, cy: 56, r: 10 },
        { cx: 90, cy: 82, r: 8 },
        { cx: 180, cy: 105, r: 9 },
        { cx: 350, cy: 84, r: 7 },
      ].map((b, i) => (
        <circle
          key={i}
          cx={b.cx}
          cy={b.cy}
          r={b.r}
          fill={i % 3 === 0 ? "#f9a8c9" : i % 3 === 1 ? "#fcc2d7" : "#fdd5dc"}
          opacity={0.8}
        />
      ))}
      {/* Small dots for buds */}
      {[
        { cx: 110, cy: 75, r: 4 },
        { cx: 170, cy: 100, r: 4 },
        { cx: 230, cy: 115, r: 3 },
        { cx: 300, cy: 88, r: 4 },
        { cx: 370, cy: 82, r: 3 },
      ].map((d, i) => (
        <circle
          key={`bud-${i}`}
          cx={d.cx}
          cy={d.cy}
          r={d.r}
          fill="#e8a0bf"
          opacity={0.7}
        />
      ))}
    </svg>
  );
}
