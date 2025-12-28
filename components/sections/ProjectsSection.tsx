'use client';

import { useEffect, useState } from 'react';
import SpotlightCard from '@/components/SpotlightCard';
import BlurText from '@/components/BlurText';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowUpRight, Star, GitFork, Loader2, Github } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  created_at: string;
  updated_at: string;
  topics: string[];
}

interface Project {
  title: string;
  description: string;
  tags: string[];
  year: string;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
}

// Language colors
const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Java: '#b07219',
  Python: '#3572A5',
  Svelte: '#ff3e00',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Link href={project.url} target="_blank" className="block group h-full">
        <SpotlightCard 
          className="bg-card! border-border! hover:border-foreground/20! transition-all duration-300 p-6! rounded-xl! h-full flex flex-col"
          spotlightColor="rgba(255, 255, 255, 0.1)"
        >
          <div className="flex items-start justify-between mb-4 flex-1">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {project.language && (
                  <span 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: languageColors[project.language] || '#888' }}
                  />
                )}
                <h3 className="text-lg font-medium text-foreground group-hover:text-foreground/80 transition-colors capitalize">
                  {project.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description || 'No description'}
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300 shrink-0 ml-4" />
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
            <div className="flex gap-2 flex-wrap">
              {project.tags.slice(0, 3).map((tag, idx) => (
                <Badge key={idx} variant="outline" className="font-normal text-xs bg-transparent">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {project.stars > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" fill="currentColor" />
                  {project.stars}
                </span>
              )}
              {project.forks > 0 && (
                <span className="flex items-center gap-1">
                  <GitFork className="w-3 h-3" />
                  {project.forks}
                </span>
              )}
              <span className="text-muted-foreground/60">{project.year}</span>
            </div>
          </div>
        </SpotlightCard>
      </Link>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGitHubRepos() {
      try {
        const response = await fetch('https://api.github.com/users/FewPz/repos?sort=updated&per_page=100');
        
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        
        const repos: GitHubRepo[] = await response.json();
        
        // Filter out forked repos and profile repo, sort by stars/activity
        const filteredRepos = repos
          .filter(repo => !repo.fork && repo.name !== 'FewPz' && repo.name !== 'FewPz.github.io')
          .sort((a, b) => {
            // Sort by stars first, then by recent update
            if (b.stargazers_count !== a.stargazers_count) {
              return b.stargazers_count - a.stargazers_count;
            }
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
          })
          .slice(0, 6);
        
        const formattedProjects: Project[] = filteredRepos.map(repo => ({
          title: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
          description: repo.description || 'No description available',
          tags: repo.language ? [repo.language, ...repo.topics.slice(0, 2)] : repo.topics.slice(0, 3),
          year: new Date(repo.created_at).getFullYear().toString(),
          url: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
        }));
        
        setProjects(formattedProjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Fallback to static data
        setProjects([
          {
            title: 'mock final webpro',
            description: 'Web Programming Mock Final Project',
            tags: ['TypeScript', 'Web'],
            year: '2025',
            url: 'https://github.com/FewPz/mock-final-webpro',
            stars: 3,
            forks: 0,
            language: 'TypeScript',
          },
          {
            title: 'K-Dorm',
            description: 'Intelligence Dormitory Management System for KMITL',
            tags: ['TypeScript', 'Full-Stack'],
            year: '2024',
            url: 'https://github.com/FewPz/K-Dorm',
            stars: 0,
            forks: 0,
            language: 'TypeScript',
          },
          {
            title: 'ITKMITLAuthMC',
            description: 'Minecraft Plugin Authentication ITKMITL',
            tags: ['Java', 'Plugin'],
            year: '2024',
            url: 'https://github.com/FewPz/ITKMITLAuthMC',
            stars: 2,
            forks: 0,
            language: 'Java',
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubRepos();
  }, []);

  return (
    <section id="work" className="py-32 sm:py-40">
      <div className="max-w-3xl mx-auto px-6">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-12">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Projects</span>
          <Separator className="flex-1" />
        </div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <BlurText
            text="Open Source"
            className="text-3xl sm:text-4xl font-semibold text-foreground mb-4"
            delay={50}
            animateBy="letters"
            direction="top"
          />
          <p className="text-muted-foreground">
            Projects I&apos;ve built and contributed to
          </p>
        </motion.div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}
        
        {/* Error State - show but still display projects if fallback works */}
        {error && !loading && projects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Failed to load projects from GitHub</p>
          </div>
        )}
        
        {/* Projects Grid */}
        {!loading && projects.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
          </div>
        )}
        
        {/* View More Link */}
        {!loading && projects.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link 
              href="https://github.com/FewPz" 
              target="_blank"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-border bg-card hover:bg-muted transition-colors group"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm font-medium">View all repositories</span>
              <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
