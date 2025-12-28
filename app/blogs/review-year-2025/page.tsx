'use client';

import { motion } from 'motion/react';
import BlurText from '@/components/BlurText';
import AnimatedContent from '@/components/AnimatedContent';
import CountUp from '@/components/CountUp';
import SpotlightCard from '@/components/SpotlightCard';
import TiltedCard from '@/components/TiltedCard';
import Magnet from '@/components/Magnet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Calendar,
    Code2,
    GraduationCap,
    Rocket,
    Heart,
    Music,
    Gamepad2,
    Users,
    Star,
    ArrowLeft,
    Clock
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import MonthStoriesSection from '@/components/sections/MonthStoriesSection';

// Polaroid component
function Polaroid({
    src,
    alt,
    rotation,
    delay,
    className
}: {
    src: string;
    alt: string;
    rotation: number;
    delay?: number;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: rotation - 10 }}
            animate={{ opacity: 1, scale: 1, rotate: rotation }}
            transition={{ duration: 0.8, delay: delay || 0, type: "spring", stiffness: 100 }}
        >
            <Magnet padding={80} magnetStrength={4}>
                <div
                    className={`bg-white p-2 pb-8 shadow-2xl transition-transform duration-500 hover:scale-110 cursor-pointer ${className}`}
                >
                    <div className="relative w-32 h-32 overflow-hidden bg-muted">
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </Magnet>
        </motion.div>
    );
}

