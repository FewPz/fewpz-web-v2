import RotatingText from '@/components/RotatingText';
import { ChevronDown, Download, MapPin } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import ColorDashes from '@/components/google/ColorDashes';
import GoogleCard from '@/components/google/GoogleCard';
import PillLink from '@/components/google/PillLink';
import { GOOGLE_COLORS, colorClasses, type GoogleColor } from '@/lib/google-colors';
import { useI18n, type Localized } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const ease = [0.22, 1, 0.36, 1] as const;

/** Four stacked Google-colored chevrons that light up top to bottom, forming a down arrow. */
function ScrollArrow() {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col items-center" role="presentation">
      {GOOGLE_COLORS.map((c, i) => (
        <motion.span
          key={c}
          className={cn('-my-1.5 block', colorClasses(c).text)}
          animate={reduce ? undefined : { opacity: [0.25, 1, 0.25], y: [0, 2, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
        >
          <ChevronDown className="size-5" strokeWidth={3} />
        </motion.span>
      ))}
    </div>
  );
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

const highlights: { text: Localized; color: GoogleColor }[] = [
  { text: { en: 'Web applications & backend systems', th: 'เว็บแอปพลิเคชันและระบบหลังบ้าน' }, color: 'blue' },
  { text: { en: 'Tools that solve real-world problems', th: 'เครื่องมือที่แก้ปัญหาได้จริง' }, color: 'red' },
];

const rotatingTexts: Record<'en' | 'th', string[]> = {
  en: ['Fourth-Year IT Student @ KMITL', 'Software Engineer Focus 🚀', 'Full-Stack Developer'],
  th: ['นักศึกษาไอทีปี 4 @ สจล.', 'สาย Software Engineer 🚀', 'Full-Stack Developer'],
};

const photos = [
  { src: '/photos/photo7.jpg', x: -68, rotate: -9 },
  { src: '/photos/photo2.jpg', x: 68, rotate: 8 },
  { src: '/photos/photo4.jpg', x: 0, rotate: -2 },
];

const fanVariants: Variants = {
  rest: (i: number) => ({ x: photos[i].x, rotate: photos[i].rotate, y: 0 }),
  spread: (i: number) => ({ x: photos[i].x * 1.45, rotate: photos[i].rotate * 1.7, y: i === 2 ? -10 : 4 }),
};

/** Avatar with a segmented four-color ring that spins on hover. */
function RingAvatar() {
  return (
    <motion.div className="relative size-14 shrink-0" initial="rest" animate="rest" whileHover="hover">
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'conic-gradient(var(--g-blue) 0 25%, var(--g-red) 0 50%, var(--g-yellow) 0 75%, var(--g-green) 0)',
        }}
        variants={{ rest: { rotate: 0 }, hover: { rotate: 180 } }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      />
      <span className="absolute inset-[3px] overflow-hidden rounded-full border-[3px] border-white bg-white">
        <img src="/photos/photo6.jpg" alt="Peeranat Matsor" className="size-full object-cover" />
      </span>
    </motion.div>
  );
}

/** Three polaroids fanned out; they spread further apart on hover. */
function PhotoFan() {
  return (
    <motion.div className="relative h-40" initial="rest" animate="rest" whileHover="spread">
      {photos.map((photo, i) => (
        <motion.div
          key={photo.src}
          className="absolute left-1/2 top-3 -ml-14"
          style={{ zIndex: i === 2 ? 3 : i + 1 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.6 + i * 0.12 }}
        >
          <motion.div
            custom={i}
            variants={fanVariants}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="w-28 rounded-[4px] border border-border bg-white p-1.5 pb-6 shadow-[0_1px_3px_rgba(60,64,67,0.2),0_4px_10px_rgba(60,64,67,0.1)]"
          >
            <img src={photo.src} alt="" className="aspect-square w-full rounded-[2px] object-cover" />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function HeroSection() {
  const { locale, t } = useI18n();

  return (
    <section className="relative min-h-screen flex items-center px-6 pt-28 pb-28 lg:pt-24 overflow-hidden">
      <div className="max-w-5xl mx-auto w-full grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* ── Text column ── */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Identity */}
          <motion.div variants={itemVariants} className="mb-8 flex items-center gap-3">
            <RingAvatar />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-foreground">
                FewPz <span className="text-g-yellow">✦</span>
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                {t({ en: 'Bangkok, Thailand', th: 'กรุงเทพฯ ประเทศไทย' })}
              </p>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-g-navy"
          >
            {locale === 'th' ? 'พีรณัฐ' : 'Peeranat'}
            <br />
            {locale === 'th' ? 'หมัดสอ' : 'Matsor'}
          </motion.h1>

          <ColorDashes className="mt-7" delay={0.55} />

          {/* Rotating subtitle */}
          <motion.div variants={itemVariants} className="mt-7">
            <RotatingText
              key={locale}
              texts={rotatingTexts[locale]}
              mainClassName="text-xl sm:text-2xl font-medium text-foreground"
              splitLevelClassName="overflow-hidden pb-1"
              rotationInterval={3000}
              staggerDuration={0.03}
              staggerFrom="first"
            />
          </motion.div>

          {/* Short bio */}
          <motion.p variants={itemVariants} className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
            {t({
              en: 'I build clean, fast web experiences — from pixel-perfect UIs to robust backends. Passionate about developer tooling and thoughtful design.',
              th: 'ผมสร้างเว็บที่สะอาดและรวดเร็ว ตั้งแต่ UI ที่ละเอียดทุกพิกเซลไปจนถึงระบบหลังบ้านที่แข็งแรง ชอบทำเครื่องมือสำหรับนักพัฒนาและงานออกแบบที่คิดมาอย่างดี',
            })}
          </motion.p>

          {/* Highlights */}
          <motion.ul variants={itemVariants} className="mt-7 space-y-3 text-sm text-muted-foreground">
            {highlights.map(({ text, color }) => (
              <li key={text.en} className="flex items-center gap-3">
                <span className={cn('size-2 rounded-full', colorClasses(color).bg)} />
                {t(text)}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* ── Card column ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease }}
          className="w-full max-w-md lg:justify-self-end"
        >
          <GoogleCard strip="view" className="px-7 pt-8 pb-7">
            <PhotoFan />
            <h2 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
              {t({ en: 'Explore my work', th: 'ดูผลงานของผม' })}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {t({
                en: 'Skills, open-source projects and experience, all in one place.',
                th: 'ทักษะ โปรเจกต์โอเพนซอร์ส และประสบการณ์ รวมไว้ในที่เดียว',
              })}
            </p>
            <div className="mt-6 space-y-3">
              <PillLink
                block
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t({ en: 'View Work', th: 'ดูผลงาน' })}
              </PillLink>
              <PillLink block icon={Download} href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                {t({ en: 'Resume', th: 'เรซูเม่' })}
              </PillLink>
            </div>
          </GoogleCard>
          <p className="mt-5 text-center text-xs text-muted-foreground">
            {t({ en: 'Want to say hi?', th: 'อยากทักทายกัน?' })}{' '}
            <a href="mailto:fewpz.peeranat@gmail.com" className="font-medium text-g-blue-ink hover:underline">
              {t({ en: 'Send me an email', th: 'ส่งอีเมลหาผม' })}
            </a>
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ScrollArrow />
          <span className="text-[10px] uppercase tracking-widest">{t({ en: 'Scroll', th: 'เลื่อนลง' })}</span>
        </div>
      </motion.div>
    </section>
  );
}
