'use client';

import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import BlurText from '@/components/BlurText';
import AnimatedContent from '@/components/AnimatedContent';
import ClickSpark from '@/components/ClickSpark';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    GraduationCap,
    ArrowLeft,
    Send,
    Heart,
    Sparkles,
    Instagram,
    PartyPopper,
    MessageCircle
} from 'lucide-react';
import Link from 'next/link';

interface WishMessage {
    id: string;
    name: string;
    instagram?: string;
    message: string;
    createdAt: string;
}

const STORAGE_KEY = 'graduation-2025-wishes';

// Sample messages for POC
const sampleMessages: WishMessage[] = [
    {
        id: '1',
        name: 'เพื่อนคนแรก',
        instagram: '@friend_one',
        message: 'ยินดีด้วยนะ! ภูมิใจในตัวนายมาก ๆ เลย สู้มาตลอด 4 ปี ในที่สุดก็จบแล้ว 🎉',
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'น้องรุ่น IT21',
        message: 'ขอแสดงความยินดีกับพี่ด้วยครับ! พี่เป็นแรงบันดาลใจให้พวกเราเสมอ 💪',
        createdAt: new Date().toISOString(),
    },
];

export default function Graduation2025Page() {
    const [messages, setMessages] = useState<WishMessage[]>([]);
    const [name, setName] = useState('');
    const [instagram, setInstagram] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Load messages from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setMessages(JSON.parse(stored));
        } else {
            // Initialize with sample messages for POC
            setMessages(sampleMessages);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleMessages));
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !message.trim()) return;

        setIsSubmitting(true);

        const newMessage: WishMessage = {
            id: Date.now().toString(),
            name: name.trim(),
            instagram: instagram.trim() || undefined,
            message: message.trim(),
            createdAt: new Date().toISOString(),
        };

        const updated = [newMessage, ...messages];
        setMessages(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // Reset form
        setName('');
        setInstagram('');
        setMessage('');
        setIsSubmitting(false);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getAvatarColor = (name: string) => {
        const colors = [
            'bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-cyan-500',
            'bg-teal-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500'
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <ClickSpark
            sparkColor="#f59e0b"
            sparkSize={12}
            sparkRadius={20}
            sparkCount={10}
            duration={500}
        >
            <main className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-pink-500/20" />

                    {/* Floating decorations */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute"
                                initial={{ opacity: 0, y: 100 }}
                                animate={{
                                    opacity: [0.4, 0.8, 0.4],
                                    y: [-20, -40, -20],
                                    x: [0, 20, 0],
                                }}
                                transition={{
                                    duration: 3 + i,
                                    repeat: Infinity,
                                    delay: i * 0.3,
                                }}
                                style={{
                                    left: `${10 + i * 12}%`,
                                    top: `${20 + (i % 3) * 20}%`,
                                }}
                            >
                                {i % 3 === 0 ? (
                                    <GraduationCap className="w-8 h-8 text-amber-500/50" />
                                ) : i % 3 === 1 ? (
                                    <Sparkles className="w-6 h-6 text-pink-500/50" />
                                ) : (
                                    <PartyPopper className="w-7 h-7 text-orange-500/50" />
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

                    <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                        {/* Back button */}
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>

                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Badge variant="default" className="mb-6 bg-amber-500 hover:bg-amber-600">
                                <GraduationCap className="w-3 h-3 mr-2" />
                                Class of 2025
                            </Badge>
                        </motion.div>

                        {/* Title */}
                        <div className="flex justify-center mb-4">
                            <BlurText
                                text="Congratulations!"
                                className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 bg-clip-text text-transparent"
                                delay={100}
                                animateBy="letters"
                            />
                        </div>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6"
                        >
                            🎓 ยินดีด้วยกับการจบการศึกษา! ฝากข้อความอวยพรให้เพื่อนของเราได้เลย
                        </motion.p>

                        {/* Scroll indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, y: [0, 10, 0] }}
                            transition={{ delay: 1, duration: 2, repeat: Infinity }}
                            className="flex flex-col items-center gap-2 text-muted-foreground"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm">ฝากข้อความได้ด้านล่าง</span>
                        </motion.div>
                    </div>
                </section>

                <Separator className="max-w-4xl mx-auto" />

                {/* Message Form Section */}
                <section className="py-16 sm:py-24">
                    <div className="max-w-2xl mx-auto px-6">
                        <AnimatedContent
                            distance={50}
                            direction="vertical"
                            reverse={false}

                        >
                            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-full bg-amber-500/10">
                                        <Heart className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <h2 className="text-xl font-semibold">ฝากข้อความอวยพร</h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-muted-foreground mb-2 block">
                                                ชื่อของคุณ *
                                            </label>
                                            <Input
                                                placeholder="เช่น สมชาย"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground mb-2 block">
                                                Instagram (ถ้ามี)
                                            </label>
                                            <div className="relative">
                                                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="@username"
                                                    value={instagram}
                                                    onChange={(e) => setInstagram(e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">
                                            ข้อความอวยพร *
                                        </label>
                                        <Textarea
                                            placeholder="เขียนข้อความอวยพรให้เพื่อนของคุณ..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            rows={4}
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                        disabled={isSubmitting || !name.trim() || !message.trim()}
                                    >
                                        {submitted ? (
                                            <>
                                                <Sparkles className="w-4 h-4 mr-2" />
                                                ส่งข้อความสำเร็จ!
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                ส่งข้อความอวยพร
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </AnimatedContent>
                    </div>
                </section>

                {/* Messages Grid */}
                <section className="py-16 sm:py-24 bg-muted/30">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="flex items-center gap-3 mb-8">
                            <MessageCircle className="w-6 h-6 text-amber-500" />
                            <h2 className="text-2xl font-semibold">
                                ข้อความจากเพื่อน ๆ ({messages.length})
                            </h2>
                        </div>

                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.1 }
                                }
                            }}
                        >
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={msg.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    className="group"
                                >
                                    <div className="h-full bg-card border border-border rounded-2xl p-5 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5">
                                        {/* Header */}
                                        <div className="flex items-start gap-3 mb-3">
                                            <Avatar className={`${getAvatarColor(msg.name)} text-white`}>
                                                <AvatarFallback className="bg-transparent">
                                                    {getInitials(msg.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-foreground truncate">
                                                    {msg.name}
                                                </p>
                                                {msg.instagram && (
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {msg.instagram}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <p className="text-muted-foreground leading-relaxed">
                                            {msg.message}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {messages.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>ยังไม่มีข้อความอวยพร เป็นคนแรกที่ฝากข้อความเลย!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 text-center text-sm text-muted-foreground">
                    <p>Made with ❤️ for your graduation</p>
                </footer>
            </main>
        </ClickSpark>
    );
}
