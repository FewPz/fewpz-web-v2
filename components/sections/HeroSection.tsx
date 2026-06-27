import Magnet from '@/components/Magnet';
import RotatingText from '@/components/RotatingText';
import { ArrowDown, Download, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, type Variants } from 'motion/react';

function Polaroid({
  src,
  alt,
  rotation,
  delay,
  className,
}: {
  src: string;
  alt: string;
  rotation: number;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: rotation - 10 }}
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      transition={{ duration: 0.8, delay: delay || 0, type: 'spring', stiffness: 100 }}
    >
      <Magnet padding={80} magnetStrength={4}>
        <div
          className={`bg-white p-3 pb-10 shadow-2xl transition-transform duration-500 hover:scale-105 cursor-pointer ${className}`}
        >
          <div className="relative w-36 h-36 overflow-hidden bg-muted">
            <img src={src} alt={alt} className="object-cover absolute inset-0 w-full h-full" />
          </div>
        </div>
      </Magnet>
    </motion.div>
  );
}

export default function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background px-6 overflow-hidden">
      {/* Ambient glow — sits behind the polaroid cluster */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-orange-500/6 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* ── Text column ── */}
        <motion.div
          className="flex-1 text-center lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Location badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground border border-border/60 rounded-full px-3 py-1.5 bg-background/80">
              <MapPin className="w-3 h-3" />
              Bangkok, Thailand
            </span>
          </motion.div>

          {/* Name */}
          <motion.div className="relative inline-block mb-2" variants={itemVariants}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground tracking-tight leading-none">
              PEERANAT
              <br />
              MATSOR
            </h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.4, type: 'spring', stiffness: 200 }}
              className="absolute -top-3 -right-4 sm:-top-4 sm:-right-10 rotate-12 bg-orange-500 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 z-20"
            >
              FewPz <span className="text-yellow-200">✦</span>
            </motion.div>
          </motion.div>

          {/* Rotating subtitle */}
          <motion.div className="mt-5 mb-5" variants={itemVariants}>
            <RotatingText
              texts={[
                'Fourth-Year IT Student @ KMITL',
                'Software Engineer Focus 🚀',
                'Full-Stack Developer',
              ]}
              className="text-lg sm:text-xl text-muted-foreground font-light"
              rotationInterval={3000}
              staggerDuration={0.03}
              staggerFrom="first"
            />
          </motion.div>

          {/* Short bio */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-muted-foreground/80 max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed"
          >
            I build clean, fast web experiences — from pixel-perfect UIs to robust backends.
            Passionate about developer tooling and thoughtful design.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center lg:justify-start gap-3 flex-wrap"
          >
            <Button
              asChild
              size="default"
              className="rounded-full px-6 text-sm"
            >
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Work →
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="default"
              className="rounded-full px-6 text-sm border-foreground/20 hover:bg-foreground/5"
            >
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-3.5 w-3.5" />
                Resume
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* ── Polaroid cluster ── */}
        <div className="relative w-72 h-72 lg:w-80 lg:h-80 flex-shrink-0">
          {/* Photo 1 — left, tilted -8° */}
          <div className="absolute top-8 left-0 z-10">
            <Polaroid src="/photos/photo1.jpg" alt="Photo 1" rotation={-8} delay={0.3} />
          </div>
          {/* Photo 2 — top-right, tilted +7° */}
          <div className="absolute top-0 right-0 z-20">
            <Polaroid src="/photos/photo2.jpg" alt="Photo 2" rotation={7} delay={0.5} />
          </div>
          {/* Photo 3 — bottom-center, tilted -4°, on top */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30">
            <Polaroid src="/photos/photo3.jpg" alt="Photo 3" rotation={-4} delay={0.7} />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-1.5 text-muted-foreground/40">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}
