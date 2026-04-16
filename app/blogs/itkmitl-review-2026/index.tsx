import { createFileRoute } from '@tanstack/react-router';
import { useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import ClickSpark from '@/components/ClickSpark';
import ChatInterface, { Contact } from '@/components/ChatInterface';
import { ChatMessage } from '@/components/ChatDialog';

export const Route = createFileRoute('/blogs/itkmitl-review-2026/')({
  component: ITKMITLReview2026,
})

function ITKMITLReview2026() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <ClickSpark sparkColor="#f97316" sparkSize={12} sparkRadius={20} sparkCount={10} duration={500}>
      <div className="min-h-screen text-foreground font-sans relative" ref={containerRef}>

        {/* Sticky Background Image - Lightened for light theme readability */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/blogs/itkmitl-review-2026/481176889_2070560703458848_6804156811441814737_n.jpg"
            alt="ITKMITL 2026"
            className="object-cover opacity-20 dark:opacity-30 absolute inset-0 w-full h-full"
          />
          {/* Subtle gradient to ensure text readability */}
          <div className="absolute inset-0 bg-linear-to-b from-background/95 via-background/80 to-background" />
        </div>

        {/* Back Button */}
        <div className="fixed top-8 left-4 md:left-8 z-50">
          <a href="/blogs" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
            <div className="p-2 rounded-full bg-background/50 backdrop-blur-md group-hover:bg-background/80 transition-colors border border-border shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium hidden sm:inline-block">Back to Blogs</span>
          </a>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-24 md:py-32 min-h-screen flex flex-col items-center">

          {/* Header */}
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl md:text-6xl font-black tracking-tighter mb-4"
            >
              ITKMITL <span className="text-orange-500">2026</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-muted-foreground font-light"
            >
              A conversation about the journey.
            </motion.p>
          </div>

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full"
          >
            <ChatInterface
              contacts={[
                {
                  id: '1',
                  type: 'group',
                  name: 'ห้องที่ 5',
                  members: [
                    { name: 'คนสัมภาษณ์ #1', avatar: 'https://avataaars.io/?avatarStyle=Circle&topType=NoHair&accessoriesType=Prescription02&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light' },
                    { name: 'คนสัมภาษณ์ #2', avatar: 'https://avataaars.io/?avatarStyle=Circle&topType=NoHair&accessoriesType=Prescription02&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light' },
                    { name: 'FewPz', avatar: 'https://github.com/fewpz.png' },
                  ],
                  lastMessage: 'You: ขอบคุณครับ สวัสดีครับ',
                  lastTime: '09:15',
                },
                {
                  id: '2',
                  type: 'direct',
                  name: 'KongZa4G',
                  avatar: 'https://github.com/kongza4g.png',
                  status: 'online' as const,
                  lastMessage: "",
                  lastTime: '2026',
                },
              ]}
              initialMessages={[{
                id: 1,
                sender: 'other',
                text: "สวัสดี! Can you believe it's been 4 years since we graduated from ITKMITL?",
                name: 'Friend',
                time: '2026',
                avatar: 'https://avataaars.io/?avatarStyle=Circle&topType=NoHair&accessoriesType=Prescription02&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light',
              },
              {
                id: 2,
                sender: 'me',
                text: "Yeah, it feels like it was just yesterday. Everything was so new.",
                time: '2026',
                avatar: 'https://github.com/FewPz.png',
              }
              ]}
              activeContactId="1"
              title="ณ วันสัมภาษณ์รอบ 1 ของปี 2565"
              readonly
            />
          </motion.div>

          {/* Outro */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ margin: "-20% 0px -20% 0px" }}
            transition={{ duration: 1 }}
            className="text-center py-20 mt-16"
          >
            <a href="/blogs">
              <div className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                Read More Stories
              </div>
            </a>
          </motion.div>

        </div>
      </div>
    </ClickSpark>
  );
}
