import { Calendar, Clock, PenLine } from 'lucide-react'
import FlagIcon from '@/components/google/FlagIcon'
import type { BlogPost } from '@/lib/blog-posts'
import { colorAt } from '@/lib/google-colors'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/** Date (or "In progress"), read time and post language. */
export function PostMeta({ post, className }: { post: BlogPost; className?: string }) {
  const { locale, t } = useI18n()
  const date = post.date
    ? new Intl.DateTimeFormat(locale === 'th' ? 'th-TH-u-ca-gregory' : 'en-US', { dateStyle: 'long' }).format(
        new Date(post.date),
      )
    : null

  return (
    <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground', className)}>
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
      {post.langs.map((lang) => (
        <span key={lang} className="flex items-center gap-1.5" title={lang === 'th' ? 'ภาษาไทย' : 'English'}>
          <FlagIcon locale={lang} className="h-3 w-4" />
          {lang === 'th' ? 'ไทย' : 'EN'}
        </span>
      ))}
    </div>
  )
}

/** Outlined tag pills, each with a Google-colored dot. */
export function PostTags({ tags, className }: { tags: string[]; className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {tags.map((tag, i) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-muted-foreground"
        >
          <span className={cn('size-1.5 rounded-full', colorAt(i).bg)} />
          {tag}
        </span>
      ))}
    </div>
  )
}
