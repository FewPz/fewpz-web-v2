import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PillLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Leading icon; defaults to a small dot that turns blue on hover */
  icon?: LucideIcon
  /** Stretch to the full width of the container */
  block?: boolean
}

export const pillClassName =
  'group/pill inline-flex h-12 items-center justify-center gap-2.5 rounded-full border border-border bg-white px-6 text-sm font-semibold text-foreground ' +
  'transition-[background-color,border-color,box-shadow] duration-200 hover:border-g-blue/50 hover:bg-g-blue-soft/50 hover:shadow-[0_1px_3px_rgba(60,64,67,0.12)] ' +
  'outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40'

/** The small leading dot that grows and turns blue when the pill is hovered. */
export function PillDot() {
  return (
    <span className="size-1.5 rounded-full bg-foreground transition-[background-color,scale] duration-200 group-hover/pill:scale-150 group-hover/pill:bg-g-blue" />
  )
}

/** Outlined pill button, e.g. "• Continue with …". */
export default function PillLink({ icon: Icon, block, className, children, ...props }: PillLinkProps) {
  return (
    <a className={cn(pillClassName, block && 'w-full', className)} {...props}>
      {Icon ? (
        <Icon className="size-4 text-muted-foreground transition-colors group-hover/pill:text-g-blue-ink" />
      ) : (
        <PillDot />
      )}
      {children}
    </a>
  )
}
