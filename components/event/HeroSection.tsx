import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { ArrowLeft } from "lucide-react";
import SakuraBranch from "./SakuraBranch";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.6 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 1.1]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <>
      {/* Back Button */}
      <motion.div
        className="fixed top-6 left-6 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#8B6F5E]/70 hover:text-[#8B6F5E] transition-colors backdrop-blur-sm bg-white/30 px-4 py-2 rounded-full border border-[#e8a0bf]/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </a>
      </motion.div>

      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Branch decoration top */}
        <motion.div
          className="absolute top-0 left-0 w-full opacity-40 pointer-events-none"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 0.4, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        >
          <SakuraBranch className="w-full h-auto" />
        </motion.div>

        {/* Gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(249,168,201,0.15) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(252,194,215,0.12) 0%, transparent 70%)",
            }}
          />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-20"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center px-6"
          >
            {/* Season label */}
            <motion.div variants={itemVariants} className="mb-6">
              <span
                className="inline-block text-xs tracking-[0.35em] uppercase text-[#c7899e] font-medium px-5 py-2 rounded-full border border-[#e8a0bf]/25 bg-white/40 backdrop-blur-sm"
                style={{ letterSpacing: "0.35em" }}
              >
                Graduation Ceremony
              </span>
            </motion.div>

            {/* Main Title — Thai */}
            <motion.div variants={itemVariants} className="space-y-2">
              <h1
                className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[1.1]"
                style={{
                  color: "#4a3540",
                  textShadow: "0 2px 40px rgba(232,160,191,0.2)",
                }}
              >
                ปลายฤดู
              </h1>
              <h1
                className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light leading-[1.1]"
                style={{
                  background:
                    "linear-gradient(135deg, #b5566e 0%, #c77a95 40%, #a06b80 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ซากุระ
              </h1>
            </motion.div>

            {/* English subtitle */}
            <motion.p
              variants={itemVariants}
              className="mt-6 text-base sm:text-lg tracking-[0.15em] text-[#9c6b7e] font-light"
            >
              Late Cherry Blossom Season
            </motion.p>

            {/* Date */}
            <motion.div variants={itemVariants} className="mt-8">
              <p className="text-sm text-[#8B6F5E]/60 tracking-[0.2em] uppercase">
                FewPz &mdash; Class of 2026
              </p>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
              variants={itemVariants}
              className="mt-16"
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            >
              <div className="flex flex-col items-center gap-2 text-[#c7899e]/50">
                <span className="text-[10px] tracking-[0.3em] uppercase">
                  Scroll
                </span>
                <svg
                  width="16"
                  height="24"
                  viewBox="0 0 16 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="1" y="1" width="14" height="22" rx="7" />
                  <motion.circle
                    cx="8"
                    cy="8"
                    r="2"
                    fill="currentColor"
                    animate={{ cy: [7, 14, 7] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom branch decoration */}
        <motion.div
          className="absolute bottom-0 right-0 w-2/3 opacity-30 pointer-events-none rotate-180"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <SakuraBranch className="w-full h-auto" />
        </motion.div>
      </section>
    </>
  );
}
