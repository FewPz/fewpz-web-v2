import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { IconType } from 'react-icons';
import {
  SiApachemaven, SiArgo, SiBun, SiC, SiDjango, SiDocker, SiEjs, SiElasticsearch, SiExpress, SiFigma, SiGit, SiGithubactions, SiGitlab, SiGo,
  SiGooglecloud, SiGradle, SiGrafana, SiHarbor, SiHono, SiHuawei, SiJavascript, SiJenkins, SiKubernetes, SiMinio, SiMongodb, SiMqtt, SiMysql,
  SiNextdotjs, SiNginx, SiNodedotjs, SiNuxt, SiOpenjdk, SiOpensearch, SiPhp, SiPostgresql, SiProxmox, SiPython, SiRabbitmq, SiRancher, SiReact, SiReactquery,
  SiRedis, SiSvelte, SiTailwindcss, SiTanstack, SiTypescript, SiVmware,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { VscVscode } from 'react-icons/vsc';
import { ChartLine, Database, KeyRound, Network, ScrollText, Server, Waypoints, type LucideIcon } from 'lucide-react';
import ColorDashes from '@/components/google/ColorDashes';
import GoogleCard from '@/components/google/GoogleCard';
import LogoMark from '@/components/google/LogoMark';
import SectionHeading from '@/components/google/SectionHeading';
import { colorAt } from '@/lib/google-colors';
import { useI18n, type Text } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface Skill {
  name: string;
  icon: IconType | LucideIcon;
  /** Brand color for the icon; falls back to grey */
  color?: string;
}

interface SkillGroup {
  title: Text;
  /** One or more rows of chips; a label splits a card into sub-groups */
  parts: { label?: Text; skills: Skill[] }[];
}

const groups: SkillGroup[] = [
  {
    title: { en: 'Languages', th: 'ภาษาโปรแกรม' },
    parts: [
      {
        skills: [
          { name: 'JavaScript', icon: SiJavascript, color: '#E0C200' },
          { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
          { name: 'Python', icon: SiPython, color: '#3776AB' },
          { name: 'Java', icon: SiOpenjdk, color: '#E76F00' },
          { name: 'Go', icon: SiGo, color: '#00ADD8' },
          { name: 'PHP', icon: SiPhp, color: '#777BB4' },
          { name: 'C', icon: SiC, color: '#5C6BC0' },
          { name: 'SQL', icon: Database },
        ],
      },
    ],
  },
  {
    title: 'Frontend',
    parts: [
      {
        skills: [
          { name: 'React', icon: SiReact, color: '#149ECA' },
          { name: 'Next.js', icon: SiNextdotjs, color: '#000000' },
          { name: 'TanStack Start', icon: SiTanstack, color: '#000000' },
          { name: 'TanStack Query', icon: SiReactquery, color: '#FF4154' },
          { name: 'SvelteKit', icon: SiSvelte, color: '#FF3E00' },
          { name: 'Nuxt', icon: SiNuxt, color: '#00DC82' },
          { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
          { name: 'EJS', icon: SiEjs, color: '#90A544' },
          { name: 'React Native', icon: SiReact, color: '#149ECA' },
        ],
      },
    ],
  },
  {
    title: { en: 'Backend & Server', th: 'Backend และเซิร์ฟเวอร์' },
    parts: [
      {
        skills: [
          { name: 'Node.js', icon: SiNodedotjs, color: '#5FA04E' },
          { name: 'Express.js', icon: SiExpress, color: '#000000' },
          { name: 'Elysia (Bun)', icon: SiBun, color: '#000000' },
          { name: 'Hono', icon: SiHono, color: '#E36002' },
          { name: 'Django', icon: SiDjango, color: '#092E20' },
          { name: 'Nginx', icon: SiNginx, color: '#009639' },
          { name: 'HAProxy', icon: Network },
          { name: 'LDAP', icon: KeyRound },
        ],
      },
    ],
  },
  {
    title: { en: 'Data & Messaging', th: 'ข้อมูลและ Messaging' },
    parts: [
      {
        label: { en: 'Database & Storage', th: 'ฐานข้อมูลและที่เก็บข้อมูล' },
        skills: [
          { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
          { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
          { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
          { name: 'Redis', icon: SiRedis, color: '#FF4438' },
          { name: 'Elasticsearch', icon: SiElasticsearch, color: '#005571' },
          { name: 'MinIO', icon: SiMinio, color: '#C72E49' },
        ],
      },
      {
        label: 'Messaging',
        skills: [
          { name: 'RabbitMQ', icon: SiRabbitmq, color: '#FF6600' },
          { name: 'MQTT', icon: SiMqtt, color: '#660066' },
          { name: 'Redis Pub/Sub', icon: SiRedis, color: '#FF4438' },
        ],
      },
    ],
  },
  {
    title: { en: 'DevOps & Infrastructure', th: 'DevOps และโครงสร้างพื้นฐาน' },
    parts: [
      {
        label: 'Containers & CI/CD',
        skills: [
          { name: 'Docker', icon: SiDocker, color: '#2496ED' },
          { name: 'Kubernetes', icon: SiKubernetes, color: '#326CE5' },
          { name: 'Rancher', icon: SiRancher, color: '#0075A8' },
          { name: 'ArgoCD', icon: SiArgo, color: '#EF7B4D' },
          { name: 'Harbor', icon: SiHarbor, color: '#4A9E32' },
          { name: 'Jenkins', icon: SiJenkins, color: '#D24939' },
          { name: 'GitHub Actions', icon: SiGithubactions, color: '#2088FF' },
          { name: 'GitLab Runner', icon: SiGitlab, color: '#FC6D26' },
        ],
      },
      {
        label: { en: 'Virtualization', th: 'Virtualization' },
        skills: [
          { name: 'VMware ESXi', icon: SiVmware, color: '#607078' },
          { name: 'Proxmox VE', icon: SiProxmox, color: '#E57000' },
          { name: 'XCP-ng', icon: Server },
        ],
      },
    ],
  },
  {
    title: 'Observability',
    parts: [
      {
        skills: [
          { name: 'Grafana', icon: SiGrafana, color: '#F46800' },
          { name: 'Loki', icon: ScrollText, color: '#F46800' },
          { name: 'Mimir', icon: ChartLine, color: '#F46800' },
          { name: 'Tempo', icon: Waypoints, color: '#F46800' },
          { name: 'OpenSearch', icon: SiOpensearch, color: '#005EB8' },
        ],
      },
    ],
  },
  {
    title: { en: 'Cloud & Tools', th: 'Cloud และเครื่องมือ' },
    parts: [
      {
        label: 'Cloud',
        skills: [
          { name: 'AWS', icon: FaAws, color: '#FF9900' },
          { name: 'Google Cloud', icon: SiGooglecloud, color: '#4285F4' },
          { name: 'Huawei Cloud', icon: SiHuawei, color: '#FF0000' },
        ],
      },
      {
        label: { en: 'Tools', th: 'เครื่องมือ' },
        skills: [
          { name: 'Git', icon: SiGit, color: '#F05032' },
          { name: 'VS Code', icon: VscVscode, color: '#007ACC' },
          { name: 'Maven', icon: SiApachemaven, color: '#C71A36' },
          { name: 'Gradle', icon: SiGradle, color: '#02303A' },
          { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
        ],
      },
    ],
  },
];

// Full class strings so Tailwind picks them up.
const chipHoverBorder = {
  blue: 'hover:border-g-blue/60',
  red: 'hover:border-g-red/60',
  yellow: 'hover:border-g-yellow/80',
  green: 'hover:border-g-green/60',
} as const;

const chipList: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.02, delayChildren: 0.1 } },
};

const chipItem: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 24 } },
};

function SkillBlock({ group, index }: { group: SkillGroup; index: number }) {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const accent = colorAt(index);
  const count = group.parts.reduce((n, part) => n + part.skills.length, 0);

  return (
    <div className="mb-7 break-inside-avoid">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={cn('size-2 shrink-0 rounded-full', accent.bg)} />
          <h3 className="text-sm font-semibold text-foreground">{t(group.title)}</h3>
        </div>
        <span className="text-[11px] text-muted-foreground">{count}</span>
      </div>

      <div className="space-y-2.5">
        {group.parts.map((part, p) => (
          <div key={p}>
            {part.label && (
              <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{t(part.label)}</p>
            )}
            <motion.ul
              className="flex flex-wrap gap-1.5"
              variants={chipList}
              initial={reduce ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              {part.skills.map(({ name, icon: Icon, color }) => (
                <motion.li
                  key={name}
                  variants={chipItem}
                  className={cn(
                    'inline-flex cursor-default items-center gap-1.5 rounded-full border border-border bg-white px-2.5 py-1 text-xs text-foreground transition-colors',
                    chipHoverBorder[accent.name],
                  )}
                >
                  <Icon className="size-3.5 shrink-0 text-muted-foreground" style={color ? { color } : undefined} aria-hidden />
                  {name}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const total = groups.reduce((n, g) => n + g.parts.reduce((m, part) => m + part.skills.length, 0), 0);

  return (
    <section id="skills" className="py-24 sm:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeading
          title={t({ en: 'Skills', th: 'ทักษะ' })}
          description={t({
            en: 'Technologies I use across the stack — from interfaces to infrastructure.',
            th: 'เทคโนโลยีที่ผมใช้ตลอดทั้ง stack ตั้งแต่หน้าบ้านไปจนถึงโครงสร้างพื้นฐาน',
          })}
        />

        {/* Everything in one compact card, so it fits a single screenshot */}
        <GoogleCard
          strip="none"
          className="p-6 sm:p-8"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-7 flex items-center justify-between gap-4 border-b border-border pb-5">
            <div className="flex items-center gap-3">
              <LogoMark />
              <div className="leading-tight">
                <p className="text-base font-bold text-g-navy">Tech Stack</p>
                <p className="text-xs text-muted-foreground">{t({ en: 'Peeranat Matsor', th: 'พีรณัฐ หมัดสอ' })} · FewPz</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <ColorDashes size="sm" />
              <span className="text-xs text-muted-foreground">{t({ en: `${total} skills`, th: `${total} ทักษะ` })}</span>
            </div>
          </div>

          <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
            {groups.map((group, i) => (
              <SkillBlock key={i} group={group} index={i} />
            ))}
          </div>
        </GoogleCard>
      </div>
    </section>
  );
}
