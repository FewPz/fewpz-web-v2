import { Link, useRouterState } from '@tanstack/react-router';
import { Moon, Sun, User, Briefcase, BookOpen, Newspaper } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'About', href: '/#about', icon: User },
  { label: 'Work', href: '/#work', icon: Briefcase },
  { label: 'Research', href: '/#research', icon: BookOpen },
  { label: 'Blog', href: '/blogs', icon: Newspaper },
];

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (pathname === '/trade-gold') return null;

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const id = href.slice(2);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Desktop: floating pill at top */}
      <nav className="hidden md:flex fixed top-5 left-1/2 -translate-x-1/2 z-50 w-max">
        <div className="flex items-center gap-1 rounded-full border border-border/50 bg-background/70 backdrop-blur-xl shadow-lg px-3 py-2">
          <Link
            to="/"
            className="text-sm font-semibold text-foreground px-3 py-1.5 rounded-full hover:bg-muted/60 transition-colors mr-1"
          >
            Few.Pz
          </Link>

          <div className="w-px h-4 bg-border/60 mx-1" />

          {navLinks.map((link) =>
            link.href.startsWith('/#') ? (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full hover:bg-muted/60 transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full hover:bg-muted/60 transition-colors"
              >
                {link.label}
              </Link>
            )
          )}

          <div className="w-px h-4 bg-border/60 mx-1" />

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-8 h-8"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile: full-width bottom action bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return link.href.startsWith('/#') ? (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="flex flex-col items-center gap-1 min-w-[3.5rem] py-1 text-muted-foreground hover:text-foreground active:text-foreground transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{link.label}</span>
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className="flex flex-col items-center gap-1 min-w-[3.5rem] py-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            );
          })}

          <button
            onClick={toggleTheme}
            className="flex flex-col items-center gap-1 min-w-[3.5rem] py-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="text-[10px] font-medium">{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </nav>
    </>
  );
}
