import { useState } from 'react';
import GoogleCard from '@/components/google/GoogleCard';
import GoogleDots from '@/components/google/GoogleDots';
import SectionHeading from '@/components/google/SectionHeading';
import OpenSourceProjects from '@/components/sections/OpenSourceProjects';
import { colorAt } from '@/lib/google-colors';
import { useI18n, type Localized, type Text } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, type Variants, AnimatePresence } from 'motion/react';
import TiltedCard from '@/components/TiltedCard';
import { Briefcase, ChevronDown, ChevronUp, FolderGit2, Github, Sparkles, Trophy } from 'lucide-react';

interface EducationItem {
  logo: string;
  institution: Text;
  degree: Text;
  period: Text;
  description: Text;
  status: 'current' | 'completed';
}

interface ExperienceItem {
  year: Text;
  title: Text;
  description: Text;
  tags?: string[];
  type: 'work' | 'project' | 'award' | 'activity';
  /** Grouped lists shown as chips, e.g. courses per class year */
  groups?: { label: Text; items: string[] }[];
  /** Extra bullet points under the groups */
  bullets?: Text[];
}

const KMITL: Localized = {
  en: "King Mongkut's Institute of Technology Ladkrabang",
  th: 'สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง',
};

const educationData: EducationItem[] = [
  {
    logo: '/logos/kmitl.png',
    institution: KMITL,
    degree: {
      en: 'M.Sc. Information Technology (Software Engineering)',
      th: 'วิทยาศาสตรมหาบัณฑิต สาขาเทคโนโลยีสารสนเทศ (Software Engineering)',
    },
    period: { en: '2025 - Present', th: '2025 - ปัจจุบัน' },
    description: {
      en: "Full-time Master's student in the Honors Program, conducting research at the School of Information Technology.",
      th: 'นักศึกษาปริญญาโทเต็มเวลาในโครงการ Honors Program ทำวิจัยที่คณะเทคโนโลยีสารสนเทศ',
    },
    status: 'current',
  },
  {
    logo: '/logos/kmitl.png',
    institution: KMITL,
    degree: {
      en: 'B.Sc. Information Technology (Software Engineering)',
      th: 'วิทยาศาสตรบัณฑิต สาขาเทคโนโลยีสารสนเทศ (Software Engineering)',
    },
    period: '2022 - 2026',
    description: {
      en: 'Graduated from the Information Technology program at the School of Information Technology.',
      th: 'สำเร็จการศึกษาหลักสูตรเทคโนโลยีสารสนเทศ คณะเทคโนโลยีสารสนเทศ',
    },
    status: 'completed',
  },
  {
    logo: '/logos/mvsk.jpg',
    institution: { en: 'Mahavajiravudh Changwat Songkhla School', th: 'โรงเรียนมหาวชิราวุธ จังหวัดสงขลา' },
    degree: {
      en: 'High School (Language Arts Korean-Japanese Program)',
      th: 'มัธยมศึกษาตอนปลาย (แผนการเรียนศิลป์ภาษา เกาหลี-ญี่ปุ่น)',
    },
    period: '2019 - 2022',
    description: {
      en: 'Graduated with academic honors, awarded a merit certificate, and supported through advanced studies in information technology.',
      th: 'สำเร็จการศึกษาพร้อมเกียรติบัตรผลการเรียนดี และได้รับการสนับสนุนให้ศึกษาต่อด้านเทคโนโลยีสารสนเทศ',
    },
    status: 'completed',
  },
];

