import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, PenLine, Sparkles } from 'lucide-react'
import { backPillClassName } from '@/components/blog/BlogPostLayout'
import { PostMeta, PostTags } from '@/components/blog/PostMeta'
import Reveal from '@/components/blog/Reveal'
import MemphisEdges from '@/components/decor/MemphisEdges'
import ColorDashes from '@/components/google/ColorDashes'
import GoogleCard from '@/components/google/GoogleCard'
import GoogleDots from '@/components/google/GoogleDots'
import SectionHeading from '@/components/google/SectionHeading'
import { blogPosts, type BlogPost } from '@/lib/blog-posts'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/blogs/')({
  component: BlogsPage,
})

const cardHover =
  'transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_1px_3px_rgba(60,64,67,0.2),0_6px_16px_rgba(60,64,67,0.12)]'

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
          <h2 className="text-2xl font-bold leading-snug tracking-tight text-g-navy sm:text-3xl">{t(post.title)}</h2>
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
          <h3 className="text-lg font-semibold leading-snug text-foreground">{t(post.title)}</h3>
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

function BlogsPage() {
  const { t } = useI18n()
  const visiblePosts = blogPosts.filter((post) => !post.hidden)
  const featuredPosts = visiblePosts.filter((post) => post.featured)
  const otherPosts = visiblePosts.filter((post) => !post.featured)

  return (
    <main className="relative min-h-screen">
      <MemphisEdges />
      <div className="relative mx-auto max-w-5xl px-6 pb-32 pt-28 sm:pt-32">
        <Link to="/" className={cn(backPillClassName, 'mb-12')}>
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
                <Reveal key={post.to} index={i} className="h-full">
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
