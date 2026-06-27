import BlurText from '@/components/BlurText';
import Magnet from '@/components/Magnet';
import { Separator } from '@/components/ui/separator';
import { motion, type Variants } from 'motion/react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
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

export default function AboutSection() {
  return (
    <section id="about" className="py-32 sm:py-40 bg-background">
      <div className="max-w-5xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* ── Text column ── */}
        <motion.div
          className="flex-1 text-center lg:text-left"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Section label */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-12 justify-center lg:justify-start">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">About</span>
            <Separator className="flex-1 max-w-[120px] lg:max-w-none" />
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants}>
            <BlurText
              text="Hi, I'm Peeranat (Few) 🚀"
              className="text-3xl sm:text-4xl md:text-5xl text-foreground font-light leading-tight"
              delay={80}
              animateBy="words"
              direction="top"
              stepDuration={0.35}
            />
          </motion.div>

          {/* Bio */}
          <motion.p
            variants={itemVariants}
            className="mt-8 text-lg sm:text-xl text-muted-foreground leading-relaxed"
          >
            Fourth-Year Information Technology Student with a Focus on Software Engineer
            at the School of Information Technology, KMITL.
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="mt-5 text-lg sm:text-xl text-muted-foreground leading-relaxed"
          >
            Passionate about building web applications, backend systems,
            and creating tools that solve real-world problems.
          </motion.p>

          {/* Status */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex items-center gap-3 justify-center lg:justify-start"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <span className="text-sm text-muted-foreground">Not available for work</span>
          </motion.div>
        </motion.div>

        {/* ── Photo card ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.3, type: 'spring', stiffness: 80 }}
          className="flex-shrink-0"
        >
          <Magnet padding={60} magnetStrength={5}>
            <div className="relative w-60 h-72 lg:w-64 lg:h-80 rounded-2xl overflow-hidden border border-border/30 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 cursor-pointer">
              <img
                src="/photos/photo1.jpg"
                alt="Peeranat Matsor"
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent px-4 py-3">
                <p className="text-white text-xs font-medium">FewPz ✦</p>
              </div>
            </div>
          </Magnet>
        </motion.div>

      </div>
    </section>
  );
}
