"use client";

import { motion, type Variants } from "motion/react";
import PetalDivider from "./PetalDivider";

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

const MILESTONES = [
  {
    year: "Year 1",
    title: "The Seed is Planted",
    desc: "First steps into the world of IT, discovering the love for code and creation.",
    side: "left" as const,
  },
  {
    year: "Year 2",
    title: "Roots Growing Deep",
    desc: "Building foundations, embracing challenges, and learning that every error is a lesson.",
    side: "right" as const,
  },
  {
    year: "Year 3",
    title: "Branches Reaching Out",
    desc: "Internships, projects, and collaborations that shaped the developer within.",
    side: "left" as const,
  },
  {
    year: "Year 4",
    title: "The Blossom",
    desc: "The culmination of all the hard work. The cherry blossom finally blooms.",
    side: "right" as const,
  },
];

export default function MilestonesSection() {
  return (
    <section className="relative z-20 py-16 sm:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <PetalDivider />

        <motion.h2
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-3xl sm:text-4xl font-bold text-center mt-12 mb-16"
          style={{ color: "#4a3540" }}
        >
          The Journey
        </motion.h2>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#e8a0bf]/30 via-[#e8a0bf]/50 to-[#e8a0bf]/10 hidden md:block" />

          {MILESTONES.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, x: milestone.side === "left" ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`relative flex items-center mb-16 last:mb-0 ${
                milestone.side === "right"
                  ? "md:flex-row-reverse"
                  : "md:flex-row"
              } flex-col md:flex-row`}
            >
              {/* Content */}
              <div
                className={`w-full md:w-[calc(50%-2rem)] ${
                  milestone.side === "right" ? "md:pl-0 md:pr-0" : ""
                }`}
              >
                <div
                  className="p-6 sm:p-8 rounded-2xl border border-[#e8a0bf]/15 hover:border-[#e8a0bf]/30 transition-all duration-500 group"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(254,242,244,0.3) 100%)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span className="text-xs tracking-[0.25em] uppercase text-[#c7899e] font-medium">
                    {milestone.year}
                  </span>
                  <h3
                    className="text-xl sm:text-2xl font-bold mt-2 mb-3 group-hover:text-[#c7899e] transition-colors"
                    style={{ color: "#4a3540" }}
                  >
                    {milestone.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#5a4550] leading-relaxed font-light">
                    {milestone.desc}
                  </p>
                </div>
              </div>

              {/* Center dot */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#f4b6c2] border-4 border-[#fff5f7] z-10 shadow-sm" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
