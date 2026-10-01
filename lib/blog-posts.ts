import type { Locale, Text } from '@/lib/i18n'

export type BlogPath = '/blogs/minedocs-mcp' | '/blogs/itkmitl-review-2026' | '/blogs/review-year-2025'

export interface BlogPost {
  to: BlogPath
  /** A plain string is shown as-is in every language */
  title: Text
  description: Text
  /** Languages the post is written in; the first is the default */
  langs: Locale[]
  /** ISO date; omitted while the post is still being written */
  date?: string
  readMinutes?: number
  tags: string[]
  featured?: boolean
  coverImage?: string
  /** Left out of the listing; the route still exists */
  hidden?: boolean
}

export const blogPosts: BlogPost[] = [
  {
    to: '/blogs/minedocs-mcp',
    title: {
      th: 'เมื่อ AI เขียน Minecraft Plugin โดยมี PaperMC Javadocs อยู่ข้างตัว',
      en: 'When AI Writes Minecraft Plugins with the PaperMC Javadocs by Its Side',
    },
    description: {
      th: 'เบื่อ AI เขียน Plugin แล้วเรียก Method ที่ไม่มีอยู่จริง เลยลองทำ MCP ให้มันไปเปิด PaperMC Javadocs ดูเองก่อนเขียนโค้ด',
      en: "Tired of AI calling methods that don't exist, I built an MCP server that lets it check the PaperMC Javadocs before writing plugin code.",
    },
    langs: ['th', 'en'],
    date: '2026-10-01',
    readMinutes: 10,
    tags: ['MCP', 'Minecraft', 'PaperMC', 'AI'],
    featured: true,
  },
  {
    to: '/blogs/itkmitl-review-2026',
    title: 'มุมมองเด็กคนนึงจากคณะไอที [2026 ver.]',
    description: {
      th: 'ไม่ได้เก่งที่สุด แต่เป็นความพยายามเติบโตขึ้นในทุกวัน เรื่องเล่าธรรมดาๆ จากสายตาของเด็กไอทีคนนึง ที่อยากบันทึกการเดินทางและหยดน้ำตาหลังบรรทัดโค้ดเอาไว้',
      en: 'Not the best, just trying to grow a little every day. Ordinary stories through the eyes of an IT student, recording the journey and the tears behind every line of code.',
    },
    langs: ['th'],
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
    langs: ['th'],
    date: '2025-12-28',
    readMinutes: 5,
    tags: ['Personal', 'Reflection'],
    coverImage: '/blogs/review-year-2025/586246020_2301665567015026_4460457620215506663_n.jpg',
  },
]

export function getBlogPost(to: BlogPath): BlogPost {
  const post = blogPosts.find((p) => p.to === to)
  if (!post) throw new Error(`Unknown blog post: ${to}`)
  return post
}

/** The language to show a post in: the visitor's, if the post has it. */
export function postLocale(post: BlogPost, locale: Locale): Locale {
  return post.langs.includes(locale) ? locale : post.langs[0]
}
