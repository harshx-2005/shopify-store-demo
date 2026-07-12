"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import MessageItem from "./MessageItem";

interface MessageListProps {
  messages: any[];
  isLoading: boolean;
  onSuggestionClick: (text: string) => void;
}

export default function MessageList({ messages, isLoading, onSuggestionClick }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages or loading transitions
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="w-full h-full overflow-y-auto px-4 py-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-luxury-stone/20 scrollbar-track-transparent">
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <motion.div
            key={message.id || index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MessageItem
              message={message}
              onSuggestionClick={onSuggestionClick}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Luxury Thinking/Typing Indicator */}
      {isLoading && messages[messages.length - 1]?.role === "user" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 justify-start items-start select-none"
        >
          <div className="w-8 h-8 rounded-full bg-luxury-charcoal flex items-center justify-center text-luxury-gold shadow-sm shrink-0 border border-luxury-gold/20">
            <Sparkles size={13} className="animate-spin duration-3000" />
          </div>
          <div className="flex flex-col gap-1.5 max-w-[75%]">
            <div className="bg-luxury-beige/60 border border-luxury-stone/10 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-luxury-gold animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-luxury-gold animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-luxury-gold animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-[9px] text-luxury-stone font-medium px-1">
              Consulting Shopify catalog...
            </span>
          </div>
        </motion.div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
