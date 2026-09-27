import { Link, useRouterState } from '@tanstack/react-router';
import { User, Briefcase, Newspaper } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import FlagIcon from '@/components/google/FlagIcon';
import LogoMark from '@/components/google/LogoMark';
import { GOOGLE_HEX, colorClasses, type GoogleColor } from '@/lib/google-colors';
import { useI18n, type Locale, type Localized } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const navLinks: { label: Localized; href: string; icon: typeof User; color: GoogleColor }[] = [
  { label: { en: 'About', th: 'เกี่ยวกับ' }, href: '/#about', icon: User, color: 'blue' },
  { label: { en: 'Work', th: 'ผลงาน' }, href: '/#work', icon: Briefcase, color: 'red' },
  { label: { en: 'Blog', th: 'บล็อก' }, href: '/blogs', icon: Newspaper, color: 'green' },
];

const locales: { id: Locale; code: string; label: string }[] = [
  { id: 'th', code: 'TH', label: 'ภาษาไทย' },
  { id: 'en', code: 'EN', label: 'English' },
];

const sectionIds = navLinks.filter((l) => l.href.startsWith('/#')).map((l) => l.href.slice(2));

const spring = { type: 'spring', stiffness: 420, damping: 34 } as const;

/** Tracks which home-page section is currently in the middle of the viewport. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
          else setActive((cur) => (cur === entry.target.id ? null : cur));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [enabled]);

  return active;
}

function handleAnchorClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  const id = href.slice(2);
  const el = document.getElementById(id);
  if (el) {
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

function NavItem({
  link,
  className,
  children,
}: {
  link: (typeof navLinks)[number];
  className: string;
  children: React.ReactNode;
}) {
  return link.href.startsWith('/#') ? (
    <a href={link.href} onClick={(e) => handleAnchorClick(e, link.href)} className={className}>
      {children}
    </a>
  ) : (
    <Link to={link.href} className={className}>
      {children}
    </Link>
  );
}

/** Thai | English flag switch for the desktop pill. */
function LanguageToggle() {
  const { locale, setLocale } = useI18n();
  return (
    <div role="radiogroup" aria-label="Language" className="flex items-center rounded-full bg-muted p-0.5">
      {locales.map(({ id, code, label }) => {
        const selected = locale === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            title={label}
            onClick={() => setLocale(id)}
            className={cn(
              'relative flex items-center gap-1.5 rounded-full py-1 pl-1.5 pr-2.5 text-xs font-semibold transition-colors',
              selected ? 'text-g-navy' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {selected && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(60,64,67,0.25)]"
                transition={spring}
              />
            )}
            <FlagIcon locale={id} className={cn('relative transition-opacity', !selected && 'opacity-70')} />
            <span className="relative">{code}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Navbar() {
  const { locale, setLocale, t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeSection = useActiveSection(pathname === '/');
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40));

  if (pathname === '/trade-gold') return null;

  const isActive = (href: string) =>
    href.startsWith('/#') ? pathname === '/' && activeSection === href.slice(2) : pathname.startsWith(href);

  return (
    <>
      {/* Desktop: floating pill at top */}
      <motion.nav
        className="hidden md:flex fixed top-5 left-1/2 z-50 w-max"
        initial={{ y: -40, opacity: 0, x: '-50%' }}
        animate={{ y: 0, opacity: 1, x: '-50%' }}
        transition={{ ...spring, delay: 0.1 }}
      >
        <div
          className={cn(
            'flex items-center gap-1 rounded-full border border-border bg-white/85 backdrop-blur-xl transition-[padding,box-shadow] duration-300',
            scrolled
              ? 'px-2 py-1.5 shadow-[0_1px_3px_rgba(60,64,67,0.2),0_4px_12px_rgba(60,64,67,0.12)]'
              : 'px-3 py-2',
          )}
        >
          <Link
            to="/"
            className="group flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-muted transition-colors mr-1"
          >
            <LogoMark className="transition-transform duration-500 group-hover:rotate-90" />
            <span className="text-base font-semibold text-g-navy">Few.Pz</span>
          </Link>

          <div className="w-px h-5 bg-border mx-1" />

          {navLinks.map((link) => {
            const active = isActive(link.href);
            const c = colorClasses(link.color);
            return (
              <NavItem
                key={link.href}
                link={link}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-full transition-colors',
                  active ? 'text-foreground' : cn('text-muted-foreground hover:bg-muted', c.hoverInk),
                )}
              >
                {t(link.label)}
                {/* Colored dash that slides to the active link */}
                {active && (
                  <motion.span
                    layoutId="nav-dash"
                    className="absolute inset-x-0 bottom-0.5 mx-auto h-[3px] w-5 rounded-full"
                    style={{ backgroundColor: GOOGLE_HEX[link.color] }}
                    transition={spring}
                  />
                )}
              </NavItem>
            );
          })}

          <div className="w-px h-5 bg-border mx-1" />
          <LanguageToggle />
        </div>
      </motion.nav>

      {/* Mobile: full-width bottom action bar (Material 3 style) */}
      <motion.nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/95 backdrop-blur-xl"
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={spring}
      >
        <div className="flex items-center justify-around px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            const c = colorClasses(link.color);
            return (
              <NavItem
                key={link.href}
                link={link}
                className={cn(
                  'flex flex-col items-center gap-1 min-w-[4rem] py-0.5 transition-colors',
                  active ? c.ink : 'text-muted-foreground',
                )}
              >
                <span className="relative flex h-8 w-14 items-center justify-center">
                  {active && (
                    <motion.span
                      layoutId="nav-pill-mobile"
                      className={cn('absolute inset-0 rounded-full', c.soft)}
                      transition={spring}
                    />
                  )}
                  <Icon className="relative w-5 h-5" />
                </span>
                <span className="text-[11px] font-medium">{t(link.label)}</span>
              </NavItem>
            );
          })}

          {/* Language switch: shows the language you'd switch to */}
          <button
            type="button"
            onClick={() => setLocale(locale === 'th' ? 'en' : 'th')}
            aria-label={locale === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
            className="flex flex-col items-center gap-1 min-w-[4rem] py-0.5 text-muted-foreground transition-colors"
          >
            <span className="flex h-8 w-14 items-center justify-center">
              <FlagIcon locale={locale === 'th' ? 'en' : 'th'} className="h-4 w-6" />
            </span>
            <span className="text-[11px] font-medium">{locale === 'th' ? 'EN' : 'ไทย'}</span>
          </button>
        </div>
      </motion.nav>
    </>
  );
}
