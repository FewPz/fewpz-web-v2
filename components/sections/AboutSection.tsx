import BlurText from '@/components/BlurText';
import Magnet from '@/components/Magnet';
import ColorDashes from '@/components/google/ColorDashes';
import GoogleCard from '@/components/google/GoogleCard';
import SectionHeading from '@/components/google/SectionHeading';
import { motion, type Variants } from 'motion/react';
import { useI18n } from '@/lib/i18n';

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
  const { t } = useI18n();
  const lead = t({ en: "Hi, I'm Peeranat (Few) 🚀", th: 'สวัสดีครับ ผมพีรณัฐ (ฟิวส์) 🚀' });

  return (
    <section id="about" className="py-28 sm:py-36">
      <div className="max-w-5xl mx-auto px-6 grid items-center gap-14 lg:grid-cols-[1fr_auto] lg:gap-20">

        {/* ── Text column ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <SectionHeading title={t({ en: 'About me', th: 'เกี่ยวกับผม' })} className="mb-8 sm:mb-10" />

          {/* Lead */}
          <motion.div variants={itemVariants}>
            <BlurText
              key={lead}
              text={lead}
              className="text-2xl sm:text-3xl text-foreground font-medium leading-snug"
              delay={80}
              animateBy="words"
              direction="top"
              stepDuration={0.35}
            />
          </motion.div>

          {/* Bio */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg leading-relaxed text-muted-foreground"
          >
            {t({
              en: 'Fourth-Year Information Technology Student with a Focus on Software Engineer at the School of Information Technology, KMITL.',
              th: 'นักศึกษาเทคโนโลยีสารสนเทศชั้นปีที่ 4 สาย Software Engineering คณะเทคโนโลยีสารสนเทศ สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง',
            })}
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="mt-4 text-lg leading-relaxed text-muted-foreground"
          >
            {t({
              en: 'Passionate about building web applications, backend systems, and creating tools that solve real-world problems.',
              th: 'ชอบสร้างเว็บแอปพลิเคชัน ระบบหลังบ้าน และเครื่องมือที่ช่วยแก้ปัญหาได้จริง',
            })}
          </motion.p>

          {/* Status */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex items-center gap-3 text-sm text-muted-foreground"
          >
            <span className="relative flex size-2.5">
              <span className="animate-ping absolute inline-flex size-full rounded-full bg-g-red opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-g-red" />
            </span>
            {t({ en: 'Not available for work', th: 'ยังไม่รับงานในตอนนี้' })}
          </motion.div>
        </motion.div>

        {/* ── Photo card ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.3, type: 'spring', stiffness: 80 }}
          className="justify-self-center"
        >
          <Magnet padding={60} magnetStrength={5}>
            <GoogleCard className="w-60 lg:w-64 rotate-2 hover:rotate-0 transition-[rotate] duration-500 cursor-pointer p-3 pt-4">
              <div className="aspect-[4/5] overflow-hidden rounded-lg bg-muted">
                <img
                  src="/photos/photo1.jpg"
                  alt="Peeranat Matsor"
                  className="size-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between px-1 pt-3">
                <span className="text-sm font-semibold text-foreground">FewPz ✦</span>
                <ColorDashes size="sm" />
              </div>
            </GoogleCard>
          </Magnet>
        </motion.div>

      </div>
    </section>
  );
}
