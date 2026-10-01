import { Fragment, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import MemphisEdges from '@/components/decor/MemphisEdges'
import ColorDashes from '@/components/google/ColorDashes'
import GoogleCard from '@/components/google/GoogleCard'
import LogoMark from '@/components/google/LogoMark'
import { PillDot, pillClassName } from '@/components/google/PillLink'
import FooterSection from '@/components/sections/FooterSection'
import { PostMeta, PostTags } from '@/components/blog/PostMeta'
import { getBlogPost, postLocale, type BlogPath } from '@/lib/blog-posts'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const ease = [0.22, 1, 0.36, 1] as const

export const backPillClassName =
  'inline-flex h-9 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-g-blue/50 hover:bg-g-blue-soft/50 hover:text-foreground'

interface BlogPostLayoutProps {
  /** Route of the post; title, date, tags and cover are read from `lib/blog-posts.ts` */
  post: BlogPath
  children: ReactNode
  /** Show the post's cover image under the header */
  cover?: boolean
  /** Rendered between the header and the article, e.g. a custom hero */
  hero?: ReactNode
}

/**
 * Standard page shell for a blog post, in the landing page's style:
 * Memphis edges, back pill, navy title with four-color dashes, cover card, article column, sign-off.
 */
export default function BlogPostLayout({ post: path, children, cover = true, hero }: BlogPostLayoutProps) {
  const { locale, t } = useI18n()
  const reduce = useReducedMotion()
  const post = getBlogPost(path)
  const lang = postLocale(post, locale)
  const words = t(post.title).split(' ')

  return (
    <main className="relative min-h-screen">
      <MemphisEdges />
      <div className="relative mx-auto max-w-5xl px-6 pt-28 sm:pt-32">
        <Link to="/blogs" className={cn(backPillClassName, 'mb-12')}>
          <ArrowLeft className="size-4" />
          {t({ en: 'All posts', th: 'บทความทั้งหมด' })}
        </Link>

        <header lang={lang} className="mb-12 sm:mb-14">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <PostMeta post={post} className="mb-5" />
          </motion.div>
          <h1 className="text-3xl font-bold leading-[1.15] tracking-tight text-g-navy sm:text-4xl md:text-5xl">
            {words.map((word, i) => (
              <Fragment key={i}>
                {i > 0 && ' '}
                <motion.span
                  className="inline-block"
                  initial={reduce ? false : { opacity: 0, y: 18, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.55, delay: 0.1 + i * 0.08, ease }}
                >
                  {word}
                </motion.span>
              </Fragment>
            ))}
          </h1>
          <ColorDashes className="mt-5" delay={0.25 + words.length * 0.08} />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease }}
          >
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{t(post.description)}</p>
            <PostTags tags={post.tags} className="mt-6" />
          </motion.div>
        </header>

        {hero}

        {cover && post.coverImage && !hero && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease }}
            className="mb-16"
          >
            <GoogleCard className="p-3 pt-4">
              <div className="aspect-[16/9] overflow-hidden rounded-lg bg-muted">
                <img src={post.coverImage} alt="" className="size-full object-cover" />
              </div>
            </GoogleCard>
          </motion.div>
        )}

        <article lang={lang} className="space-y-16">
          {children}
        </article>

        <div className="mt-24 flex flex-col items-center gap-6 border-t border-border pt-12 text-center">
          <LogoMark />
          <p className="text-lg font-semibold text-g-navy">{t({ en: 'Thanks for reading', th: 'ขอบคุณที่อ่านจนจบ' })}</p>
          <ColorDashes size="sm" />
          <Link to="/blogs" className={cn(pillClassName, 'mt-2')}>
            <PillDot />
            {t({ en: 'Read more stories', th: 'อ่านเรื่องอื่นต่อ' })}
          </Link>
        </div>
      </div>
      <FooterSection />
    </main>
  )
}