const experienceData: ExperienceItem[] = [
  // Work
  {
    year: { en: 'Jul 2026 - Present', th: 'ก.ค. 2026 - ปัจจุบัน' },
    title: {
      en: 'Software Engineer - School of Information Technology, KMITL',
      th: 'Software Engineer - คณะเทคโนโลยีสารสนเทศ สจล.',
    },
    description: {
      en: 'Software engineer at ITKMITL, building web applications, backend systems, cloud infrastructure and educational technology, including online judge platforms.',
      th: 'Software Engineer ที่คณะไอที สจล. พัฒนาเว็บแอปพลิเคชัน ระบบหลังบ้าน โครงสร้างพื้นฐานคลาวด์ และเทคโนโลยีเพื่อการศึกษา รวมถึงแพลตฟอร์ม Online Judge',
    },
    tags: ['Web Apps', 'Backend', 'Cloud', 'EdTech'],
    type: 'work',
  },
  {
    year: { en: 'Sep 2023 - Jul 2026', th: 'ก.ย. 2023 - ก.ค. 2026' },
    title: {
      en: 'Teaching Assistant - School of Information Technology, KMITL',
      th: 'ผู้ช่วยสอน (Teaching Assistant) - คณะเทคโนโลยีสารสนเทศ สจล.',
    },
    description: {
      en: 'Provided lab support across programming, web, cloud and DevOps courses, assisting over 350 students with coursework.',
      th: 'ช่วยสอนภาคปฏิบัติในวิชาด้านการเขียนโปรแกรม เว็บ คลาวด์ และ DevOps ดูแลนักศึกษากว่า 350 คน',
    },
    groups: [
      {
        label: { en: 'Class Year 2023', th: 'ปีการศึกษา 2023' },
        items: ['Problem Solving and Computer Programming', 'Object-Oriented Programming', 'Data Structure and Algorithms'],
      },
      {
        label: { en: 'Class Year 2024', th: 'ปีการศึกษา 2024' },
        items: ['Object-Oriented Programming', 'Data Structure and Algorithms', 'Physical Computing', 'Fundamental Web Programming'],
      },
      {
        label: { en: 'Class Year 2025', th: 'ปีการศึกษา 2025' },
        items: [
          'Cloud Computing',
          'Software Development Tools and Environment',
          'Object-Oriented Programming',
          'Data Structure and Algorithms',
        ],
      },
    ],
    bullets: [
      {
        en: 'Assisted in Kubernetes lab sessions covering theory and practice, including Nginx Ingress and Horizontal Pod Autoscaling (HPA).',
        th: 'ช่วยสอนแล็บ Kubernetes ทั้งทฤษฎีและปฏิบัติ รวมถึง Nginx Ingress และ Horizontal Pod Autoscaling (HPA)',
      },
      {
        en: 'Assisted in lab sessions on the Systematic Approach to Performance Evaluation, benchmarking with Apache and Nginx.',
        th: 'ช่วยสอนแล็บ Systematic Approach to Performance Evaluation โดยใช้ Apache และ Nginx ทำ benchmark',
      },
    ],
    tags: ['Teaching', 'Kubernetes', 'Nginx', 'Apache'],
    type: 'work',
  },

  // Projects
  {
    year: '2025',
    title: { en: '<u>Judge - Online Testing & Assessment Platform', th: '<u>Judge - แพลตฟอร์มสอบและประเมินผลออนไลน์' },
    description: {
      en: 'Developed a faculty-funded quiz and assessment platform. Used by 100+ students and lecturers for online examinations and quizzes.',
      th: 'พัฒนาแพลตฟอร์มแบบทดสอบและประเมินผลที่ได้รับทุนจากคณะ ใช้งานโดยนักศึกษาและอาจารย์กว่า 100 คนสำหรับการสอบและแบบทดสอบออนไลน์',
    },
    tags: ['Next.js', 'Elysia', 'Docker', 'MongoDB', 'Minio'],
    type: 'project',
  },
  {
    year: '2025',
    title: {
      en: "<g>Learn - Online Code Judging System for ToBeIT'68",
      th: "<g>Learn - ระบบตรวจโค้ดออนไลน์สำหรับ ToBeIT'68",
    },
    description: {
      en: "Built the online code judging system used in the ToBeIT'68 camp at ITKMITL.",
      th: "พัฒนาระบบตรวจโค้ดออนไลน์ที่ใช้ในค่าย ToBeIT'68 ของคณะไอที สจล.",
    },
    type: 'project',
  },
  {
    year: '2024',
    title: { en: 'Captive Portal - ITKMITL Authentication', th: 'Captive Portal - ระบบยืนยันตัวตน ITKMITL' },
    description: {
      en: 'Developed a faculty-funded captive portal for ITKMITL Authentication Internet Services using LDAP. Actively used by students, lecturers, and staff.',
      th: 'พัฒนา Captive Portal สำหรับบริการอินเทอร์เน็ตของคณะไอที สจล. ด้วย LDAP ได้รับทุนจากคณะ ใช้งานจริงโดยนักศึกษา อาจารย์ และบุคลากร',
    },
    tags: ['SvelteKit', 'LDAP', 'Fortigate'],
    type: 'project',
  },
  {
    year: '2024',
    title: { en: '<i>Judge - Online Code Judging System', th: '<i>Judge - ระบบตรวจโค้ดออนไลน์' },
    description: {
      en: 'Built faculty-funded online judge system for competitive programming, supporting Python, C, C++, Scala, and Raptor. Used by 350+ students.',
      th: 'พัฒนาระบบ Online Judge สำหรับการเขียนโปรแกรมเชิงแข่งขัน ได้รับทุนจากคณะ รองรับ Python, C, C++, Scala และ Raptor ใช้งานโดยนักศึกษากว่า 350 คน',
    },
    tags: ['Next.js', 'Express', 'Docker', 'MySQL'],
    type: 'project',
  },
  {
    year: '2024',
    title: { en: 'J:Learn - Structure Validation System', th: 'J:Learn - ระบบตรวจสอบโครงสร้างโค้ด' },
    description: {
      en: 'Designed and developed faculty-funded online validation structure system for Java. Used by 210+ students at ITKMITL.',
      th: 'ออกแบบและพัฒนาระบบตรวจสอบโครงสร้างโค้ด Java ออนไลน์ ได้รับทุนจากคณะ ใช้งานโดยนักศึกษาคณะไอทีกว่า 210 คน',
    },
    tags: ['Next.js', 'Express', 'Figma'],
    type: 'project',
  },

  // Awards & activities
  {
    year: '2026',
    title: {
      en: 'Huawei ICT Competition 2025-2026 Global Final - First Prize, Computing Track',
      th: 'Huawei ICT Competition 2025-2026 Global Final - First Prize สาย Computing',
    },
    description: {
      en: 'Won First Prize in the Computing Track with team "SIGKILL" at the Global Final at Huawei HQ in Shenzhen, China, competing against 177 teams from 49 countries and regions.',
      th: 'คว้า First Prize สาย Computing กับทีม "SIGKILL" ในรอบ Global Final ที่สำนักงานใหญ่ Huawei เมืองเซินเจิ้น ประเทศจีน แข่งกับ 177 ทีมจาก 49 ประเทศและภูมิภาค',
    },
    tags: ['Huawei', 'Global Final', 'Computing'],
    type: 'award',
  },
  {
    year: '2026',
    title: {
      en: 'Huawei ICT Competition 2025-2026 APAC Final - First Prize, Computing Track',
      th: 'Huawei ICT Competition 2025-2026 APAC Final - First Prize สาย Computing',
    },
    description: {
      en: 'Placed First Prize among students from more than 13 countries at the Asia-Pacific Regional Final at the ASEAN Secretariat in Jakarta, Indonesia, earning a place in the Global Final.',
      th: 'คว้า First Prize ท่ามกลางนักศึกษาจากกว่า 13 ประเทศ ในรอบ Asia-Pacific Regional Final ที่สำนักเลขาธิการอาเซียน กรุงจาการ์ตา ประเทศอินโดนีเซีย และได้สิทธิ์ไปแข่งรอบ Global Final',
    },
    tags: ['Huawei', 'APAC', 'Computing'],
    type: 'award',
  },
  {
    year: '2025',
    title: {
      en: 'Huawei ICT Competition 2025-2026 Thailand - Grand Prize, Computing Track',
      th: 'Huawei ICT Competition 2025-2026 ประเทศไทย - Grand Prize สาย Computing',
    },
    description: {
      en: 'Won Grand Prize in the Computing Track at the Thailand national round with team "SIGKILL", qualifying to represent Thailand in the APAC regional round.',
      th: 'คว้า Grand Prize สาย Computing ในการแข่งขันระดับประเทศกับทีม "SIGKILL" และได้เป็นตัวแทนประเทศไทยไปแข่งระดับ APAC',
    },
    tags: ['Huawei', 'National', 'Computing'],
    type: 'award',
  },
  {
    year: '2025',
    title: { en: 'IT OpenHouse 2025 - Workshop Lead', th: 'IT OpenHouse 2025 - หัวหน้า Workshop' },
    description: {
      en: 'Led the Software Engineering workshop "Web Speedrun", teaching visitors to build and deploy a website fast, and showcased iJudge to visitors.',
      th: 'นำ Workshop สาย Software Engineering "Web Speedrun" สอนน้อง ๆ สร้างและ deploy เว็บให้เสร็จเร็วที่สุด พร้อมโชว์ระบบ iJudge ให้ผู้เข้าชมงาน',
    },
    tags: ['Workshop', 'Web'],
    type: 'activity',
  },
  {
    year: '2025',
    title: { en: 'ICTIEE 2025 - Conference Staff', th: 'ICTIEE 2025 - ทีมงานจัดประชุมวิชาการ' },
    description: {
      en: 'Staff at the 17th International Conference on Information Technology and Electrical Engineering, hosted by ITKMITL.',
      th: 'ทีมงานในงานประชุมวิชาการนานาชาติ ICTIEE ครั้งที่ 17 (International Conference on Information Technology and Electrical Engineering) ที่คณะไอที สจล. เป็นเจ้าภาพ',
    },
    tags: ['Conference', 'Volunteer'],
    type: 'activity',
  },
  {
    year: '2025',
    title: { en: 'ITCLASH - Organizer', th: 'ITCLASH - ผู้จัดงาน' },
    description: {
      en: 'Created and organized ITCLASH, an event combining several competitions for high-school students, with applicants from about 75 provinces.',
      th: 'ริเริ่มและจัดงาน ITCLASH กิจกรรมที่รวมการแข่งขันหลายรายการสำหรับนักเรียนมัธยม มีผู้สมัครจากประมาณ 75 จังหวัด',
    },
    tags: ['Organizer', 'Competition'],
    type: 'activity',
  },
  {
    year: '2024',
    title: {
      en: 'Huawei ICT Competition 2023-2024 - National 1st Runner-up',
      th: 'Huawei ICT Competition 2023-2024 - รองชนะเลิศอันดับ 1 ระดับประเทศ',
    },
    description: {
      en: 'Placed 1st runner-up in Thailand in the Computing Track.',
      th: 'คว้ารองชนะเลิศอันดับ 1 ของประเทศไทย สาย Computing',
    },
    tags: ['Huawei', 'Computing Track'],
    type: 'award',
  },
  {
    year: '2022-2024',
    title: {
      en: "ITKMITL Camp Staff - ToBeIT'67, ITCAMP19 & ITCAMP20",
      th: "ทีมงานค่าย ITKMITL - ToBeIT'67, ITCAMP19 และ ITCAMP20",
    },
    description: {
      en: "Staff for ITKMITL outreach camps that introduce high-school students to IT through hackathons and workshops: ToBeIT'67 and ToBeIT'67 The Second (2022), ITCAMP19 (2023) and ITCAMP20.",
      th: "ทีมงานค่ายของคณะไอที สจล. ที่แนะนำน้อง ๆ มัธยมให้รู้จักสายไอทีผ่าน Hackathon และ Workshop ได้แก่ ToBeIT'67 และ ToBeIT'67 The Second (2022), ITCAMP19 (2023) และ ITCAMP20",
    },
    tags: ['Camp', 'Mentoring'],
    type: 'activity',
  },
];

