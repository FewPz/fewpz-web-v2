'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface ChatMessage {
  id: string | number;
  sender: 'me' | 'other';
  text: string;
  name?: string;
  avatar?: string;
  time?: string;
}

interface ChatDialogProps {
  messages: ChatMessage[];
  className?: string;
  delayOffset?: number;
}

export default function ChatDialog({ messages, className, delayOffset = 0 }: ChatDialogProps) {
  return (
    <div className={cn("flex flex-col gap-4 w-full max-w-2xl mx-auto p-4", className)}>
      {messages.map((msg, index) => {
        const isMe = msg.sender === 'me';
        
        return (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            transition={{ 
              duration: 0.4, 
              delay: delayOffset + (index * 0.15), 
              ease: [0.16, 1, 0.3, 1] 
            }}
            className={cn(
              "flex w-full gap-3",
              isMe ? "justify-end" : "justify-start"
            )}
          >
            {/* Avatar for 'other' */}
            {!isMe && (
              <Avatar className="w-8 h-8 md:w-10 md:h-10 shrink-0 mt-auto shadow-sm border border-border">
                <AvatarImage src={msg.avatar} alt={msg.name || "User"} />
                <AvatarFallback className="bg-muted text-xs text-muted-foreground">
                  {msg.name ? msg.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
            )}

            <div className={cn(
              "flex flex-col max-w-[75%] md:max-w-[65%]",
              isMe ? "items-end" : "items-start"
            )}>
              {/* Sender Name */}
              {msg.name && !isMe && (
                <span className="text-xs text-muted-foreground mb-1 ml-1">{msg.name}</span>
              )}

              {/* Chat Bubble */}
              <div
                className={cn(
                  "px-4 py-2.5 rounded-2xl text-sm md:text-base shadow-sm relative",
                  isMe 
                    ? "bg-primary text-primary-foreground rounded-br-sm" 
                    : "bg-card text-card-foreground rounded-bl-sm border border-border"
                )}
              >
                {msg.text}
              </div>

              {/* Timestamp */}
              {msg.time && (
                <span className="text-[10px] text-muted-foreground mt-1 mx-1">
                  {msg.time}
                </span>
              )}
            </div>

            {/* Avatar for 'me' */}
            {isMe && (
              <Avatar className="w-8 h-8 md:w-10 md:h-10 shrink-0 mt-auto shadow-sm border border-border">
                <AvatarImage src={msg.avatar} alt={msg.name || "Me"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {msg.name ? msg.name.charAt(0).toUpperCase() : "M"}
                </AvatarFallback>
              </Avatar>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
