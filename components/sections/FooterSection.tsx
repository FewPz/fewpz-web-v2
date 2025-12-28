'use client';

import { Separator } from '@/components/ui/separator';

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        <Separator className="mb-8" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>© {currentYear} Fewpz</span>
          <span>Bangkok, Thailand</span>
        </div>
      </div>
    </footer>
  );
}