const typeLabels: Record<ExperienceItem['type'], Localized> = {
  work: { en: 'Work', th: 'งาน' },
  project: { en: 'Project', th: 'โปรเจกต์' },
  award: { en: 'Award', th: 'รางวัล' },
  activity: { en: 'Activity', th: 'กิจกรรม' },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

function EducationCard({ item }: { item: EducationItem }) {
  const { t } = useI18n();
  return (
    <motion.div variants={itemVariants}>
      <GoogleCard
        strip="hover"
        className="flex gap-6 p-6 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_1px_3px_rgba(60,64,67,0.2),0_6px_16px_rgba(60,64,67,0.12)]"
      >
        <div className="shrink-0">
          <TiltedCard
            imageSrc={item.logo}
            altText={t(item.institution)}
            containerHeight="80px"
            containerWidth="80px"
            imageHeight="80px"
            imageWidth="80px"
            scaleOnHover={1.05}
            rotateAmplitude={8}
            showMobileWarning={false}
            showTooltip={false}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="text-lg font-semibold text-foreground leading-tight">{t(item.institution)}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t(item.degree)}</p>
            </div>
            {item.status === 'current' && (
              <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-g-green-soft text-g-green-ink text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-g-green opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-g-green" />
                </span>
                {t({ en: 'Current', th: 'กำลังศึกษา' })}
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-muted-foreground mb-2">{t(item.period)}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{t(item.description)}</p>
        </div>
      </GoogleCard>
    </motion.div>
  );
}

function ExperienceCard({ item, index, isLast }: { item: ExperienceItem; index: number; isLast: boolean }) {
  const { t } = useI18n();
  const accent = colorAt(index);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      viewport={{ once: true, margin: '-60px' }}
      className="relative pl-10 pb-12 last:pb-0"
    >
      {/* Thick rounded segment running down to the next node */}
      {!isLast && (
        <motion.span
          aria-hidden
          className={cn('absolute left-[5px] top-[14px] -bottom-[14px] w-1.5 origin-top rounded-full', accent.bg)}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
      {/* Node */}
      <motion.span
        aria-hidden
        className={cn('absolute left-0 top-1.5 size-4 rounded-full', accent.bg)}
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.15 }}
      />
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground">{t(item.year)}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            <span className={cn('size-1.5 rounded-full', accent.bg)} />
            {t(typeLabels[item.type])}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-foreground">{t(item.title)}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{t(item.description)}</p>
        {item.groups && (
          <div className="space-y-3 pt-2">
            {item.groups.map((group, g) => (
              <div key={g}>
                <p className="mb-1.5 text-xs font-medium text-foreground">{t(group.label)}</p>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((entry) => (
                    <span
                      key={entry}
                      className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      <span className={cn('size-1.5 rounded-full', accent.bg)} />
                      {entry}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {item.bullets && (
          <ul className="space-y-1.5 pt-2">
            {item.bullets.map((bullet, b) => (
              <li key={b} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <span className={cn('mt-2 size-1.5 shrink-0 rounded-full', accent.bg)} />
                {t(bullet)}
              </li>
            ))}
          </ul>
        )}
        {item.tags && (
          <div className="flex flex-wrap gap-2 pt-2">
            {item.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 border border-border bg-white text-muted-foreground rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

type ExperienceTab = 'projects' | 'opensource' | 'work' | 'activities';

const experienceTabs: {
  id: ExperienceTab;
  label: Localized;
  icon: typeof Briefcase;
  soft: string;
  ink: string;
  soon?: boolean;
}[] = [
  { id: 'projects', label: { en: 'Projects', th: 'โปรเจกต์' }, icon: FolderGit2, soft: 'bg-g-blue-soft', ink: 'text-g-blue-ink' },
  { id: 'opensource', label: { en: 'Open Source', th: 'โอเพนซอร์ส' }, icon: Github, soft: 'bg-g-red-soft', ink: 'text-g-red-ink' },
  { id: 'work', label: { en: 'Work', th: 'การทำงาน' }, icon: Briefcase, soft: 'bg-g-green-soft', ink: 'text-g-green-ink' },
  {
    id: 'activities',
    label: { en: 'Awards & Activities', th: 'รางวัลและกิจกรรม' },
    icon: Trophy,
    soft: 'bg-g-yellow-soft',
    ink: 'text-g-yellow-ink',
  },
];

const tabSpring = { type: 'spring', stiffness: 420, damping: 32 } as const;

const projectItems = experienceData.filter((item) => item.type === 'project');
const workItems = experienceData.filter((item) => item.type === 'work');
const activityItems = experienceData.filter((item) => item.type === 'award' || item.type === 'activity');

function ExperienceTimeline({ items }: { items: ExperienceItem[] }) {
  return (
    <div className="relative">
      {items.map((item, index) => (
        <ExperienceCard key={index} item={item} index={index} isLast={index === items.length - 1} />
      ))}
    </div>
  );
}

function WorkComingSoon() {
  const { t } = useI18n();
  return (
    <GoogleCard strip="static" className="px-8 py-14 text-center sm:p-16">
      <motion.div
        className="mb-6 inline-flex size-16 items-center justify-center rounded-full bg-g-green-soft"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Briefcase className="size-8 text-g-green-ink" />
      </motion.div>
      <h3 className="mb-3 flex items-center justify-center gap-2 text-2xl font-bold tracking-tight text-foreground">
        {t({ en: 'Coming Soon', th: 'เร็ว ๆ นี้' })}
        <Sparkles className="size-5 text-g-yellow" />
      </h3>
      <p className="mx-auto max-w-md leading-relaxed text-muted-foreground">
        {t({ en: 'Work experience will be added here soon.', th: 'ประสบการณ์การทำงานจะถูกเพิ่มที่นี่เร็ว ๆ นี้' })}
      </p>
      <div className="mt-8 flex justify-center">
        <GoogleDots />
      </div>
    </GoogleCard>
  );
}

export default function TimelineSection() {
  const { t } = useI18n();
  const [experienceTab, setExperienceTab] = useState<ExperienceTab>('projects');
  const [showAllEducation, setShowAllEducation] = useState(false);
  const visibleEducation = showAllEducation ? educationData : educationData.slice(0, 2);
  const hiddenCount = educationData.length - 2;

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-5xl mx-auto px-6">
        {/* Education */}
        <div className="mb-28">
          <SectionHeading title={t({ en: 'Education', th: 'การศึกษา' })} />

          <AnimatePresence mode="wait">
            <motion.div
              className="space-y-5"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              key={showAllEducation ? 'all' : 'partial'}
            >
              {visibleEducation.map((item, i) => (
                <EducationCard key={i} item={item} />
              ))}
            </motion.div>
          </AnimatePresence>

          {educationData.length > 2 && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => setShowAllEducation(!showAllEducation)}
                className="h-10 rounded-full border-border bg-white px-5 font-medium text-foreground hover:border-g-blue/50 hover:bg-g-blue-soft/50 hover:text-foreground"
              >
                {showAllEducation ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1 text-muted-foreground" />
                    {t({ en: 'Show Less', th: 'แสดงน้อยลง' })}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1 text-muted-foreground" />
                    {t({ en: `Show ${hiddenCount} More`, th: `แสดงเพิ่มอีก ${hiddenCount} รายการ` })}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Experience (id="work" is the navbar's Work anchor) */}
        <div id="work" className="scroll-mt-24">
          <SectionHeading title={t({ en: 'Experience', th: 'ประสบการณ์' })} />

          {/* Tabs */}
          <div
            role="tablist"
            aria-label={t({ en: 'Experience', th: 'ประสบการณ์' })}
            className="mb-10 inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-border bg-white p-1 scrollbar-hide"
          >
            {experienceTabs.map(({ id, label, icon: Icon, soft, ink, soon }) => {
              const selected = experienceTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setExperienceTab(id)}
                  className={cn(
                    'relative flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors sm:px-5',
                    selected ? ink : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {selected && (
                    <motion.span layoutId="experience-tab" className={cn('absolute inset-0 rounded-full', soft)} transition={tabSpring} />
                  )}
                  <Icon className="relative size-4" />
                  <span className="relative">{t(label)}</span>
                  {soon && (
                    <span className="relative rounded-full bg-g-yellow-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-g-yellow-ink">
                      {t({ en: 'Soon', th: 'เร็ว ๆ นี้' })}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={experienceTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {experienceTab === 'opensource' ? (
                <OpenSourceProjects />
              ) : experienceTab === 'work' ? (
                workItems.length > 0 ? <ExperienceTimeline items={workItems} /> : <WorkComingSoon />
              ) : experienceTab === 'activities' ? (
                <ExperienceTimeline items={activityItems} />
              ) : (
                <ExperienceTimeline items={projectItems} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
