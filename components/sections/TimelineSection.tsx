'use client';

import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { motion, type Variants, AnimatePresence } from 'motion/react';
import TiltedCard from '@/components/TiltedCard';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface EducationItem {
  logo: string;
  institution: string;
  degree: string;
  period: string;
  description: string;
  status: 'current' | 'completed';
}

interface ExperienceItem {
  year: string;
  title: string;
  description: string;
  tags?: string[];
  type: 'work' | 'project';
}

const educationData: EducationItem[] = [
  {
    logo: '/logos/kmitl.png',
    institution: "King Mongkut's Institute of Technology Ladkrabang",
    degree: 'M.Sc. Information Technology (Honors Program)',
    period: '2025 - Present',
    description: 'Fourth-year Information Technology student (Information track) enrolled in the 4+1 Honors Program, preparing for an accelerated master’s degree.',
    status: 'current',
  },
  {
    logo: '/logos/kmitl.png',
    institution: "King Mongkut's Institute of Technology Ladkrabang",
    degree: 'B.Sc. Information Technology (Software Engineering)',
    period: '2022 - Present',
    description: 'Fourth-Year student in the School of Information Technology, focusing on Software Engineering.',
    status: 'current',
  },
  {
    logo: '/logos/mvsk.jpg',
    institution: 'Mahavajiravudh Changwat Songkhla School',
    degree: 'High School Diploma (Language Arts Korean-Japanese Program)',
    period: '2019 - 2022',
    description: 'Graduated with academic honors, awarded a merit certificate, and supported through advanced studies in information technology.',
    status: 'completed',
  },
];

const experienceData: ExperienceItem[] = [
  {
    year: '2025',
    title: '<u>Judge - Online Testing & Assessment Platform',
    description: 'Developed a faculty-funded quiz and assessment platform. Use by 100+ students and lecturers for online examinations and quizzes.',
    tags: ['Next.js', 'Elysia', 'Docker', 'MongoDB', 'Minio'],
    type: 'project',
  },
  {
    year: '2024',
    title: 'Captive Portal - ITKMITL Authentication',
    description: 'Developed a faculty-funded captive portal for ITKMITL Authentication Internet Services using LDAP. Actively used by students, lecturers, and staff.',
    tags: ['SvelteKit', 'LDAP', 'Fortigate'],
    type: 'project',
  },
  {
    year: '2024',
    title: '<i>Judge - Online Code Judging System',
    description: 'Built faculty-funded online judge system for competitive programming, supporting Python, C, C++, Scala, and Raptor. Used by 350+ students.',
    tags: ['Next.js', 'Express', 'Docker', 'MySQL'],
    type: 'project',
  },
  {
    year: '2024',
    title: 'J:Learn - Structure Validation System',
    description: 'Designed and developed faculty-funded online validation structure system for Java. Used by 210+ students at ITKMITL.',
    tags: ['Next.js', 'Express', 'Figma'],
    type: 'project',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

function EducationCard({ item }: { item: EducationItem }) {
  return (
    <motion.div
      variants={itemVariants}
      className="relative group"
    >
      <div className="flex gap-6 p-6 rounded-2xl bg-card border border-border hover:border-foreground/20 transition-all duration-300">
        {/* Logo with TiltedCard effect */}
        <div className="shrink-0">
          <TiltedCard
            imageSrc={item.logo}
            altText={item.institution}
            containerHeight="80px"
            containerWidth="80px"
            imageHeight="80px"
            imageWidth="80px"
            scaleOnHover={1.05}
            rotateAmplitude={8}
            showMobileWarning={false}
            showTooltip={false}
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="text-lg font-medium text-foreground leading-tight">
                {item.institution}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {item.degree}
              </p>
            </div>
            {item.status === 'current' && (
              <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Current
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground/70 mb-2">{item.period}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ExperienceCard({ item, index }: { item: ExperienceItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative pl-8 pb-10 last:pb-0"
    >
      {/* Line */}
      <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border" />
      
      {/* Dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
        viewport={{ once: true }}
        className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-background border-2 border-foreground flex items-center justify-center"
      >
        <div className="w-2 h-2 rounded-full bg-foreground" />
      </motion.div>
      
      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            {item.year}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-medium">
            {item.type === 'work' ? 'Work' : 'Project'}
          </span>
        </div>
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
                className="text-xs px-2.5 py-1 bg-muted text-muted-foreground rounded-full"
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
  const [showAllEducation, setShowAllEducation] = useState(false);
  const visibleEducation = showAllEducation ? educationData : educationData.slice(0, 2);

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        {/* Education Section */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-12">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Education</span>
            <Separator className="flex-1" />
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={showAllEducation ? 'all' : 'partial'}
            >
              {visibleEducation.map((item) => (
                <EducationCard key={`${item.institution}-${item.period}`} item={item} />
              ))}
            </motion.div>
          </AnimatePresence>
          
          {educationData.length > 2 && (
            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllEducation(!showAllEducation)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showAllEducation ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Show {educationData.length - 2} More
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>

        {/* Experience Section */}
        <div>
          <div className="flex items-center gap-4 mb-12">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Experience</span>
            <Separator className="flex-1" />
          </div>
          
          <div className="relative">
            {experienceData.map((item, index) => (
              <ExperienceCard key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
