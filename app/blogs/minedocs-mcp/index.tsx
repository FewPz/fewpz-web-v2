import { createFileRoute } from '@tanstack/react-router'
import BlogPostLayout from '@/components/blog/BlogPostLayout'
import { getBlogPost, postLocale } from '@/lib/blog-posts'
import { useI18n } from '@/lib/i18n'
import MineDocsEn from './-en'
import MineDocsTh from './-th'

export const Route = createFileRoute('/blogs/minedocs-mcp/')({
  component: MineDocsMcpPost,
})

function MineDocsMcpPost() {
  const { locale } = useI18n()
  const lang = postLocale(getBlogPost('/blogs/minedocs-mcp'), locale)
  return <BlogPostLayout post="/blogs/minedocs-mcp">{lang === 'th' ? <MineDocsTh /> : <MineDocsEn />}</BlogPostLayout>
}
