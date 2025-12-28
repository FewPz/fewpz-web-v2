'use client';

import { motion } from 'motion/react';
import BlurText from '@/components/BlurText';
import AnimatedContent from '@/components/AnimatedContent';
import SpotlightCard from '@/components/SpotlightCard';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  coverImage?: string;
}

const blogPosts: BlogPost[] = [
  {
    slug: 'review-year-2025',
    title: 'Review Year 2025',
    description: 'A year of growth, learning, and countless lines of code. Here\'s my journey through 2025.',
    date: 'December 28, 2025',
    readTime: '5 min read',
    tags: ['Personal', 'Reflection'],
    featured: true,
  },
  // Add more blog posts here
];

export default function BlogsPage() {
  const featuredPost = blogPosts.find((post) => post.featured);
  const otherPosts = blogPosts.filter((post) => !post.featured);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <BlurText
            text="Blog"
            className="text-5xl sm:text-6xl font-bold text-foreground mb-4"
            delay={100}
            animateBy="letters"
          />
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-muted-foreground max-w-2xl"
          >
            Thoughts, stories, and ideas about tech, life, and everything in between.
          </motion.p>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-6">
            <AnimatedContent>
              <Link href={`/blogs/${featuredPost.slug}`}>
                <SpotlightCard
                  className="p-8 bg-card rounded-3xl border border-border hover:border-orange-500/30 transition-all group"
                  spotlightColor="rgba(249, 115, 22, 0.15)"
                >
                  <Badge className="mb-4 bg-orange-500/10 text-orange-500 border-orange-500/20">
                    Featured
                  </Badge>
                  
                  <h2 className="text-3xl font-bold text-foreground mb-4 group-hover:text-orange-500 transition-colors">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-lg text-muted-foreground mb-6">
                    {featuredPost.description}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {featuredPost.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <span className="flex items-center gap-2 text-orange-500 font-medium group-hover:gap-3 transition-all">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </SpotlightCard>
              </Link>
            </AnimatedContent>
          </div>
        </section>
      )}

      {/* Other Posts */}
      {otherPosts.length > 0 && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold mb-8">All Posts</h2>
            
            <div className="grid gap-6">
              {otherPosts.map((post, index) => (
                <AnimatedContent key={post.slug} delay={index * 0.1}>
                  <Link href={`/blogs/${post.slug}`}>
                    <div className="p-6 bg-card rounded-2xl border border-border hover:border-foreground/20 transition-all group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-orange-500 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {post.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-orange-500 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                      </div>
                    </div>
                  </Link>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state if no other posts */}
      {otherPosts.length === 0 && blogPosts.length <= 1 && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center py-16 bg-muted/30 rounded-2xl">
              <p className="text-muted-foreground">
                More posts coming soon... 📝
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Footer spacer */}
      <div className="h-20" />
    </main>
  );
}
