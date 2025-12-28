'use client';

import { Separator } from '@radix-ui/react-separator';
import { motion } from 'motion/react';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  tags?: string[];
}

const timelineData: TimelineItem[] = [
  {
    year: '2024',
    title: 'Started at KMITL',
    description: 'Began studying Data Science and Business Analytics at King Mongkut\'s Institute of Technology Ladkrabang',
    tags: ['Education', 'DSBA'],
  },
  {
    year: '2024',
    title: 'K-Dorm Project',
    description: 'Built an Intelligence Dormitory Management System for KMITL',
    tags: ['TypeScript', 'Full-Stack'],
  },
  {
    year: '2024',
    title: 'ITKMITLAuthMC',
    description: 'Developed a Minecraft Plugin for ITKMITL Authentication',
    tags: ['Java', 'Plugin'],
  },
  {
    year: '2023',
    title: 'DeployThings',
    description: 'Created deployment automation tools and backend services',
    tags: ['TypeScript', 'DevOps'],
  },
  {
    year: '2022',
    title: 'COVID Desktop App',
    description: 'Object-Oriented Programming final project - Desktop application for COVID data',
    tags: ['Java', 'OOP'],
  },
];

function TimelineItemComponent({ item, index }: { item: TimelineItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative pl-8 pb-12 last:pb-0"
    >
      {/* Line */}
      <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border" />
      
      {/* Dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
        viewport={{ once: true }}
        className="absolute left-0 top-1 w-6 h-6 rounded-full bg-background border-2 border-foreground flex items-center justify-center"
      >
        <div className="w-2 h-2 rounded-full bg-foreground" />
      </motion.div>
      
      {/* Content */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          {item.year}
        </span>
        <h3 className="text-lg font-medium text-foreground">
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {item.description}
        </p>
        {item.tags && (
          <div className="flex flex-wrap gap-2 pt-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function TimelineSection() {
  return (
    <section className="py-32 sm:py-40 bg-background">
      <div className="max-w-2xl mx-auto px-6">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-12">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Timeline</span>
          <Separator className="flex-1" />
        </div>
        
        <div className="relative">
          {timelineData.map((item, index) => (
            <TimelineItemComponent key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
