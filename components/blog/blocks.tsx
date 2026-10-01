import { useState, type AnchorHTMLAttributes, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Check, Copy, Lightbulb } from 'lucide-react'
import Reveal from '@/components/blog/Reveal'
import ColorDashes from '@/components/google/ColorDashes'
import GoogleCard from '@/components/google/GoogleCard'
import { colorAt, colorClasses, type GoogleColor } from '@/lib/google-colors'
import { cn } from '@/lib/utils'

/*
 * Building blocks for blog post content. Drop them inside <BlogPostLayout>:
 *
 *   <BlogSection title="…">
 *     <BlogParagraph>…</BlogParagraph>
 *     <BlogFigure src="…" caption="…" />
 *   </BlogSection>
 */

interface BlogSectionProps {
  title?: string
  /** Small coloured label above the title, e.g. a month or chapter number */
  eyebrow?: string
  /** Colour of the eyebrow label */
  color?: GoogleColor
  id?: string
  className?: string
  children: ReactNode
}

/** A chapter of the post: navy heading + dashes, then its content. */
export function BlogSection({ title, eyebrow, color = 'blue', id, className, children }: BlogSectionProps) {
  const c = colorClasses(color)
  return (
    <Reveal>
      <section id={id} className={cn('scroll-mt-28', className)}>
        {(title || eyebrow) && (
          <div className="mb-6">
            {eyebrow && (
              <span className={cn('mb-3 inline-flex items-center gap-2 text-sm font-semibold', c.ink)}>
                <span className={cn('size-1.5 rounded-full', c.bg)} />
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="text-2xl font-bold leading-snug tracking-tight text-g-navy sm:text-3xl">{title}</h2>
            )}
            <ColorDashes size="sm" className="mt-4" />
          </div>
        )}
        <div className="space-y-5">{children}</div>
      </section>
    </Reveal>
  )
}

/** Body text. */
export function BlogParagraph({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cn('text-base leading-[1.85] text-muted-foreground sm:text-lg', className)}>{children}</p>
}

/** Larger opening line, like the About section lead. */
export function BlogLead({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <p className={cn('text-xl font-medium leading-snug text-foreground sm:text-2xl', className)}>{children}</p>
  )
}

