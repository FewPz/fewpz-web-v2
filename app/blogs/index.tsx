import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, Calendar, Clock, PenLine, Sparkles } from 'lucide-react'
import CircuitRails from '@/components/google/CircuitRails'
import ColorDashes from '@/components/google/ColorDashes'
import FlagIcon from '@/components/google/FlagIcon'
import GoogleCard from '@/components/google/GoogleCard'
import GoogleDots from '@/components/google/GoogleDots'
import SectionHeading from '@/components/google/SectionHeading'
import { colorAt } from '@/lib/google-colors'
import { useI18n, type Locale, type Text } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/blogs/')({
  component: BlogsPage,
})

interface BlogPost {
  to: '/blogs/itkmitl-review-2026' | '/blogs/review-year-2025'
  /** Kept in the language the post is written in */
  title: string
  description: Text
  /** Language the post itself is written in */
  lang: Locale
  /** ISO date; omitted while the post is still being written */
  date?: string
  readMinutes?: number
  tags: string[]
  featured?: boolean
  coverImage?: string
  /** Left out of the listing; the route still exists */
  hidden?: boolean
}

const blogPosts: BlogPost[] = [
  {
    to: '/blogs/itkmitl-review-2026',
    title: 'มุมมองเด็กคนนึงจากคณะไอที [2026 ver.]',
    description: {
      th: 'ไม่ได้เก่งที่สุด แต่เป็นความพยายามเติบโตขึ้นในทุกวัน เรื่องเล่าธรรมดาๆ จากสายตาของเด็กไอทีคนนึง ที่อยากบันทึกการเดินทางและหยดน้ำตาหลังบรรทัดโค้ดเอาไว้',
      en: 'Not the best, just trying to grow a little every day. Ordinary stories through the eyes of an IT student, recording the journey and the tears behind every line of code.',
    },
    lang: 'th',
    tags: ['ITKMITL', 'Student Life', 'Reflection'],
    featured: true,
    hidden: true,
    coverImage: '/blogs/itkmitl-review-2026/481176889_2070560703458848_6804156811441814737_n.jpg',
  },
  {
    to: '/blogs/review-year-2025',
    title: 'Review Year 2025',
    description: {
      en: "A year of growth, learning, and countless lines of code. Here's my journey through 2025.",
      th: 'หนึ่งปีแห่งการเติบโต การเรียนรู้ และโค้ดอีกนับไม่ถ้วน นี่คือการเดินทางของผมตลอดปี 2025',
    },
    lang: 'th',
    date: '2025-12-28',
    readMinutes: 5,
    tags: ['Personal', 'Reflection'],
    coverImage: '/blogs/review-year-2025/586246020_2301665567015026_4460457620215506663_n.jpg',
  },
]

const cardHover =
  'transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_1px_3px_rgba(60,64,67,0.2),0_6px_16px_rgba(60,64,67,0.12)]'

function PostMeta({ post }: { post: BlogPost }) {
  const { locale, t } = useI18n()
  const date = post.date
    ? new Intl.DateTimeFormat(locale === 'th' ? 'th-TH-u-ca-gregory' : 'en-US', { dateStyle: 'long' }).format(
        new Date(post.date),
      )
    : null

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
      {date ? (
        <span className="flex items-center gap-1.5">
          <Calendar className="size-3.5" />
          {date}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-g-yellow-soft px-2.5 py-0.5 font-medium text-g-yellow-ink">
          <PenLine className="size-3" />
          {t({ en: 'In progress', th: 'กำลังเขียน' })}
        </span>
      )}
      {post.readMinutes && (
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" />
          {t({ en: `${post.readMinutes} min read`, th: `อ่าน ${post.readMinutes} นาที` })}
        </span>
      )}
      <span className="flex items-center gap-1.5" title={post.lang === 'th' ? 'ภาษาไทย' : 'English'}>
        <FlagIcon locale={post.lang} className="h-3 w-4" />
        {post.lang === 'th' ? 'ไทย' : 'EN'}
      </span>
    </div>
  )
}

function PostTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag, i) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
        >
          <span className={cn('size-1.5 rounded-full', colorAt(i).bg)} />
          {tag}
        </span>
      ))}
    </div>
  )
}

