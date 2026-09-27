import GoogleCard from '@/components/google/GoogleCard';
import GoogleDots from '@/components/google/GoogleDots';
import SectionHeading from '@/components/google/SectionHeading';
import { Button } from '@/components/ui/button';
import { motion, type Variants } from 'motion/react';
import { FlaskConical, Sparkles, ExternalLink, Calendar, Users, Quote, Check } from 'lucide-react';
import { useState } from 'react';

interface Research {
    title: string;
    authors: string[];
    description: string;
    status: 'ongoing' | 'completed' | 'published';
    year: number;
    tags?: string[];
    url?: string;
    citation?: string;
}

// Add your research items here
const researchData: Research[] = [
    // {
    //     title: 'Risk-Adaptive Oral Follow-Up with Instructional Support After Auto-Graded Programming Assignments',
    //     authors: ['Peeranat Matsor', 'Chotipat Pornavalai'],
    //     description: 'This study investigates the effectiveness of risk-adaptive, post-submission oral follow-up after auto-graded programming assignments as a scalable mechanism for evaluating student understanding in introductory programming courses. The approach incorporates time-limited oral justification, with instructional support selectively provided based on risk signals derived from submission behavior and code characteristics. We compare three conditions—standard automated feedback, oral follow-up without support, and oral follow-up with instructional support—to examine how different post-submission assessment designs relate to student learning outcomes and equity.',
    //     status: 'ongoing',
    //     year: 2025,
    //     tags: ['Post-Submission Assessment', 'Computer Education'],
    //     url: 'https://example.com/research',
    //     citation: 'Matsor, P., & Pornavalai, C. (2025). Risk-Adaptive Oral Follow-Up with Instructional Support After Auto-Graded Programming Assignments. Journal Name, 1(1), 1-10.',
    // },
    // {
    //     title: 'Performance Evaluation of Distributed Minecraft Server Architectures Under Large-Scale Player Loads',
    //     authors: ['Peeranat Matsor'],
    //     description: 'This paper evaluates the performance of distributed server architectures built for large-scale Minecraft deployments. We benchmark several scaling strategies such as horizontal pod scaling, world partitioning, and cross-server player migration under loads of up to thousands of concurrent users. By analyzing key metrics like tick rate stability, network latency, memory utilization, and chunk-loading throughput across various configurations, our findings offer practical guidelines for selecting and optimizing architectures to maintain playable performance at scale',
    //     status: 'ongoing',
    //     year: 2026,
    //     tags: ['Horizontal Scaling', 'Game Server Architecture'],
    // }
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

const statusColors: Record<Research['status'], string> = {
    ongoing: 'bg-g-yellow-soft text-g-yellow-ink',
    completed: 'bg-g-green-soft text-g-green-ink',
    published: 'bg-g-blue-soft text-g-blue-ink',
};

const statusLabels: Record<Research['status'], string> = {
    ongoing: 'Ongoing',
    completed: 'Completed',
    published: 'Published',
};

function ResearchCard({ research }: { research: Research }) {
    const [copied, setCopied] = useState(false);

    const handleCite = () => {
        if (research.citation) {
            navigator.clipboard.writeText(research.citation);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const highlightAuthor = (author: string) => {
        if (author.toLowerCase().includes('peeranat') || author.toLowerCase().includes('matsor')) {
            return <span className="font-semibold text-foreground">{author}</span>;
        }
        return author;
    };

    return (
        <motion.div variants={itemVariants}>
            <GoogleCard
                strip="hover"
                className="p-6 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_1px_3px_rgba(60,64,67,0.2),0_6px_16px_rgba(60,64,67,0.12)]"
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                        <FlaskConical className="w-5 h-5 text-g-yellow-ink shrink-0" />
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[research.status]}`}>
                            {statusLabels[research.status]}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {research.year}
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-foreground leading-tight mb-2">
                    {research.url ? (
                        <a href={research.url} target="_blank" className="hover:underline inline-flex items-center gap-2">
                            {research.title}
                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    ) : (
                        research.title
                    )}
                </h3>

                {/* Authors */}
                <div className="flex items-start gap-2 mb-3 text-sm text-muted-foreground">
                    <Users className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                        {research.authors.map((author, i) => (
                            <span key={i}>
                                {highlightAuthor(author)}
                                {i < research.authors.length - 1 && ', '}
                            </span>
                        ))}
                    </p>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {research.description}
                </p>

                {/* Tags & Cite Button */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    {research.tags && research.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {research.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-xs px-2.5 py-0.5 border border-border text-muted-foreground rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    ) : <div />}

                    {research.citation && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCite}
                            className="text-xs gap-1.5 h-7 rounded-full text-g-blue-ink hover:bg-g-blue-soft hover:text-g-blue-ink"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Quote className="w-3.5 h-3.5" />
                                    Cite Paper
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </GoogleCard>
        </motion.div>
    );
}

function ComingSoonCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <GoogleCard strip="view" className="px-8 py-12 sm:p-14 text-center">

                {/* Icon */}
                <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-g-yellow-soft mb-6"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <FlaskConical className="w-8 h-8 text-g-yellow-ink" />
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl font-bold tracking-tight text-foreground mb-3 flex items-center justify-center gap-2">
                    Coming Soon
                    <Sparkles className="w-5 h-5 text-g-yellow" />
                </h3>

                {/* Description */}
                <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                    I&apos;m currently working on exciting research projects. Stay tuned for updates on my latest findings and publications.
                </p>

                {/* Decorative dots */}
                <div className="flex items-center justify-center mt-8">
                    <GoogleDots />
                </div>
            </GoogleCard>
        </motion.div>
    );
}

export default function ResearchSection() {
    return (
        <section id="research" className="py-24 sm:py-32">
            <div className="max-w-5xl mx-auto px-6">
                <SectionHeading title="Research" />

                {researchData.length === 0 ? (
                    <ComingSoonCard />
                ) : (
                    <>
                        {/* Research Count */}
                        <div className="mb-8">
                            <p className="text-sm text-muted-foreground">
                                {researchData.length} research project{researchData.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {/* Research List */}
                        <motion.div
                            className="space-y-6"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {researchData.map((research, index) => (
                                <ResearchCard key={index} research={research} />
                            ))}
                        </motion.div>
                    </>
                )}
            </div>
        </section>
    );
}
