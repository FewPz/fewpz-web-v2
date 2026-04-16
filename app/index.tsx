import { createFileRoute } from '@tanstack/react-router'
import AboutSection from '@/components/sections/AboutSection'
import ContactSection from '@/components/sections/ContactSection'
import FooterSection from '@/components/sections/FooterSection'
import HeroSection from '@/components/sections/HeroSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import ResearchSection from '@/components/sections/ResearchSection'
import SkillsSection from '@/components/sections/SkillsSection'
import TimelineSection from '@/components/sections/TimelineSection'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <TimelineSection />
      <ResearchSection />
      <SkillsSection />
      <ContactSection />
      <FooterSection />
    </main>
  )
}
