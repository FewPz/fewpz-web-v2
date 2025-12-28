"use client";

import { useEffect, useState } from "react";
import Aurora from "./Aurora";

interface AuroraWithThemeProps {
  blend?: number;
  amplitude?: number;
  speed?: number;
}

export default function AuroraWithTheme({
  blend = 0.5,
  amplitude = 1.0,
  speed = 0.5,
}: AuroraWithThemeProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          setIsDark(isDark);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Light mode colors: soft pastels
  const lightColors = ["#a78bfa", "#c4b5fd", "#e9d5ff"];

  // Dark mode colors: vibrant neons
  const darkColors = ["#3A29FF", "#FF94B4", "#FF3232"];

  return (
    <Aurora
      colorStops={isDark ? darkColors : lightColors}
      blend={blend}
      amplitude={amplitude}
      speed={speed}
    />
  );
}