function FeaturedPost({ post }: { post: BlogPost }) {
  const { t } = useI18n()
  return (
    <Link to={post.to} className="group block">
      <GoogleCard strip="static" className={cardHover}>
        {post.coverImage && (
          <div className="aspect-[16/7] overflow-hidden bg-muted">
            <img
              src={post.coverImage}
              alt=""
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}
        <div className="space-y-4 p-6 sm:p-8">
          <PostMeta post={post} />
          <h2 className="text-2xl font-bold leading-snug tracking-tight text-g-navy sm:text-3xl">{post.title}</h2>
          <p className="line-clamp-3 leading-relaxed text-muted-foreground">{t(post.description)}</p>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
            <PostTags tags={post.tags} />
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-g-blue-ink">
              {t({ en: 'Read story', th: 'อ่านต่อ' })}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </GoogleCard>
    </Link>
  )
}

function PostCard({ post }: { post: BlogPost }) {
  const { t } = useI18n()
  return (
    <Link to={post.to} className="group block h-full">
      <GoogleCard strip="hover" className={cn('flex h-full flex-col', cardHover)}>
        {post.coverImage && (
          <div className="aspect-video overflow-hidden bg-muted">
            <img
              src={post.coverImage}
              alt=""
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-3 p-6">
          <PostMeta post={post} />
          <h3 className="text-lg font-semibold leading-snug text-foreground">{post.title}</h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{t(post.description)}</p>
          <div className="mt-auto pt-2">
            <PostTags tags={post.tags} />
          </div>
        </div>
      </GoogleCard>
    </Link>
  )
}

function EmptyState() {
  const { t } = useI18n()
  return (
    <GoogleCard strip="static" className="px-8 py-14 text-center sm:p-16">
      <div className="relative mb-6 inline-flex size-16 items-center justify-center rounded-full bg-g-yellow-soft">
        <PenLine className="size-7 text-g-yellow-ink" />
        <Sparkles className="absolute -right-1 -top-1 size-5 text-g-yellow" />
      </div>
      <h3 className="mb-3 text-2xl font-bold tracking-tight text-foreground">
        {t({ en: 'Stories are brewing', th: 'เรื่องใหม่กำลังมา' })}
      </h3>
      <p className="mx-auto max-w-sm leading-relaxed text-muted-foreground">
        {t({
          en: "I'm currently writing and preparing new content. Check back soon for more thoughts and updates!",
          th: 'กำลังเขียนและเตรียมเนื้อหาใหม่อยู่ แวะกลับมาอ่านเร็ว ๆ นี้นะครับ',
        })}
      </p>
      <div className="mt-8 flex justify-center">
        <GoogleDots />
      </div>
    </GoogleCard>
  )
}

function Reveal({ index, children }: { index: number; children: React.ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="h-full"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function BlogsPage() {
  const { t } = useI18n()
  const visiblePosts = blogPosts.filter((post) => !post.hidden)
  const featuredPosts = visiblePosts.filter((post) => post.featured)
  const otherPosts = visiblePosts.filter((post) => !post.featured)

  return (
    <main className="relative min-h-screen">
      <CircuitRails />
      <div className="relative mx-auto max-w-4xl px-6 pb-32 pt-28 sm:pt-32">
        <Link
          to="/"
          className="mb-12 inline-flex h-9 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-g-blue/50 hover:bg-g-blue-soft/50 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {t({ en: 'Home', th: 'หน้าแรก' })}
        </Link>

        <SectionHeading
          title={t({ en: 'Blog', th: 'บล็อก' })}
          description={t({
            en: 'Thoughts, stories, and ideas about tech, life, and everything in between.',
            th: 'ความคิด เรื่องเล่า และไอเดียเกี่ยวกับเทคโนโลยี ชีวิต และทุกอย่างระหว่างนั้น',
          })}
        />

        {featuredPosts.length > 0 && (
          <div className="mb-16 grid gap-6">
            {featuredPosts.map((post, i) => (
              <Reveal key={post.to} index={i}>
                <FeaturedPost post={post} />
              </Reveal>
            ))}
          </div>
        )}

        {otherPosts.length > 0 ? (
          <section>
            <div className="mb-6 flex items-center gap-3">
              <h2 className="text-lg font-semibold text-foreground">{t({ en: 'All posts', th: 'บทความทั้งหมด' })}</h2>
              <ColorDashes size="sm" />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {otherPosts.map((post, i) => (
                <Reveal key={post.to} index={i}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          </section>
        ) : (
          <Reveal index={0}>
            <EmptyState />
          </Reveal>
        )}
      </div>
    </main>
  )
}
