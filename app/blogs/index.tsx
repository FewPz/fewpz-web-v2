import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import BlurText from '@/components/BlurText'
import AnimatedContent from '@/components/AnimatedContent'
import SpotlightCard from '@/components/SpotlightCard'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, ArrowUpRight, ArrowLeft, Sparkles, PenLine } from 'lucide-react'

export const Route = createFileRoute('/blogs/')({
  component: BlogsPage,
})

interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  tags: string[]
  featured?: boolean
  coverImage?: string
}

const blogPosts: BlogPost[] = [
  {
    slug: 'itkmitl-review-2026',
    title: 'มุมมองเด็กคนนึงจากคณะไอที [2026 ver.]',
    description:
      'ไม่ได้เก่งที่สุด แต่เป็นความพยายามเติบโตขึ้นในทุกวัน เรื่องเล่าธรรมดาๆ จากสายตาของเด็กไอทีคนนึง ที่อยากบันทึกการเดินทางและหยดน้ำตาหลังบรรทัดโค้ดเอาไว้',
    date: 'N/A',
    readTime: 'In progress',
    tags: ['ITKMITL', 'Student Life', 'Reflection'],
    featured: true,
    coverImage: '/blogs/itkmitl-review-2026/481176889_2070560703458848_6804156811441814737_n.jpg',
  },
  {
    slug: 'review-year-2025',
    title: 'Review Year 2025',
    description:
      "A year of growth, learning, and countless lines of code. Here's my journey through 2025.",
    date: 'December 28, 2025',
    readTime: '5 min read',
    tags: ['Personal', 'Reflection'],
    featured: false,
    coverImage:
      '/blogs/review-year-2025/586246020_2301665567015026_4460457620215506663_n.jpg',
  },
]

function BlogsPage() {
  const featuredPosts = blogPosts.filter((post) => post.featured)
  const otherPosts = blogPosts.filter((post) => !post.featured)

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-40">
        {/* Back button */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-16"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </a>

        {/* Section Label */}
        <div className="flex items-center gap-4 mb-12">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Writing</span>
          <Separator className="flex-1" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <BlurText
            text="Blog"
            className="text-4xl sm:text-5xl font-bold text-foreground mb-4"
            delay={50}
            animateBy="letters"
            direction="top"
          />
          <p className="text-lg text-muted-foreground max-w-xl">
            Thoughts, stories, and ideas about tech, life, and everything in between.
          </p>
        </motion.div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16 grid gap-6">
            {featuredPosts.map((featuredPost, index) => (
              <AnimatedContent key={featuredPost.slug} delay={index * 0.1}>
                <a href={`/blogs/${featuredPost.slug}`} className="block group">
                  <SpotlightCard
                    className="bg-card! border-border! hover:border-foreground/20! transition-all duration-300 p-0! rounded-2xl! relative overflow-hidden"
                    spotlightColor="rgba(255, 255, 255, 0.08)"
                  >
                    {featuredPost.coverImage && (
                      <div className="relative h-24 sm:h-36 w-full overflow-hidden">
                        <img
                          src={featuredPost.coverImage}
                          alt={featuredPost.title}
                          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 blur-[2px] sm:blur-sm"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-card via-card/80 to-transparent z-10" />
                        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-transparent" />
                      </div>
                    )}

                    <div
                      className={
                        featuredPost.coverImage
                          ? '-mt-8 sm:-mt-10 relative z-10 p-8 sm:p-10 pt-0 sm:pt-0'
                          : 'p-8 sm:p-10 relative z-10'
                      }
                    >
                      <div className="absolute top-4 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hidden sm:block">
                        <ArrowUpRight className="w-6 h-6 text-foreground group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 group-hover:text-foreground/80 transition-colors pr-12">
                        {featuredPost.title}
                      </h2>

                      <p className="text-base sm:text-lg text-muted-foreground mb-8 line-clamp-4 sm:line-clamp-2 leading-relaxed pb-2">
                        {featuredPost.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/50">
                        <div className="flex gap-2 flex-wrap">
                          {featuredPost.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="font-normal text-xs bg-transparent"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {featuredPost.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {featuredPost.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </a>
              </AnimatedContent>
            ))}
          </div>
        )}

        {/* Other Posts */}
        {otherPosts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-lg font-medium text-foreground">All Posts</h3>
              <Separator className="flex-1" />
            </div>

            <div className="grid gap-4">
              {otherPosts.map((post, index) => (
                <AnimatedContent key={post.slug} delay={index * 0.1}>
                  <a href={`/blogs/${post.slug}`} className="block group">
                    <div className="p-6 bg-card rounded-xl border border-border hover:border-foreground/20 transition-all duration-300 relative">
                      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowUpRight className="w-5 h-5 text-foreground group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                      </div>

                      <h3 className="text-xl font-medium text-foreground mb-2 group-hover:text-foreground/80 transition-colors pr-10">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 line-clamp-3 sm:line-clamp-2 text-sm sm:text-base leading-relaxed pb-2">
                        {post.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/50">
                        <div className="flex gap-2 flex-wrap">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="font-normal text-xs bg-transparent"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                </AnimatedContent>
              ))}
            </div>
          </div>
        )}

        {/* Empty state if no other posts */}
        {otherPosts.length === 0 && blogPosts.length <= 1 && (
          <AnimatedContent delay={0.2} className="mt-8">
            <div className="relative overflow-hidden flex flex-col items-center justify-center py-20 px-6 text-center border border-border/40 rounded-3xl bg-gradient-to-b from-card/40 to-card/10 group">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-foreground/5 rounded-full blur-[60px] group-hover:bg-foreground/10 transition-colors duration-700" />

              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 ring-1 ring-border/50 shadow-inner">
                <div className="absolute inset-0 rounded-2xl bg-foreground/5 group-hover:animate-pulse" />
                <PenLine className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
                <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-500 animate-pulse delay-75" />
              </div>

              <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 tracking-tight">
                Stories are brewing
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-sm">
                I&apos;m currently writing and preparing new content. Check back soon for more
                thoughts and updates!
              </p>
            </div>
          </AnimatedContent>
        )}
      </div>
    </main>
  )
}
