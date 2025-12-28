'use client';

import { Separator } from '@/components/ui/separator';
import { motion, type Variants } from 'motion/react';
import { ExternalLink, FileText, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

interface Publication {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: 'journal' | 'conference' | 'workshop' | 'preprint';
  doi?: string;
  url?: string;
  abstract?: string;
  tags?: string[];
}

const publicationsData: Publication[] = [
  // Add your publications here
  // Example:
  // {
  //   title: 'Your Paper Title',
  //   authors: ['Peeranat Matsor', 'Co-author Name'],
  //   venue: 'Conference/Journal Name',
  //   year: 2024,
  //   type: 'conference',
  //   doi: '10.xxxx/xxxxx',
  //   url: 'https://example.com/paper',
  //   abstract: 'Brief description of the paper...',
  //   tags: ['Machine Learning', 'Web Development'],
  // },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

const typeColors: Record<Publication['type'], string> = {
  journal: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  conference: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  workshop: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  preprint: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
};

const typeLabels: Record<Publication['type'], string> = {
  journal: 'Journal',
  conference: 'Conference',
  workshop: 'Workshop',
  preprint: 'Preprint',
};

function PublicationCard({ publication }: { publication: Publication }) {
  const highlightAuthor = (author: string) => {
    if (author.toLowerCase().includes('peeranat') || author.toLowerCase().includes('matsor')) {
      return <span className="font-semibold text-foreground">{author}</span>;
    }
    return author;
  };

  return (
    <motion.div
      variants={itemVariants}
      className="group"
    >
      <div className="p-6 rounded-2xl bg-card border border-border hover:border-foreground/20 transition-all duration-300">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeColors[publication.type]}`}>
              {typeLabels[publication.type]}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            {publication.year}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-medium text-foreground leading-tight mb-2 group-hover:text-foreground/80 transition-colors">
          {publication.url ? (
            <Link href={publication.url} target="_blank" className="hover:underline inline-flex items-center gap-2">
              {publication.title}
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ) : (
            publication.title
          )}
        </h3>

        {/* Authors */}
        <div className="flex items-start gap-2 mb-3 text-sm text-muted-foreground">
          <Users className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {publication.authors.map((author, i) => (
              <span key={i}>
                {highlightAuthor(author)}
                {i < publication.authors.length - 1 && ', '}
              </span>
            ))}
          </p>
        </div>

        {/* Venue */}
        <p className="text-sm text-muted-foreground italic mb-3">
          {publication.venue}
        </p>

        {/* Abstract (if available) */}
        {publication.abstract && (
          <p className="text-sm text-muted-foreground/80 leading-relaxed mb-3 line-clamp-2">
            {publication.abstract}
          </p>
        )}

        {/* Tags & DOI */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          {publication.tags && publication.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {publication.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {publication.doi && (
            <Link 
              href={`https://doi.org/${publication.doi}`}
              target="_blank"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              DOI: {publication.doi}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function PublicationsSection() {
  if (publicationsData.length === 0) {
    return null; // Don't render if no publications
  }

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-12">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Publications</span>
          <Separator className="flex-1" />
        </div>

        {/* Publications Count */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">
            {publicationsData.length} publication{publicationsData.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Publications List */}
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {publicationsData.map((publication, index) => (
            <PublicationCard key={index} publication={publication} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
