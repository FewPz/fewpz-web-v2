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

            {/* มกราคม 2025 */}
            <MonthStoriesSection title="มกราคม 2025" stories={
                [
                    {
                        id: 1,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        video: "/blogs/review-year-2025/jan/0ed9556b-cf90-4092-b406-15e1ff7c3f37.mp4",
                    },
                    {
                        id: 2,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/jan/8cca8c68-2764-4279-baa5-82b7b873d8e5.jpg",
                    },
                    {
                        id: 3,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/jan/d5630143-fc6b-4464-b8ec-65b570dd4c1a.jpg",
                    },
                    {
                        id: 4,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/jan/df65ded1-6893-48b0-b0b5-f7f942e9ce0f.jpg",
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


            {/* พฤษภาคม 2025 */}
            <MonthStoriesSection title="พฤษภาคม 2025" stories={
                [
                    {
                        id: 1,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/may/3e7b3118-5cc0-425f-80fc-3dd57ea7d383.jpg",
                    },
                    {
                        id: 2,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/may/4710cfbc-29a6-48cf-a9b5-609f72ad1980.jpg",
                    },
                    {
                        id: 3,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/may/5bf4bd52-7801-483e-8e77-155a67b1a90e.jpg",
                    },
                    {
                        id: 4,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/may/6dccca2b-45f5-43c4-898e-ef4c65eab1d5.jpg",
                    },
                    {
                        id: 5,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/may/dfbfb4dc-4f61-48ed-a079-ce1b11c825a4.jpg",
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

            {/* มิถุนายน 2025 */}
            <MonthStoriesSection title="มิถุนายน 2025" stories={
                [
                    {
                        id: 1,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/jun/6000c1af-ac7c-46bb-a4b5-cd86af1938bf.jpg",
                    },
                    {
                        id: 2,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/jun/86097dec-13e9-48ce-a167-aeb9012f786f.jpg",
                    },
                    {
                        id: 3,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/jun/a1395943-2aa7-4f2d-87c9-8e8459d09f22.jpg",
                    },
                    {
                        id: 4,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/jun/c9594dcd-af52-479e-96bb-280510a8f905.jpg",
                    },
                    {
                        id: 5,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/jun/da4c20d3-74b0-4823-b912-aef9476194df.jpg",
                    },
                    {
                        id: 6,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/jun/dd3a85c6-e9a0-4ae8-aa58-af10dc190ebe.jpg",
                    },
                    {
                        id: 7,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/jun/e54a97bf-9835-4e9c-ac7f-9bc5b075cc5b.jpg",
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

            {/* กรกฎาคม 2025 */}
            <MonthStoriesSection title="กรกฎาคม 2025" stories={
                [
                    {
                        id: 1,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/july/8c750ac8-d017-413e-9817-3a6a0332748b.jpg",
                    },
                    {
                        id: 2,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/july/9e95a8b3-3d6a-4118-99cc-e76845c0305d.jpg",
                    },
                    {
                        id: 3,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/july/17d6174b-2adb-4293-816a-b00d27eba83b.jpg",
                    },
                    {
                        id: 4,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/july/878c9146-853d-43d8-a213-75178c9897b7.jpg",
                    },
                    {
                        id: 5,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/july/af1ef6d6-7362-4c62-a332-5388ee31aa26.jpg",
                    },
                    {
                        id: 6,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/july/d9705676-d42f-4047-903f-18f11bc596c8.jpg",
                    },
                    {
                        id: 7,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/july/dc1b6ed1-6332-4c4f-8ced-02c3bbe6c09d.jpg",
                    },
                    {
                        id: 8,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/july/f843be03-4af3-4c55-8829-6e3efb10dff1.jpg",
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

            {/* สิงหาคม 2025 */}
            <MonthStoriesSection title="สิงหาคม 2025" stories={
                [
                    {
                        id: 1,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/aug/5ca73459-4376-4e79-99a0-896b77157804.jpg",
                    },
                    {
                        id: 2,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/aug/079b075a-2f9d-47b8-804d-2b296cc70d6c.jpg",
                    },
                    {
                        id: 3,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/aug/830aa696-e558-4a11-8eb6-8c532f8ef3a1.jpg",
                    },
                    {
                        id: 4,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/aug/c3365601-d207-47d9-934f-23f33ced0107.jpg",
                    },
                    {
                        id: 5,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/aug/f6ea2444-b25e-4563-b38e-6c4521745648.jpg",
                    },
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

            {/* กันยายน 2025 */}
            <MonthStoriesSection title="กันยายน 2025" stories={
                [
                    {
                        id: 1,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/sep/b4566673-4884-4d25-9506-89e7c68b8cd8.jpg",
                    },
                    {
                        id: 2,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        video: "/blogs/review-year-2025/sep/793f3724-cb8b-4600-89bc-9ad8133a8c0e.mp4",
                    },
                    {
                        id: 3,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/sep/372aeb29-10a9-4793-acc1-b5989599b0bb.jpg",
                    },
                    {
                        id: 4,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        video: "/blogs/review-year-2025/sep/89072f2d-48be-428b-b82d-38982b16a386.mp4",
                    },
                    {
                        id: 5,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/sep/04e3a6a7-5d01-4823-b10a-610b9ccc5c86.jpg",
                    },
                    {
                        id: 6,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/sep/4c15e3e9-b761-4d20-99de-27009c54effd.jpg",
                    },
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


            {/* ตุลาคม 2025 */}
            <MonthStoriesSection title="ตุลาคม 2025" stories={
                [
                    {
                        id: 1,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/oct/0f15725b-bdbb-4f8c-b1a4-532461c3fe86.jpg",
                    },
                    {
                        id: 2,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/oct/7d67028c-8b3d-4892-8086-5a7149a456b1.jpg",
                    },
                    {
                        id: 3,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        video: "/blogs/review-year-2025/oct/14e95b9c-d387-4e45-8d0f-fb7e7e5bc6ae.mp4",
                    },
                    {
                        id: 4,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/oct/26a47419-be79-46a7-beb3-7055c2d9aff0.jpg",
                    },
                    {
                        id: 5,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/oct/51efba39-0a91-4aba-8c5e-50601921308a.jpg",
                    },
                    {
                        id: 6,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/oct/3958b7c4-8149-4300-88be-de1872bea504.jpg",
                    },
                    {
                        id: 7,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/oct/bb41149b-5e5e-492c-8a8b-557943cb2e21.jpg",
                    },
                    {
                        id: 8,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/oct/dd311fe9-8ba8-4c6a-a544-1a9968b03e2e.jpg",
                    },
                    {
                        id: 9,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        video: "/blogs/review-year-2025/oct/e0c76d7b-a633-48fb-9a92-db28a2603fc6.mp4",
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

            {/* พฤศจิกายน 2025 */}
            <MonthStoriesSection title="พฤศจิกายน 2025" stories={
                [
                    {
                        id: 1,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/nov/26a47419-be79-46a7-beb3-7055c2d9aff0 (1).jpg",
                    },
                    {
                        id: 2,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/nov/603940117_915697594141829_2054152207974126398_n.jpg",
                    },
                    {
                        id: 3,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/nov/604338904_1238082348371825_173794399676010634_n.jpg",
                    },
                    {
                        id: 4,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        video: "/blogs/review-year-2025/nov/604547276_25345008611849834_1925035433281821499_n.mp4",
                    },
                    {
                        id: 5,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/nov/604587643_1379862163024201_4368633793093115781_n.jpg",
                    },
                    {
                        id: 6,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/nov/604669850_1546177463278155_542378110505621316_n.jpg",
                    },
                    {
                        id: 7,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/nov/604847489_2058920604930608_5566843188445232579_n.jpg",
                    },
                    {
                        id: 8,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/nov/604889331_2260041697818122_1315642838825266554_n.jpg",
                    },
                    {
                        id: 9,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/nov/605039326_1392602142372591_412138365289307421_n.jpg",
                    },
                    {
                        id: 10,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/nov/605112526_1399561825126120_7235212915268484037_n.jpg",
                    },
                    {
                        id: 11,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/nov/605572409_25486469061010882_330962597592341013_n.jpg",
                    },
                    {
                        id: 12,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        video: "/blogs/review-year-2025/nov/605580865_25240199505601258_5208335796209988948_n.mp4",
                    },
                    {
                        id: 13,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        video: "/blogs/review-year-2025/nov/605602265_24844130645265128_249295377953870617_n.mp4",
                    },
                    {
                        id: 14,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        video: "/blogs/review-year-2025/nov/605730634_25720008220970217_1369462532087845370_n.mp4",
                    },
                    {
                        id: 15,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/nov/605966491_1268994461724388_4914988843623708904_n.jpg",
                    },
                    {
                        id: 16,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/nov/607013350_855103697235276_8659430103170411688_n.jpg",
                    },
                    {
                        id: 17,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        video: "/blogs/review-year-2025/nov/607048957_25585267751129423_2032430050482769670_n.mp4",
                    },
                    {
                        id: 18,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/nov/608049956_1224129512920074_3210620682537792677_n.jpg",
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

            {/* ธันวาคม 2025 */}
            <MonthStoriesSection title="ธันวาคม 2025" stories={
                [
                    {
                        id: 1,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        video: "/blogs/review-year-2025/dec/0abf21b2-bd53-4706-a6cb-9c33f8085615.mp4",
                    },
                    {
                        id: 2,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/dec/1aa4bbb4-cc35-411c-852c-6b51abbcd731.jpg",
                    },
                    {
                        id: 3,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/dec/39bc06bd-e031-48a6-9b79-cc408fee5439.jpg",
                    },
                    {
                        id: 4,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/dec/43cbe157-884e-48c0-ac30-be86034ce669.jpg",
                    },
                    {
                        id: 5,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        video: "/blogs/review-year-2025/dec/44f552b3-8e24-4cd5-988e-67d473056507.mp4",
                    },
                    {
                        id: 6,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/dec/4a21c8d8-6627-4fba-8232-67b7dcd8e72d.jpg",
                    },
                    {
                        id: 7,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/dec/4e438540-649e-4c2a-bce0-75b923e159bb.jpg",
                    },
                    {
                        id: 8,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/dec/5522da6b-fd48-45a2-88c4-9af35829c852.jpg",
                    },
                    {
                        id: 9,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        video: "/blogs/review-year-2025/dec/67a89ac0-aa29-4ab5-8945-72bbd7a0526b.mp4",
                    },
                    {
                        id: 10,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/dec/a2623d62-8f3d-4125-86ed-9ebf10fa4b08.jpg",
                    },
                    {
                        id: 11,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/dec/a2f31a3e-dd9e-4f02-b716-84e3e40b4cec.jpg",
                    },
                    {
                        id: 12,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/dec/c459c495-af3f-45bb-96f4-9c151705649d.jpg",
                    },
                    {
                        id: 13,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/dec/d1b40bdc-83d7-49fc-9577-6f77cbae8b55.jpg",
                    },
                    {
                        id: 14,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        video: "/blogs/review-year-2025/dec/d597e4dc-1638-41df-9bea-d794e69532ee.mp4",
                    },
                    {
                        id: 15,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/dec/defc0216-f9cb-4817-87c0-13777cca1bb6.jpg",
                    },
                    {
                        id: 16,
                        author: "few.pz",
                        avatar: "/photos/photo2.jpg",
                        fallback: "FZ",
                        image: "/blogs/review-year-2025/dec/eba2234e-ab42-40d9-8a34-71658bf79a0b.jpg",
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
