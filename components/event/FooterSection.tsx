"use client";

import { motion } from "motion/react";
import SakuraBranch from "./SakuraBranch";

export default function FooterSection() {
  return (
    <footer className="relative z-20 py-12 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          className="opacity-30 mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.3 }}
          viewport={{ once: true }}
        >
          <SakuraBranch className="w-48 h-auto mx-auto" />
        </motion.div>
        <p className="text-xs text-[#8B6F5E]/40 tracking-wide">
          Made with love &mdash; Late Cherry Blossom Season
        </p>
      </div>
    </footer>
  );
}
