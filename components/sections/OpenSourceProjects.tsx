import { useEffect, useState } from 'react';
import SpotlightCard from '@/components/SpotlightCard';
import ColorBar from '@/components/google/ColorBar';
import GoogleDots from '@/components/google/GoogleDots';
import PillLink from '@/components/google/PillLink';
import { colorAt, rgba } from '@/lib/google-colors';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { ArrowUpRight, Star, GitFork, Github } from 'lucide-react';
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
  archived: boolean;
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
  const accent = colorAt(index);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <a href={project.url} target="_blank" rel="noopener noreferrer" className="block group h-full">
        <SpotlightCard
          className="bg-card! border-border! p-6! rounded-xl! h-full flex flex-col transition-[translate,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_1px_3px_rgba(60,64,67,0.2),0_6px_16px_rgba(60,64,67,0.12)]"
          spotlightColor={rgba(accent.hex, 0.1)}
        >
          <ColorBar reveal="hover" className="absolute inset-x-0 top-0 z-10" />
          <div className="flex items-start justify-between mb-4 flex-1">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {project.language && (
                  <span 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: languageColors[project.language] || '#888' }}
                  />
                )}
                <h3 className="text-lg font-semibold text-foreground capitalize">
                  {project.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description || 'No description'}
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-g-blue-ink group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300 shrink-0 ml-4" />
          </div>
          
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-border mt-auto">
            <div className="flex gap-2 flex-wrap">
              {project.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  <span className={cn('size-1.5 rounded-full', colorAt(index + idx).bg)} />
                  {tag}
                </span>
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
              <span>{project.year}</span>
            </div>
          </div>
        </SpotlightCard>
      </a>
    </motion.div>
  );
}

// Cached across mounts so switching tabs doesn't refetch from GitHub.
let projectsRequest: Promise<Project[]> | null = null;
let cachedProjects: Project[] | null = null;

async function fetchProjects(): Promise<Project[]> {
  const response = await fetch('https://api.github.com/users/FewPz/repos?sort=updated&per_page=100');
  if (!response.ok) {
    throw new Error('Failed to fetch repositories');
  }
  const repos: GitHubRepo[] = await response.json();

  // Filter out forked repos and profile repo, sort by stars/activity
  return repos
    .filter(repo => !repo.fork && repo.name !== 'FewPz' && repo.name !== 'FewPz.github.io' && !repo.archived)
    .sort((a, b) => {
      // Sort by stars first, then by recent update
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    })
    .slice(0, 6)
    .map(repo => ({
      title: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
      description: repo.description || 'No description available',
      tags: repo.language ? [repo.language, ...repo.topics.slice(0, 2)] : repo.topics.slice(0, 3),
      year: new Date(repo.created_at).getFullYear().toString(),
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
    }));
}

function loadProjects() {
  projectsRequest ??= fetchProjects()
    .then((projects) => (cachedProjects = projects))
    .catch((err) => {
      projectsRequest = null; // allow a retry on next mount
      throw err;
    });
  return projectsRequest;
}

/** GitHub repositories grid, shown in the Experience section's "Open Source" tab. */
export default function OpenSourceProjects() {
  const { t } = useI18n();
  const [projects, setProjects] = useState<Project[]>(cachedProjects ?? []);
  const [loading, setLoading] = useState(cachedProjects === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedProjects) return;
    let active = true;
    loadProjects()
      .then((result) => active && setProjects(result))
      .catch((err) => active && setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <GoogleDots size={10} />
          </div>
        )}
        
        {/* Error State - show but still display projects if fallback works */}
        {error && !loading && projects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>{t({ en: 'Failed to load projects from GitHub', th: 'โหลดโปรเจกต์จาก GitHub ไม่สำเร็จ' })}</p>
          </div>
        )}
        
        {/* Projects Grid */}
        {!loading && projects.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
            <PillLink href="https://github.com/FewPz" target="_blank" rel="noopener noreferrer" icon={Github}>
              {t({ en: 'View all repositories', th: 'ดู repository ทั้งหมด' })}
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover/pill:-translate-y-0.5 group-hover/pill:translate-x-0.5" />
            </PillLink>
          </motion.div>
        )}
    </div>
  );
}
