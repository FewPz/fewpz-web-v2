'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ChatDialog, { ChatMessage } from '@/components/ChatDialog';

// ─── Types ────────────────────────────────────────────────

interface GroupMember {
  name: string;
  avatar?: string;
}

export interface Contact {
  id: string;
  name: string;
  type?: 'direct' | 'group';
  /** Direct chat */
  avatar?: string;
  status?: 'online' | 'offline' | 'away';
  /** Group chat */
  members?: GroupMember[];
  /** Shared */
  lastMessage?: string;
  lastTime?: string;
  unread?: number;
}

interface ChatInterfaceProps {
  contacts?: Contact[];
  initialMessages?: ChatMessage[];
  activeContactId?: string;
  className?: string;
  title?: string;
  readonly?: boolean;
}

// ─── Default data ─────────────────────────────────────────

const defaultContacts: Contact[] = [
  {
    id: '1',
    type: 'direct',
    name: 'Alice Chen',
    status: 'online',
    lastMessage: 'Sounds good! See you then 👋',
    lastTime: '10:42',
    unread: 2,
  },
  {
    id: '2',
    type: 'group',
    name: 'Dev Team',
    members: [
      { name: 'Alice Chen', avatar: '' },
      { name: 'Bob Smith', avatar: '' },
      { name: 'Carol Wu', avatar: '' },
      { name: 'David Park', avatar: '' },
    ],
    lastMessage: 'Bob: Can you review this PR?',
    lastTime: '09:15',
    unread: 5,
  },
  {
    id: '3',
    type: 'direct',
    name: 'Carol Wu',
    status: 'offline',
    lastMessage: 'Thanks for the help!',
    lastTime: 'Yesterday',
  },
];

const defaultMessages: ChatMessage[] = [
  { id: 1, sender: 'other', name: 'Alice Chen', text: 'Hey! Are you free to chat later today?', time: '10:30' },
  { id: 2, sender: 'me', text: "Sure, I'm free after 3pm. What's up?", time: '10:31' },
  { id: 3, sender: 'other', name: 'Alice Chen', text: 'Wanted to talk about the new project proposal.', time: '10:33' },
  { id: 4, sender: 'me', text: "Absolutely! There are some interesting technical challenges.", time: '10:35' },
  { id: 5, sender: 'other', name: 'Alice Chen', text: 'Sounds good! See you then 👋', time: '10:42' },
];

// ─── Sub-components ───────────────────────────────────────

const statusColor: Record<string, string> = {
  online: 'bg-emerald-500',
  away: 'bg-amber-400',
  offline: 'bg-zinc-500',
};

function StatusDot({ status, borderVar = '--chat-sidebar' }: { status?: string; borderVar?: string }) {
  return (
    <span
      className={cn('absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2', statusColor[status ?? ''] ?? 'bg-zinc-500')}
      style={{ borderColor: `var(${borderVar})` }}
    />
  );
}

/**
 * Stacked-circle group avatar (Facebook Messenger style).
 * Back avatar sits bottom-left, front avatar sits top-right,
 * each with a ring that matches the surrounding background.
 * A green online dot anchors to the bottom-right corner.
 */
function GroupAvatar({
  members,
  className,
  ringVar = '--chat-sidebar',
}: {
  members: GroupMember[];
  className?: string;
  ringVar?: string;
}) {
  const back  = members[0];
  const front = members[1] ?? members[0];

  return (
    <div className={cn('relative shrink-0', className)}>
      {members.length === 0 ? (
        /* Facebook icon fallback */
        <div className="w-full h-full rounded-full bg-[#1877F2] flex items-center justify-center">
          <svg width="55%" height="55%" viewBox="0 0 24 24" fill="white">
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.266h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
          </svg>
        </div>
      ) : (
        <>
          {/* Back avatar — bottom-left */}
          <div
            className="absolute bottom-0 left-0 w-[66%] h-[66%] rounded-full overflow-hidden"
            style={{ boxShadow: `0 0 0 1.5px var(${ringVar})` }}
          >
            <MiniAvatar member={back} className="w-full h-full rounded-full" />
          </div>

          {/* Front avatar — top-right (on top) */}
          <div
            className="absolute top-0 right-0 w-[66%] h-[66%] rounded-full overflow-hidden z-10"
            style={{ boxShadow: `0 0 0 1.5px var(${ringVar})` }}
          >
            <MiniAvatar member={front} className="w-full h-full rounded-full" />
          </div>
        </>
      )}

      {/* Online status dot */}
      <span
        className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 z-20"
        style={{ borderColor: `var(${ringVar})` }}
      />
    </div>
  );
}