/** Inline link inside body text; external links open in a new tab. */
export function BlogLink({ href = '#', className, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = /^https?:\/\//.test(href)
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={cn(
        'font-medium text-g-blue-ink underline decoration-g-blue/30 underline-offset-4 transition-colors hover:decoration-g-blue',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}

/** Pull quote with a coloured rule on the left. */
export function BlogQuote({
  cite,
  color = 'blue',
  children,
}: {
  cite?: string
  color?: GoogleColor
  children: ReactNode
}) {
  return (
    <figure className={cn('border-l-4 py-1 pl-6', colorClasses(color).border)}>
      <blockquote className="text-xl font-medium leading-relaxed text-foreground sm:text-2xl">{children}</blockquote>
      {cite && <figcaption className="mt-3 text-sm text-muted-foreground">— {cite}</figcaption>}
    </figure>
  )
}

/** Tinted note box for asides, tips or "what I learned". */
export function BlogCallout({
  title,
  icon: Icon = Lightbulb,
  color = 'yellow',
  children,
}: {
  title?: string
  icon?: LucideIcon
  color?: GoogleColor
  children: ReactNode
}) {
  const c = colorClasses(color)
  return (
    <aside className={cn('flex gap-4 rounded-xl p-5 sm:p-6', c.soft)}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white">
        <Icon className={cn('size-4.5', c.ink)} />
      </span>
      <div className="space-y-1.5 pt-1.5">
        {title && <p className={cn('font-semibold', c.ink)}>{title}</p>}
        <div className="leading-relaxed text-foreground/80">{children}</div>
      </div>
    </aside>
  )
}

interface BlogFigureProps {
  src: string
  alt?: string
  caption?: string
  /** Tailwind aspect class for the image box */
  aspect?: string
  /** Tilt the card like the About photo; straightens on hover */
  tilt?: 'left' | 'right'
  className?: string
}

/** Image in a framed card with an optional caption row. */
export function BlogFigure({ src, alt = '', caption, aspect = 'aspect-[16/9]', tilt, className }: BlogFigureProps) {
  return (
    <figure className={className}>
      <GoogleCard
        className={cn(
          'p-3 pt-4',
          tilt && 'transition-[rotate] duration-500 hover:rotate-0',
          tilt === 'left' && '-rotate-1',
          tilt === 'right' && 'rotate-1',
        )}
      >
        <div className={cn('overflow-hidden rounded-lg bg-muted', aspect)}>
          <img src={src} alt={alt} loading="lazy" className="size-full object-cover" />
        </div>
        {caption && (
          <figcaption className="flex items-center justify-between gap-4 px-1 pt-3 text-sm text-muted-foreground">
            <span>{caption}</span>
            <ColorDashes size="sm" className="shrink-0" />
          </figcaption>
        )}
      </GoogleCard>
    </figure>
  )
}

/** Grid of photos; each tile zooms slightly on hover. */
export function BlogGallery({
  images,
  columns = 3,
  className,
}: {
  images: { src: string; alt?: string }[]
  columns?: 2 | 3 | 4
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3',
        columns === 3 && 'sm:grid-cols-3',
        columns === 4 && 'sm:grid-cols-4',
        className,
      )}
    >
      {images.map((img) => (
        <GoogleCard key={img.src} strip="hover" className="aspect-square">
          <img
            src={img.src}
            alt={img.alt ?? ''}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </GoogleCard>
      ))}
    </div>
  )
}

/** Row of big numbers, each in its own Google colour. */
export function BlogStats({ items, className }: { items: { value: string; label: string }[]; className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 gap-4 sm:grid-cols-4', className)}>
      {items.map((item, i) => (
        <GoogleCard key={item.label} strip="hover" className="p-5">
          <p className={cn('text-3xl font-bold tracking-tight', colorAt(i).ink)}>{item.value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
        </GoogleCard>
      ))}
    </div>
  )
}

/** Quiet break between parts of a post. */
export function BlogDivider() {
  return (
    <div aria-hidden className="flex justify-center py-2">
      <ColorDashes size="sm" />
    </div>
  )
}

/** Smaller heading inside a BlogSection. */
export function BlogSubheading({ children }: { children: ReactNode }) {
  return <h3 className="pt-4 text-xl font-semibold tracking-tight text-foreground">{children}</h3>
}

/** Inline code inside body text. */
export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[0.85em] text-g-navy">
      {children}
    </code>
  )
}

/** Code or diagram block with a language label and a copy button. */
export function BlogCode({ code, language = 'text' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)
  const text = code.replace(/^\n+|\s+$/g, '')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable (e.g. insecure context); nothing to do
    }
  }

  return (
    <div lang="en" className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex h-10 items-center justify-between border-b border-border bg-muted/40 pl-4 pr-2">
        <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-g-blue" />
          {language}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className="inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs text-muted-foreground transition-colors hover:bg-g-blue-soft hover:text-g-blue-ink"
        >
          {copied ? <Check className="size-3.5 text-g-green-ink" /> : <Copy className="size-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-foreground sm:p-5 sm:text-sm">
        <code>{text}</code>
      </pre>
    </div>
  )
}

/** Bulleted (Google-coloured dots) or numbered list. */
export function BlogList({ items, ordered }: { items: ReactNode[]; ordered?: boolean }) {
  const Tag = ordered ? 'ol' : 'ul'
  return (
    <Tag className="space-y-2.5">
      {items.map((item, i) => {
        const c = colorAt(i)
        return (
          <li key={i} className="flex gap-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {ordered ? (
              <span
                className={cn(
                  'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold sm:mt-1',
                  c.soft,
                  c.ink,
                )}
              >
                {i + 1}
              </span>
            ) : (
              <span className={cn('mt-[0.6em] size-1.5 shrink-0 rounded-full', c.bg)} />
            )}
            <span>{item}</span>
          </li>
        )
      })}
    </Tag>
  )
}

/** Simple bordered table; scrolls sideways on narrow screens. */
export function BlogTable({ head, rows }: { head: ReactNode[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-left text-sm sm:text-base">
        <thead className="border-b border-border bg-muted/40">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="px-4 py-3 font-semibold text-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, i) => (
                <td key={i} className="px-4 py-3 align-top text-muted-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
