import Magnet from '@/components/Magnet';
import RotatingText from '@/components/RotatingText';
import { ArrowDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, type Variants } from 'motion/react';

// Polaroid component with motion
function Polaroid({ 
  src, 
  alt, 
  rotation, 
  delay,
  className 
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
      transition={{ duration: 0.8, delay: delay || 0, type: "spring", stiffness: 100 }}
    >
      <Magnet padding={80} magnetStrength={4}>
        <div 
          className={`bg-white p-3 pb-12 shadow-2xl transition-transform duration-500 hover:scale-110 cursor-pointer ${className}`}
        >
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 overflow-hidden bg-muted">
            <img
              src={src}
              alt={alt}
              className="object-cover absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </Magnet>
    </motion.div>
  );
}

export default function HeroSection() {
  const polaroids = [
    { src: '/photos/photo1.jpg', alt: 'Photo 1', rotation: -8, delay: 0.2 },
    { src: '/photos/photo2.jpg', alt: 'Photo 2', rotation: 5, delay: 0.4 },
    { src: '/photos/photo3.jpg', alt: 'Photo 3', rotation: -4, delay: 0.6 },
  ];

  // Container animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      {/* Floating Polaroids - Hidden on mobile, shown on larger screens */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        {/* Left Polaroid */}
        <div className="absolute top-1/3 left-8 lg:left-16 pointer-events-auto">
          <Polaroid 
            src={polaroids[0].src} 
            alt={polaroids[0].alt} 
            rotation={polaroids[0].rotation}
            delay={polaroids[0].delay}
          />
        </div>
        
        {/* Top Right Polaroid */}
        <div className="absolute top-16 right-8 lg:right-16 pointer-events-auto">
          <Polaroid 
            src={polaroids[1].src} 
            alt={polaroids[1].alt} 
            rotation={polaroids[1].rotation}
            delay={polaroids[1].delay}
          />
        </div>
        
        {/* Bottom Right Polaroid */}
        <div className="absolute bottom-24 right-12 lg:right-20 pointer-events-auto hidden lg:block">
          <Polaroid 
            src={polaroids[2].src} 
            alt={polaroids[2].alt} 
            rotation={polaroids[2].rotation}
            delay={polaroids[2].delay}
          />
        </div>
      </div>

      <motion.div 
        className="max-w-4xl mx-auto text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Name with Animation */}
        <motion.div className="relative inline-block" variants={itemVariants}>
          <motion.h1 
            className="text-3xl sm:text-5xl md:text-7xl font-bold text-foreground tracking-tight mb-2"
          >
            PEERANAT MATSOR
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4, type: "spring", stiffness: 200 }}
            className="absolute -top-3 -right-4 sm:-top-4 sm:-right-8 md:-top-6 md:-right-12 rotate-12 bg-orange-500 text-white text-[10px] sm:text-xs md:text-sm font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg flex items-center gap-1 z-20"
          >
            FewPz <span className="text-yellow-200">✦</span>
          </motion.div>
        </motion.div>
        
        {/* Subtitle */}
        <motion.div className="mt-6 mb-12" variants={itemVariants}>
          <RotatingText
            texts={[
              'Fourth-Year IT Student @ KMITL',
              'Software Engineer Focus 🚀',
              'Full-Stack Developer',
            ]}
            className="text-xl sm:text-2xl text-muted-foreground font-light"
            rotationInterval={3000}
            staggerDuration={0.03}
            staggerFrom="first"
          />
        </motion.div>

        {/* Resume Button */}
        <motion.div className="mb-8 sm:mb-12" variants={itemVariants}>
          <Button asChild variant="outline" size="default" className="rounded-full px-6 sm:px-8 text-sm sm:text-base border-foreground/20 hover:bg-foreground/5">
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Download </span>Resume
            </a>
          </Button>
        </motion.div>
        
        {/* Navigation Links with Magnet Effect */}
        <motion.nav 
          className="flex items-center justify-center gap-6 sm:gap-8 md:gap-12"
          variants={itemVariants}
        >
          <Magnet padding={30} magnetStrength={3}>
            <a
              href="#work" 
              className="text-base sm:text-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              Work
            </a>
          </Magnet>
          
          <Magnet padding={30} magnetStrength={3}>
            <a
              href="#about" 
              className="text-base sm:text-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </a>
          </Magnet>
          
          <Magnet padding={30} magnetStrength={3}>
            <a
              href="#contact" 
              className="text-base sm:text-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </Magnet>
        </motion.nav>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Magnet padding={30} magnetStrength={2}>
          <div className="flex flex-col items-center gap-1 sm:gap-2 text-muted-foreground">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest">Scroll</span>
            <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 animate-bounce" />
          </div>
        </Magnet>
      </motion.div>
    </section>
  );
}