export default function ReviewYear2025Page() {
    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
                {/* Blurred background image with mask gradient */}
                <img
                    src="/blogs/review-year-2025.png"
                    alt="blog background"
                    className="absolute top-0 left-0 w-full object-center object-cover"
                    style={{
                        height: '50vh',
                        filter: 'blur(8px)',
                        maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.1) 80%, rgba(0, 0, 0, 0) 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.1) 80%, rgba(0, 0, 0, 0) 100%)',
                        zIndex: 0,
                    }}
                />

                {/* Orange gradient from top */}
                <div className="absolute inset-0 bg-gradient-to-b from-orange-300/50 via-orange-from-orange-300/20 to-transparent z-5" />

                {/* Floating shapes - in front of image */}
                <div className="absolute inset-0 overflow-hidden z-10">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-orange-300/40 to-pink-500/30 blur-3xl"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0.6, 0.9, 0.6],
                                x: [0, 60, 0],
                                y: [0, 40, 0],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 8 + i * 2,
                                repeat: Infinity,
                                delay: i * 0.5,
                            }}
                            style={{
                                left: `${5 + i * 15}%`,
                                top: `${15 + (i % 3) * 25}%`,
                            }}
                        />
                    ))}
                </div>

                {/* Transparency overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/50 to-background z-20" />

                <div className="relative z-30 max-w-4xl mx-auto px-6 text-center">
                    {/* Floating Polaroids */}
                    <div className="absolute inset-0 pointer-events-none hidden sm:block">
                        {/* Left Polaroid */}
                        <div className="absolute top-1/2 -left-24 md:-left-48 -translate-y-1/2 pointer-events-auto">
                            <Polaroid
                                src="/photos/photo1.jpg"
                                alt="Photo 1"
                                rotation={-12}
                                delay={0.3}
                            />
                        </div>

                        {/* Right Polaroid */}
                        <div className="absolute top-1/2 -right-24 md:-right-48 -translate-y-1/2 pointer-events-auto">
                            <Polaroid
                                src="/blogs/review-year-2025/585883946_2301665550348361_8664537836990158268_n.jpg"
                                alt="Photo 2"
                                rotation={8}
                                delay={0.5}
                            />
                        </div>
                    </div>

                    {/* Back button */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    {/* Date badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Badge variant="default" className="mb-6">
                            <Calendar className="w-3 h-3 mr-2" />
                            December 28, 2025
                        </Badge>
                    </motion.div>

                    {/* Title */}
                    <BlurText
                        text="Review Year 2025"
                        className="text-5xl sm:text-7xl font-bold text-foreground mb-6"
                        delay={100}
                        animateBy="letters"
                    />

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
                    >
                        A year of growth, learning, and countless lines of code.
                        Here&apos;s my journey through 2025.
                    </motion.p>

                    {/* Read time */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                    >
                        <Clock className="w-4 h-4" />
                        <span>5 min read</span>
                    </motion.div>
                </div>
            </section>

            <Separator className="max-w-4xl mx-auto" />

            {/* กุมภาพันธ์ 2025 */}
            <MonthStoriesSection title="กุมภาพันธ์ 2025" stories={
                [
                    {
                        id: 1,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/feb/4828543b-8244-4fd3-9fe2-e44827775c76.jpg",
                    },
                    {
                        id: 2,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/feb/7cc49096-bcc2-40d7-8054-6a4073933f5c.jpg",
                    },
                    {
                        id: 3,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/feb/defd1c1f-4ff2-4ef6-a41a-449d1fb99c0c.jpg",
                    },
                    {
                        id: 4,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/feb/eca281c7-a130-43ac-be2e-441778f4cac6.jpg",
                    },
                    {
                        id: 5,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/feb/945028a9-94af-4b13-a1aa-0016bbaa6bc5.jpg",
                    }
                ]
            }>
                <p className="text-muted-foreground leading-relaxed mb-6">
                    2025 has been an incredible year of growth, challenges, and achievements.
                    From starting new projects to learning cutting-edge technologies,
                    every moment has been a stepping stone towards becoming a better developer.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    This year, I focused heavily on building real-world applications,
                    contributing to open source, and expanding my knowledge in areas like
                    AI/ML, cloud computing, and modern web development frameworks.
                </p>
            </MonthStoriesSection>

            
            {/* มีนาคม 2025 */}
            <MonthStoriesSection title="มีนาคม 2025" stories={
                [
                    {
                        id: 1,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/mar/10176945-0b0a-44f5-8361-3add2e843240.jpg",
                    },
                    {
                        id: 2,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/mar/ad3254a6-fe03-48ee-a20f-f71702d20160.jpg",
                    },
                    {
                        id: 3,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/mar/d22b7c8b-8ca4-48ef-874e-f756193b2838.jpg",
                    },
                    {
                        id: 4,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/mar/e644a777-b770-4191-9933-8aa47a15624a.jpg",
                    },
                    {
                        id: 5,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/mar/fece0aff-836d-45ed-b397-5053ade1301b.jpg",
                    }
                ]
            }>
                <p className="text-muted-foreground leading-relaxed mb-6">
                    2025 has been an incredible year of growth, challenges, and achievements.
                    From starting new projects to learning cutting-edge technologies,
                    every moment has been a stepping stone towards becoming a better developer.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    This year, I focused heavily on building real-world applications,
                    contributing to open source, and expanding my knowledge in areas like
                    AI/ML, cloud computing, and modern web development frameworks.
                </p>
            </MonthStoriesSection>

            {/* เมษายน 2025 */}
            <MonthStoriesSection title="เมษายน 2025" stories={
                [
                    {
                        id: 1,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/apr/0bb480fa-31c5-4255-a630-0c73ccc80e22.jpg",
                    },
                    {
                        id: 2,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/apr/8d80f207-d2a7-452b-8fbc-022af2a4d394.jpg",
                    },
                    {
                        id: 3,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/apr/ade55778-4a8e-436a-9d01-28c1736219ed.jpg",
                    },
                    {
                        id: 4,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/apr/b0d54a44-7a4b-4649-bdc3-3ce9ae3392dc.jpg",
                    },
                    {
                        id: 5,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/apr/b6f328e1-9eab-4059-b494-bab54bd9322e.jpg",
                    },
                    {
                        id: 6,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        video: "/blogs/review-year-2025/apr/255f7125-79ab-43d6-86c0-84a59b688a32.mp4",
                    },
                    {
                        id: 7,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        video: "/blogs/review-year-2025/apr/d7503cf5-5e3e-4211-90c1-752f26ac1330.mp4",
                    }
                ]
            }>
                <p className="text-muted-foreground leading-relaxed mb-6">
                    2025 has been an incredible year of growth, challenges, and achievements.
                    From starting new projects to learning cutting-edge technologies,
                    every moment has been a stepping stone towards becoming a better developer.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    This year, I focused heavily on building real-world applications,
                    contributing to open source, and expanding my knowledge in areas like
                    AI/ML, cloud computing, and modern web development frameworks.
                </p>
            </MonthStoriesSection>

            <Separator className="max-w-4xl mx-auto" />

            {/* Looking Forward Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <AnimatedContent distance={40} duration={0.8}>
                        <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center justify-center gap-3">
                            <Rocket className="w-8 h-8 text-orange-500" />
                            Looking Forward to 2026
                        </h2>
                        <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
                            As I step into 2026, I&apos;m excited about the possibilities ahead.
                            My goals include deepening my expertise in AI/ML, contributing more to
                            open source, and building products that make a difference.
                        </p>

                        <div className="flex flex-wrap justify-center gap-3">
                            {['AI/ML', 'Cloud Architecture', 'System Design', 'Open Source', 'Content Creation'].map((goal, index) => (
                                <motion.div
                                    key={goal}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Magnet padding={40} magnetStrength={2}>
                                        <Badge
                                            variant="outline"
                                            className="px-4 py-2 text-sm hover:bg-orange-500/10 hover:border-orange-500/50 transition-colors cursor-pointer"
                                        >
                                            {goal}
                                        </Badge>
                                    </Magnet>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatedContent>
                </div>
            </section>

            {/* Closing Section */}
            <section className="py-20 px-6 bg-gradient-to-b from-transparent via-orange-500/5 to-orange-500/10">
                <div className="max-w-4xl mx-auto text-center">
                    <AnimatedContent distance={40} duration={0.8}>
                        <motion.div
                            className="text-6xl mb-6"
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                            }}
                        >
                            🎉
                        </motion.div>
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                            Thank You for Reading!
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            Here&apos;s to an amazing 2026 filled with growth, creativity, and endless possibilities!
                        </p>
                        <Link href="/">
                            <Magnet padding={60} magnetStrength={3}>
                                <motion.button
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Home
                                </motion.button>
                            </Magnet>
                        </Link>
                    </AnimatedContent>
                </div>
            </section>
        </main>
    );
}
