'use client';

import Magnet from '@/components/Magnet';
import BlurText from '@/components/BlurText';
import { Separator } from '@/components/ui/separator';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/FewPz' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pfewpz/' },
  { label: 'Email', href: 'mailto:fewpz.peeranat@gmail.com' },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-32 sm:py-40 bg-muted/30">
      <div className="max-w-3xl mx-auto px-6">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-12">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Contact</span>
          <Separator className="flex-1" />
        </div>
        
        {/* Big CTA */}
        <div className="space-y-8">
          <BlurText
            text="Let's work together"
            className="text-3xl sm:text-4xl md:text-5xl text-foreground font-light"
            delay={80}
            animateBy="words"
            direction="top"
            stepDuration={0.35}
          />
          
          <p className="text-lg text-muted-foreground max-w-lg">
            Have an interesting project? Let&apos;s talk! 
            Open for freelance and full-time opportunities.
          </p>
          
          {/* Email Link */}
          <Magnet padding={60} magnetStrength={3}>
            <Link 
              href="mailto:fewpz.peeranat@gmail.com"
              className="group inline-flex items-center gap-2 text-2xl sm:text-3xl text-foreground hover:text-muted-foreground transition-colors"
            >
              fewpz.peeranat@gmail.com
              <ArrowUpRight className="w-6 h-6 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Magnet>
        </div>
        
        {/* Social Links */}
        <div className="mt-16 flex gap-6">
          {socialLinks.map((link, index) => (
            <Magnet key={index} padding={40} magnetStrength={4}>
              <Link 
                href={link.href}
                target="_blank"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            </Magnet>
          ))}
        </div>
      </div>
    </section>
  );
}
