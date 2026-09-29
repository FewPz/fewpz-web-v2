import { createFileRoute } from '@tanstack/react-router'
import MemphisEdges from '@/components/decor/MemphisEdges'
import AboutSection from '@/components/sections/AboutSection'
import FooterSection from '@/components/sections/FooterSection'
import HeroSection from '@/components/sections/HeroSection'
import SkillsSection from '@/components/sections/SkillsSection'
import TimelineSection from '@/components/sections/TimelineSection'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="relative min-h-screen">
      <MemphisEdges />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <TimelineSection />
      <FooterSection />
    </main>
  )
}
