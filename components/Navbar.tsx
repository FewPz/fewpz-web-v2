'use client';

import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Magnet from '@/components/Magnet';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${
      scrolled ? 'py-4' : 'py-6'
    }`}>
      <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
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
