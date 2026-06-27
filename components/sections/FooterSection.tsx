import { Separator } from '@/components/ui/separator';

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/FewPz' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pfewpz/' },
  { label: 'Email', href: 'mailto:fewpz.peeranat@gmail.com' },
];

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 bg-background">
      <div className="max-w-5xl mx-auto px-6">
        <Separator className="mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© {currentYear} Peeranat Matsor — FewPz</span>
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
