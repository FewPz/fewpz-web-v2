"use client";

import FallingPetals from "@/components/event/FallingPetals";
import HeroSection from "@/components/event/HeroSection";
import TicketSection from "@/components/event/TicketSection";
import LyricsSection from "@/components/event/LyricsSection";
import MilestonesSection from "@/components/event/MilestonesSection";
import FooterSection from "@/components/event/FooterSection";

export default function EventPage() {
  return (
    <div
      className="min-h-screen relative"
      style={{
        background:
          "linear-gradient(180deg, #fff5f7 0%, #fff0f3 15%, #fff8f9 40%, #fef2f4 60%, #fff5f0 80%, #fffaf5 100%)",
      }}
    >
      <FallingPetals />
      <HeroSection />
      <TicketSection />
      <LyricsSection />
      <MilestonesSection />
      <FooterSection />
    </div>
  );
}
