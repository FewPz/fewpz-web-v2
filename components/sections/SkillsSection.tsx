'use client';

import CountUp from '@/components/CountUp';
import { Separator } from '@/components/ui/separator';

const skills = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'PHP', 'SQL', 'C',
  'Next.js', 'Sveltekit', 'Express.js', 'Ejs', 'Django', 'Nuxt',
  'Docker', 'Kubernetes', 'Jenkins', 'Git', 'VSCode', 'Rancher', 'Nginx',
  'HAProxy', 'ArgoCD', 'Harbor', 'Minio', 'AWS', 'GCP', 'Huawei Cloud',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
];

const stats = [
  { value: 3, suffix: '+', label: 'Years Experience' },
  { value: 20, suffix: '+', label: 'Projects' },
  { value: 10, suffix: '+', label: 'Clients' },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="py-32 sm:py-40 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-12">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Expertise</span>
          <Separator className="flex-1" />
        </div>
        
        {/* Stats with CountUp */}
        <div className="grid grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl sm:text-5xl font-semibold text-foreground mb-2">
                <CountUp 
                  from={0} 
                  to={stat.value}
                  duration={2}
                  separator=""
                />
                <span>{stat.suffix}</span>
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
        
        {/* Skills - Simple Flow */}
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {skills.map((skill, index) => (
            <span 
              key={index}
              className="text-lg text-muted-foreground hover:text-foreground transition-colors cursor-default"
            >
              {skill}
              {index < skills.length - 1 && <span className="ml-4 text-border">·</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
