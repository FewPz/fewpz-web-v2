"use client";

import { motion } from "motion/react";
import SakuraPetal from "./SakuraPetal";
import PetalDivider from "./PetalDivider";

const LYRICS = [
  { text: "กลีบชมพูบางล่องลอยไปทั่วแผ่นฟ้า", delay: 0 },
  { text: "ต่างคนก็เดินตามเส้นทางที่ฝัน", delay: 0.15 },
];

export default function LyricsSection() {
  return (
    <section className="relative z-20 py-32 sm:py-44 px-6 overflow-hidden">
      {/* Soft ambient glow behind lyrics */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          className="w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(244,182,194,0.3) 0%, rgba(252,194,215,0.1) 50%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-2xl mx-auto relative">
        <PetalDivider />

        <div className="mt-16 space-y-0">
          {LYRICS.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 1.6,
                delay: line.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center py-6"
            >
              <p
                className="text-2xl sm:text-3xl md:text-4xl font-light leading-relaxed"
                style={{ color: "#4a3540" }}
              >
                {line.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Small decorative petal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
          whileInView={{ opacity: 0.5, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center py-8"
        >
          <SakuraPetal className="w-6 h-6 text-[#f4b6c2]" />
        </motion.div>
      </div>
    </section>
  );
}
