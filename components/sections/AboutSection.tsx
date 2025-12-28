'use client';

import BlurText from '@/components/BlurText';
import { Separator } from '@/components/ui/separator';

export default function AboutSection() {
  return (
    <section id="about" className="py-32 sm:py-40 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-12">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">About</span>
          <Separator className="flex-1" />
        </div>
        
        {/* Bio Text with Blur Animation */}
        <div className="space-y-8">
          <BlurText
            text="Hi, I'm Peeranat (Few) 🚀"
            className="text-3xl sm:text-4xl md:text-5xl text-foreground font-light leading-tight"
            delay={80}
            animateBy="words"
            direction="top"
            stepDuration={0.35}
          />
          
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Fourth-Year Information Technology Student with a Focus on Software Engineer 
            at the School of Information Technology, KMITL.
          </p>
          
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Passionate about building web applications, backend systems, 
            and creating tools that solve real-world problems.
          </p>
        </div>
        
        {/* Status */}
        <div className="mt-16 flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm text-muted-foreground">Available for work</span>
        </div>
      </div>
    </section>
  );
}
