import ColorDashes from '@/components/google/ColorDashes';
import LogoMark from '@/components/google/LogoMark';
import { colorClasses, type GoogleColor } from '@/lib/google-colors';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

const socialLinks: { label: string; href: string; color: GoogleColor }[] = [
  { label: 'GitHub', href: 'https://github.com/FewPz', color: 'blue' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pfewpz/', color: 'red' },
  { label: 'Email', href: 'mailto:fewpz.peeranat@gmail.com', color: 'green' },
];

export default function FooterSection() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-16 pb-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="font-semibold text-g-navy">Few.Pz</span>
              <ColorDashes size="sm" className="ml-1" />
            </div>
            <span className="text-sm text-muted-foreground">© {currentYear} {t({ en: 'Peeranat Matsor', th: 'พีรณัฐ หมัดสอ' })}</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            {socialLinks.map((link) => {
              const c = colorClasses(link.color);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className={cn('group flex items-center gap-2 font-medium text-muted-foreground transition-colors', c.hoverInk)}
                >
                  <span className={cn('size-1.5 rounded-full', c.bg)} />
                  <span className="flex items-center gap-0.5">
                    {link.label}
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
