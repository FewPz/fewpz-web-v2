import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Command } from 'cmdk';
import {
  ArrowUpRight,
  Briefcase,
  Check,
  Copy,
  Download,
  Headphones,
  House,
  Languages,
  Linkedin,
  Mail,
  Moon,
  Newspaper,
  Search,
  Sparkles,
  Sun,
  User,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import LogoMark from '@/components/google/LogoMark';
import { blogPosts } from '@/lib/blog-posts';
import { colorClasses, type GoogleColor } from '@/lib/google-colors';
import { useI18n, type Localized } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import { TOOLS } from '@/lib/tools';
import { cn } from '@/lib/utils';

const EMAIL = 'fewpz.peeranat@gmail.com';
const OPEN_EVENT = 'command-palette:open';

/** Opens the palette from anywhere (e.g. the navbar search button). */
export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

const sections: { id: string; label: Localized; icon: LucideIcon; color: GoogleColor }[] = [
  { id: 'top', label: { en: 'Home', th: 'หน้าแรก' }, icon: House, color: 'blue' },
  { id: 'about', label: { en: 'About', th: 'เกี่ยวกับ' }, icon: User, color: 'blue' },
  { id: 'skills', label: { en: 'Skills', th: 'ทักษะ' }, icon: Sparkles, color: 'yellow' },
  { id: 'work', label: { en: 'Work & Experience', th: 'ผลงานและประสบการณ์' }, icon: Briefcase, color: 'red' },
  { id: 'listening', label: { en: "What I'm Listening To", th: 'เพลงที่ฟังอยู่' }, icon: Headphones, color: 'green' },
];

const links: { label: string; href: string; icon: LucideIcon | typeof SiGithub; color: GoogleColor }[] = [
  { label: 'GitHub', href: 'https://github.com/FewPz', icon: SiGithub, color: 'blue' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pfewpz/', icon: Linkedin, color: 'red' },
  { label: 'Email', href: `mailto:${EMAIL}`, icon: Mail, color: 'green' },
];

/**
 * Every search word must appear somewhere in the item's keywords (cmdk's default fuzzy match
 * is too loose: "language" matched a blog title letter by letter). Prefix matches rank first.
 */
function filter(_value: string, search: string, keywords: string[] = []) {
  const terms = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return 1;
  const words = keywords.map((k) => k.toLowerCase());
  const haystack = words.join(' ');
  if (!terms.every((term) => haystack.includes(term))) return 0;
  return words.some((w) => w.startsWith(terms[0]) || w.includes(` ${terms[0]}`)) ? 1 : 0.5;
}

/** Colored icon chip on the left of every row. */
function Chip({ color, children }: { color: GoogleColor; children: ReactNode }) {
  const c = colorClasses(color);
  return (
    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4', c.soft, c.ink)}>
      {children}
    </span>
  );
}

function Item({
  value,
  keywords,
  onSelect,
  color,
  icon,
  children,
  hint,
}: {
  value: string;
  keywords?: string[];
  onSelect: () => void;
  color: GoogleColor;
  icon: ReactNode;
  children: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <Command.Item
      value={value}
      keywords={keywords}
      onSelect={onSelect}
      className="group flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 text-sm text-foreground outline-none transition-colors data-[selected=true]:bg-muted"
    >
      <Chip color={color}>{icon}</Chip>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {hint && <span className="shrink-0 text-xs text-muted-foreground">{hint}</span>}
    </Command.Item>
  );
}

const groupClass =
  'px-2 pb-2 [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-muted-foreground';

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-border bg-card px-1 font-sans text-[10px] font-semibold text-muted-foreground shadow-[0_1px_0_rgba(60,64,67,0.15)]">
      {children}
    </kbd>
  );
}

