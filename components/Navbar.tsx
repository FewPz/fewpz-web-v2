'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Magnet from '@/components/Magnet';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname === '/trade-gold') return null;

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'
      }`}>
      <div
        className={`absolute inset-0 -z-10 transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'
          }`}
      >
        <div className="absolute inset-0 bg-background/50 backdrop-blur-xl [mask-image:linear-gradient(to_bottom,black_60%,transparent)]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Magnet padding={40} magnetStrength={3}>
          <Link href="/" className="text-lg font-medium text-foreground">
            Fewpz
          </Link>
        </Magnet>

        {/* Theme Toggle */}
        <Magnet padding={40} magnetStrength={3}>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </Magnet>
      </div>
    </nav>
  );
}