function MiniAvatar({ member, className }: { member: GroupMember; className?: string }) {
  return (
    <div className={cn('overflow-hidden bg-[var(--chat-hover)] flex items-center justify-center', className)}>
      {member.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-[8px] font-semibold text-[var(--chat-muted)] leading-none select-none">
          {member.name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

/** Renders the right avatar for a contact (group or direct) */
function ContactAvatar({
  contact,
  size = 'md',
  ringVar = '--chat-sidebar',
}: {
  contact: Contact;
  size?: 'sm' | 'md';
  ringVar?: string;
}) {
  const isGroup = contact.type === 'group';
  const dim = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';

  if (isGroup) {
    return <GroupAvatar members={contact.members ?? []} className={dim} ringVar={ringVar} />;
  }
  return (
    <Avatar className={dim}>
      <AvatarImage src={contact.avatar} alt={contact.name} />
      <AvatarFallback className="text-xs bg-[var(--chat-input-bg)] text-[var(--chat-text)]">
        {contact.name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
}

// ─── Traffic lights ───────────────────────────────────────

function TrafficLights() {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="flex items-center gap-1.5" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <button aria-label="Close" className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-90 transition-all flex items-center justify-center">
        {hovered && <svg width="6" height="6" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2l-6 6" stroke="#7a0000" strokeWidth="1.5" strokeLinecap="round"/></svg>}
      </button>
      <button aria-label="Minimise" className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:brightness-90 transition-all flex items-center justify-center">
        {hovered && <svg width="6" height="6" viewBox="0 0 10 10" fill="none"><path d="M2 5h6" stroke="#7a4500" strokeWidth="1.5" strokeLinecap="round"/></svg>}
      </button>
      <button aria-label="Maximise" className="w-3 h-3 rounded-full bg-[#28C840] hover:brightness-90 transition-all flex items-center justify-center">
        {hovered && <svg width="6" height="6" viewBox="0 0 10 10" fill="none"><path d="M2 8l6-6M2 4V8h4" stroke="#004d00" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────

export default function ChatInterface({
  contacts = defaultContacts,
  initialMessages = defaultMessages,
  activeContactId = '1',
  className,
  title = 'Messages',
  readonly = false,
}: ChatInterfaceProps) {
  const [activeId, setActiveId] = useState(activeContactId);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeContact = contacts.find((c) => c.id === activeId) ?? contacts[0];
  const isGroup = activeContact?.type === 'group';

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (!mobile) setSidebarOpen(true);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (readonly) return;
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'me',
        text: trimmed,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      },
    ]);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const selectContact = (id: string) => {
    setActiveId(id);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl overflow-hidden shadow-2xl border border-[var(--chat-border)] w-full max-w-4xl',
        className
      )}
      style={{
        fontFamily:            'var(--font-bai-jamjuree), sans-serif',
        '--chat-bg':           'var(--background)',
        '--chat-titlebar':     'var(--sidebar)',
        '--chat-sidebar':      'var(--sidebar)',
        '--chat-header':       'var(--card)',
        '--chat-input-bg':     'var(--secondary)',
        '--chat-bubble-me':    'var(--primary)',
        '--chat-bubble-other': 'var(--muted)',
        '--chat-text':         'var(--foreground)',
        '--chat-muted':        'var(--muted-foreground)',
        '--chat-border':       'var(--border)',
        '--chat-hover':        'color-mix(in oklch, var(--foreground) 5%, transparent)',
        '--chat-active':       'color-mix(in oklch, var(--foreground) 10%, transparent)',
      } as React.CSSProperties}
    >
      {/* ── macOS title bar ──────────────────────────── */}
      <div
        className="flex items-center px-4 h-10 shrink-0 border-b border-[var(--chat-border)] relative select-none"
        style={{ background: 'var(--chat-titlebar)' }}
      >
        <TrafficLights />
        <span className="absolute left-1/2 -translate-x-1/2 text-xs font-medium text-[var(--chat-muted)] pointer-events-none truncate max-w-[50%] text-center">
          {title}
        </span>
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="ml-auto w-6 h-6 rounded flex items-center justify-center text-[var(--chat-muted)] hover:text-[var(--chat-text)] hover:bg-[var(--chat-hover)] transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>
          </svg>
        </button>
      </div>

      {/* ── Body ─────────────────────────────────────── */}
      <div className="relative flex flex-1 min-h-0 h-[460px] md:h-[560px] overflow-hidden">

        {/* Mobile backdrop */}
        <AnimatePresence>
          {isMobile && sidebarOpen && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-10 bg-black/50 backdrop-blur-[2px]"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ── Sidebar ──────────────────────────────── */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              key="sidebar"
              initial={isMobile ? { x: -260 } : { width: 0, opacity: 0 }}
              animate={isMobile ? { x: 0 }   : { width: 240, opacity: 1 }}
              exit={isMobile   ? { x: -260 } : { width: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className={cn(
                'flex flex-col shrink-0 overflow-hidden border-r border-[var(--chat-border)]',
                isMobile ? 'absolute inset-y-0 left-0 z-20 w-[240px]' : 'relative'
              )}
              style={{ background: 'var(--chat-sidebar)' }}
            >
              {/* Search */}
              <div className="px-3 pt-3 pb-2 border-b border-[var(--chat-border)]">
                <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 bg-[var(--chat-input-bg)]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--chat-muted)] shrink-0">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <span className="text-xs text-[var(--chat-muted)]">Search</span>
                </div>
              </div>

              {/* Contact list */}
              <div className="flex-1 overflow-y-auto py-1">
                {contacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => selectContact(contact.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left',
                      activeId === contact.id ? 'bg-[var(--chat-active)]' : 'hover:bg-[var(--chat-hover)]'
                    )}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <ContactAvatar contact={contact} size="md" ringVar="--chat-sidebar" />
                      {contact.type !== 'group' && <StatusDot status={contact.status} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-[var(--chat-text)] truncate">{contact.name}</span>
                        <span className="text-[10px] text-[var(--chat-muted)] shrink-0">{contact.lastTime}</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5 gap-1">
                        <span className="text-[11px] text-[var(--chat-muted)] truncate">{contact.lastMessage}</span>
                        {contact.unread ? (
                          <span className="shrink-0 min-w-[18px] h-[18px] rounded-full bg-[var(--chat-bubble-me)] text-[var(--chat-bg)] text-[10px] flex items-center justify-center px-1 font-semibold">
                            {contact.unread}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Main chat ────────────────────────────── */}
        <div className="flex flex-col flex-1 min-w-0" style={{ background: 'var(--chat-bg)' }}>

          {/* Sub-header */}
          <div
            className="flex items-center gap-2 px-3 md:px-4 py-2 border-b border-[var(--chat-border)] shrink-0"
            style={{ background: 'var(--chat-header)' }}
          >
            {activeContact && (
              <>
                <div className="relative shrink-0">
                  <ContactAvatar contact={activeContact} size="sm" ringVar="--chat-header" />
                  {!isGroup && <StatusDot status={activeContact.status} borderVar="--chat-header" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[var(--chat-text)] leading-none">{activeContact.name}</p>
                  <p className="text-[10px] text-[var(--chat-muted)] mt-0.5">
                    {isGroup
                      ? `${activeContact.members?.length ?? 0} members`
                      : <span className="capitalize">{activeContact.status ?? 'offline'}</span>
                    }
                  </p>
                </div>
              </>
            )}
            <button className="w-6 h-6 rounded flex items-center justify-center text-[var(--chat-muted)] hover:text-[var(--chat-text)] hover:bg-[var(--chat-hover)] transition-colors ml-auto">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/><circle cx="5" cy="12" r="1.2"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-1 md:px-2 py-3 md:py-4">
            <ChatDialog messages={messages} className="max-w-full" />
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div
            className="shrink-0 px-3 md:px-4 py-2.5 md:py-3 border-t border-[var(--chat-border)]"
            style={{ background: 'var(--chat-header)' }}
          >
            <div
              className={cn(
                'flex items-center gap-2 rounded-xl px-3 py-2 border border-[var(--chat-border)] bg-[var(--chat-input-bg)] transition-colors',
                readonly ? 'opacity-40 cursor-not-allowed' : 'focus-within:border-[color-mix(in_oklch,var(--primary)_60%,transparent)]'
              )}
            >
              <button disabled={readonly} className="hidden sm:flex shrink-0 text-[var(--chat-muted)] disabled:pointer-events-none transition-colors hover:text-[var(--chat-text)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
              </button>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => !readonly && setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={readonly ? 'Read only' : (isGroup ? `Message ${activeContact?.name}…` : 'Message…')}
                disabled={readonly}
                className="flex-1 bg-transparent text-sm text-[var(--chat-text)] placeholder:text-[var(--chat-muted)] outline-none min-w-0 disabled:cursor-not-allowed"
              />

              <button disabled={readonly} className="hidden sm:flex shrink-0 text-[var(--chat-muted)] disabled:pointer-events-none transition-colors hover:text-[var(--chat-text)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
              </button>

              <motion.button
                whileTap={readonly ? {} : { scale: 0.9 }}
                onClick={sendMessage}
                disabled={readonly || !input.trim()}
                className={cn(
                  'shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all',
                  !readonly && input.trim()
                    ? 'bg-[var(--chat-bubble-me)] text-[var(--chat-bg)] hover:opacity-90'
                    : 'bg-[var(--chat-hover)] text-[var(--chat-muted)] cursor-not-allowed'
                )}
                aria-label="Send"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/>
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
