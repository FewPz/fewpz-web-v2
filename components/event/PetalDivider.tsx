"use client";

import SakuraPetal from "./SakuraPetal";

export default function PetalDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#e8a0bf]/50" />
      <div className="w-2 h-2 rounded-full bg-[#f4b6c2] rotate-45" />
      <SakuraPetal
        className="w-5 h-5 text-[#f4b6c2]"
        style={{ opacity: 0.7 }}
      />
      <div className="w-2 h-2 rounded-full bg-[#f4b6c2] rotate-45" />
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#e8a0bf]/50" />
    </div>
  );
}
