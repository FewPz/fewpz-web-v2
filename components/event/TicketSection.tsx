"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import PetalDivider from "./PetalDivider";

// 10/10/2569 BE = 10/10/2026 CE, 00:00 Bangkok time (GMT+7)
const TICKET_DATE = new Date("2026-10-09T17:00:00.000Z");

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  const isLive = diff === 0;

  return { days, hours, minutes, seconds, isLive };
}

function CountdownUnit({
  value,
  label,
  delay,
}: {
  value: number;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center"
    >
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-xl sm:rounded-2xl flex items-center justify-center border border-[#e8a0bf]/20 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(254,242,244,0.4) 100%)",
          backdropFilter: "blur(12px)",
        }}
      >
        <span
          className="text-2xl sm:text-3xl md:text-5xl font-bold tabular-nums"
          style={{ color: "#4a3540" }}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-2 sm:mt-3 text-[8px] sm:text-[10px] md:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#9c6b7e]">
        {label}
      </span>
    </motion.div>
  );
}

function CountdownSeparator() {
  return (
    <span
      className="text-xl sm:text-2xl md:text-4xl font-light mt-[-1rem] sm:mt-[-1.5rem]"
      style={{ color: "#e8a0bf" }}
    >
      :
    </span>
  );
}

function TicketBenefits() {
  const benefits = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-7 sm:h-7">
          <path d="M18 8.5V8a6 6 0 0 0-12 0v.5" />
          <path d="M7 8.5C7 6 9 4.5 12 4.5s5 1.5 5 4" />
          <path d="M12 13v3" />
          <path d="M8 21h8" />
          <path d="M12 16a4 4 0 0 0 4-4H8a4 4 0 0 0 4 4z" />
        </svg>
      ),
      title: "Handshake 30 วินาที",
      desc: "จับมือพูดคุยกับ FewPz แบบตัวต่อตัว 30 วินาที",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-7 sm:h-7">
          <rect x="2" y="4" width="20" height="16" rx="3" />
          <circle cx="9" cy="12" r="2.5" />
          <circle cx="15" cy="12" r="2.5" />
          <path d="M9 9.5V8" />
          <path d="M15 9.5V8" />
        </svg>
      ),
      title: "ถ่ายรูปคู่ 2 ช็อต",
      desc: "ถ่ายรูปร่วมกับ FewPz ในชุดครุย 2 ช็อต",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-7 sm:h-7">
          <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" />
          <path d="M12 2v13" />
          <polyline points="7,7 12,2 17,7" />
          <rect x="4" y="10" width="16" height="2" rx="1" />
        </svg>
      ),
      title: "มอบของขวัญได้",
      desc: "สามารถนำของขวัญมาแสดงความยินดีได้ตามใจ",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12 sm:mt-16 max-w-lg mx-auto"
    >
      <div className="text-center mb-6 sm:mb-8">
        <span className="text-xs sm:text-sm tracking-[0.2em] uppercase text-[#a0758a] font-light">
          สิทธิพิเศษสำหรับผู้ถือบัตร
        </span>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {benefits.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex items-start gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl border border-[#e8a0bf]/15 hover:border-[#e8a0bf]/30 transition-all duration-400 group"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(254,242,244,0.35) 100%)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              className="shrink-0 w-11 h-11 sm:w-13 sm:h-13 rounded-xl flex items-center justify-center text-[#c7899e] group-hover:text-[#d4788c] transition-colors"
              style={{
                background:
                  "linear-gradient(135deg, rgba(244,182,194,0.15) 0%, rgba(232,160,191,0.08) 100%)",
              }}
            >
              {b.icon}
            </div>
            <div className="min-w-0">
              <h3
                className="text-sm sm:text-base font-bold leading-[1.2] mb-1"
                style={{ color: "#4a3540" }}
              >
                {b.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#6b5460] font-light leading-relaxed">
                {b.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-center mt-5 sm:mt-6 text-[10px] sm:text-xs text-[#a88094] font-light"
      >
        * Handshake หรือ ถ่ายรูปคู่ &mdash; เลือกได้ 1 อย่าง / มอบของขวัญได้ทุกคน
      </motion.p>
    </motion.div>
  );
}

export default function TicketSection() {
  const { days, hours, minutes, seconds, isLive } = useCountdown(TICKET_DATE);

  return (
    <section className="relative z-20 py-20 sm:py-24 md:py-32 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <PetalDivider />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mt-8 sm:mt-12"
        >
          <span className="inline-block text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#c7899e] font-medium px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-[#e8a0bf]/20 bg-white/30 backdrop-blur-sm mb-6 sm:mb-8">
            Ticket
          </span>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] mb-3 sm:mb-4"
            style={{ color: "#4a3540" }}
          >
            {isLive ? "เปิดจองแล้ว!" : "เปิดจองบัตร"}
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#5a4550] font-light mb-2 sm:mb-4">
            10 ตุลาคม 2569 &mdash; เวลา 00.00 น.
          </p>
          <p className="text-xs sm:text-sm text-[#a88094] font-light">
            10 October 2026 &mdash; 00:00 (GMT+7)
          </p>
        </motion.div>

        {/* Countdown */}
        {!isLive ? (
          <div className="mt-10 sm:mt-14 flex items-center justify-center gap-2 sm:gap-3 md:gap-5">
            <CountdownUnit value={days} label="วัน" delay={0} />
            <CountdownSeparator />
            <CountdownUnit value={hours} label="ชั่วโมง" delay={0.1} />
            <CountdownSeparator />
            <CountdownUnit value={minutes} label="นาที" delay={0.2} />
            <CountdownSeparator />
            <CountdownUnit value={seconds} label="วินาที" delay={0.3} />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 sm:mt-14 text-center"
          >
            <div
              className="inline-block px-8 sm:px-10 py-4 sm:py-5 rounded-2xl border border-[#e8a0bf]/30 cursor-pointer hover:border-[#e8a0bf]/60 transition-all duration-500"
              style={{
                background:
                  "linear-gradient(135deg, rgba(212,120,140,0.9) 0%, rgba(199,137,158,0.9) 100%)",
              }}
            >
              <span className="text-base sm:text-lg md:text-xl font-bold text-white tracking-wide">
                จองบัตรเลย
              </span>
            </div>
          </motion.div>
        )}

        {/* Benefits */}
        <TicketBenefits />

        {/* Decorative note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center mt-8 sm:mt-10 text-[10px] sm:text-xs text-[#c7899e]/40 tracking-wide"
        >
          FewPz &bull; KMITL &bull; Class of 2026
        </motion.p>
      </div>
    </section>
  );
}