export default function CommandPalette() {
  const { locale, setLocale, t } = useI18n();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  // Fresh search every time it opens
  useEffect(() => {
    if (!open) {
      setSearch('');
      setCopied(false);
    }
  }, [open]);

  const run = (action: () => void) => {
    setOpen(false);
    action();
  };

  const goToSection = (id: string) =>
    run(() => {
      if (pathname === '/') {
        if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
        else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate({ to: '/', hash: id === 'top' ? undefined : id });
      }
    });

  const openExternal = (href: string) =>
    run(() => {
      if (href.startsWith('mailto:')) window.location.href = href;
      else window.open(href, '_blank', 'noopener,noreferrer');
    });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setOpen(false), 900);
    } catch {
      openExternal(`mailto:${EMAIL}`);
    }
  };

  const posts = blogPosts.filter((post) => !post.hidden);
  const both = (text: string | Localized) => (typeof text === 'string' ? [text] : [text.en, text.th]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="top-[12vh] flex max-w-[calc(100%-2rem)] translate-y-0 flex-col gap-0 overflow-hidden rounded-2xl border-border p-0 shadow-[0_1px_3px_rgba(60,64,67,0.3),0_12px_40px_rgba(60,64,67,0.25)] sm:max-w-xl"
      >
        <DialogTitle className="sr-only">{t({ en: 'Command palette', th: 'ค้นหาคำสั่ง' })}</DialogTitle>
        <DialogDescription className="sr-only">
          {t({ en: 'Search pages, posts, tools and actions', th: 'ค้นหาหน้า บทความ เครื่องมือ และคำสั่ง' })}
        </DialogDescription>

        {/* Google color strip, same as GoogleCard */}
        <div aria-hidden className="flex h-1">
          <span className="flex-1 bg-g-blue" />
          <span className="flex-1 bg-g-red" />
          <span className="flex-1 bg-g-yellow" />
          <span className="flex-1 bg-g-green" />
        </div>

        <Command loop filter={filter} className="flex min-w-0 flex-col">
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              autoFocus
              placeholder={t({ en: 'Search or jump to…', th: 'ค้นหา หรือไปที่…' })}
              className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
            <Kbd>Esc</Kbd>
          </div>

          <Command.List className="max-h-[min(60vh,420px)] scroll-py-2 overflow-y-auto overscroll-contain">
            <Command.Empty className="flex flex-col items-center gap-3 py-12 text-sm text-muted-foreground">
              <LogoMark className="opacity-60" />
              {t({ en: 'No results found', th: 'ไม่พบผลลัพธ์' })}
            </Command.Empty>

            <Command.Group heading={t({ en: 'Navigate', th: 'ไปที่' })} className={groupClass}>
              {sections.map((s) => {
                const Icon = s.icon;
                return (
                  <Item
                    key={s.id}
                    value={`section-${s.id}`}
                    keywords={both(s.label)}
                    onSelect={() => goToSection(s.id)}
                    color={s.color}
                    icon={<Icon />}
                  >
                    {t(s.label)}
                  </Item>
                );
              })}
              <Item
                value="page-blog"
                keywords={['Blog', 'บล็อก', 'posts']}
                onSelect={() => run(() => navigate({ to: '/blogs' }))}
                color="green"
                icon={<Newspaper />}
              >
                {t({ en: 'Blog', th: 'บล็อก' })}
              </Item>
              <Item
                value="page-tools"
                keywords={['Tools', 'เครื่องมือ', 'utilities']}
                onSelect={() => run(() => navigate({ to: '/tools' }))}
                color="yellow"
                icon={<Wrench />}
              >
                {t({ en: 'Tools', th: 'เครื่องมือ' })}
              </Item>
            </Command.Group>

            <Command.Group heading={t({ en: 'Blog posts', th: 'บทความ' })} className={groupClass}>
              {posts.map((post) => (
                <Item
                  key={post.to}
                  value={`post-${post.to}`}
                  keywords={[...both(post.title), ...post.tags]}
                  onSelect={() => run(() => navigate({ to: post.to }))}
                  color="green"
                  icon={<Newspaper />}
                  hint={post.tags[0]}
                >
                  {t(post.title)}
                </Item>
              ))}
            </Command.Group>

            <Command.Group heading={t({ en: 'Tools', th: 'เครื่องมือ' })} className={groupClass}>
              {TOOLS.map((tool) => (
                <Item
                  key={tool.href}
                  value={`tool-${tool.href}`}
                  keywords={[tool.name, tool.desc]}
                  onSelect={() => run(() => navigate({ to: tool.href }))}
                  color="yellow"
                  icon={<span className="text-sm leading-none">{tool.icon}</span>}
                >
                  {tool.name}
                </Item>
              ))}
            </Command.Group>

            <Command.Group heading={t({ en: 'Actions', th: 'คำสั่ง' })} className={groupClass}>
              <Item
                value="action-language"
                keywords={['language', 'ภาษา', 'English', 'ไทย', 'Thai', 'translate', 'Switch to English', 'เปลี่ยนเป็นภาษาไทย']}
                onSelect={() => run(() => setLocale(locale === 'th' ? 'en' : 'th'))}
                color="blue"
                icon={<Languages />}
                hint={locale === 'th' ? 'EN' : 'TH'}
              >
                {locale === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
              </Item>
              <Item
                value="action-theme"
                keywords={['theme', 'dark', 'light', 'mode', 'ธีม', 'มืด', 'สว่าง', 'Dark mode', 'Light mode', 'โหมดมืด', 'โหมดสว่าง']}
                onSelect={() => run(() => toggleTheme())}
                color="yellow"
                icon={theme === 'dark' ? <Sun /> : <Moon />}
              >
                {theme === 'dark'
                  ? t({ en: 'Switch to light mode', th: 'เปลี่ยนเป็นโหมดสว่าง' })
                  : t({ en: 'Switch to dark mode', th: 'เปลี่ยนเป็นโหมดมืด' })}
              </Item>
              <Item
                value="action-copy-email"
                keywords={['copy', 'email', 'คัดลอก', 'อีเมล', 'contact']}
                onSelect={copyEmail}
                color="green"
                icon={copied ? <Check /> : <Copy />}
                hint={copied ? t({ en: 'Copied!', th: 'คัดลอกแล้ว!' }) : EMAIL}
              >
                {t({ en: 'Copy email address', th: 'คัดลอกอีเมล' })}
              </Item>
              <Item
                value="action-resume"
                keywords={['resume', 'cv', 'เรซูเม่', 'download']}
                onSelect={() => openExternal('/resume.pdf')}
                color="red"
                icon={<Download />}
                hint="PDF"
              >
                {t({ en: 'Download resume', th: 'ดาวน์โหลดเรซูเม่' })}
              </Item>
            </Command.Group>

            <Command.Group heading={t({ en: 'Links', th: 'ลิงก์' })} className={groupClass}>
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Item
                    key={link.label}
                    value={`link-${link.label}`}
                    keywords={[link.label]}
                    onSelect={() => openExternal(link.href)}
                    color={link.color}
                    icon={<Icon />}
                    hint={<ArrowUpRight className="size-3.5" />}
                  >
                    {link.label}
                  </Item>
                );
              })}
            </Command.Group>
          </Command.List>

          {/* Keyboard hints */}
          <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/40 px-4 py-2.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-2">
              <LogoMark className="scale-75" />
              Few.Pz
            </span>
            <span className="hidden items-center gap-3 sm:flex">
              <span className="flex items-center gap-1">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
                {t({ en: 'navigate', th: 'เลื่อน' })}
              </span>
              <span className="flex items-center gap-1">
                <Kbd>↵</Kbd>
                {t({ en: 'select', th: 'เลือก' })}
              </span>
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
