"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import SakuraPetal from "./SakuraPetal";

interface FallingPetalData {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  swayAmount: number;
  rotation: number;
  opacity: number;
  color: string;
}

const COLORS = [
  "#f9a8c9",
  "#f4b6c2",
  "#fcc2d7",
  "#f8d0d9",
  "#e8a0bf",
  "#fbb1c4",
  "#f7c5d0",
  "#fdd5dc",
];

export default function FallingPetals() {
  const [petals, setPetals] = useState<FallingPetalData[]>([]);

  useEffect(() => {
    const generated: FallingPetalData[] = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 12 + Math.random() * 20,
      delay: Math.random() * 12,
      duration: 10 + Math.random() * 14,
      swayAmount: 40 + Math.random() * 80,
      rotation: Math.random() * 360,
      opacity: 0.3 + Math.random() * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    setPetals(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: -30,
            width: petal.size,
            height: petal.size,
            color: petal.color,
          }}
          animate={{
            y: [0, typeof window !== "undefined" ? window.innerHeight + 100 : 1200],
            x: [0, petal.swayAmount, -petal.swayAmount * 0.6, petal.swayAmount * 0.3],
            rotate: [petal.rotation, petal.rotation + 360 + Math.random() * 180],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 1],
            x: {
              duration: petal.duration * 0.7,
              delay: petal.delay,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <SakuraPetal
            style={{ opacity: petal.opacity, width: "100%", height: "100%" }}
          />
        </motion.div>
      ))}
    </div>
  );
}
