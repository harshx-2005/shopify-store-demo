"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X } from "lucide-react";
import ChatWindow from "./ChatWindow";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show a gentle greeting tooltip after 4 seconds to catch customer attention
    const timer = setTimeout(() => {
      const chatDismissed = sessionStorage.getItem("chat_tooltip_dismissed");
      if (!chatDismissed && !isOpen) {
        setShowTooltip(true);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (showTooltip) {
      setShowTooltip(false);
      sessionStorage.setItem("chat_tooltip_dismissed", "true");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Dynamic Conversation Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4"
          >
            <ChatWindow onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Greeting Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-20 right-0 mb-2 w-72 rounded-2xl bg-luxury-charcoal text-luxury-warmWhite p-4 shadow-luxury hover:shadow-luxuryHover transition-shadow duration-300 border border-luxury-stone/20"
          >
            <button
              onClick={() => {
                setShowTooltip(false);
                sessionStorage.setItem("chat_tooltip_dismissed", "true");
              }}
              className="absolute top-2 right-2 text-luxury-stone hover:text-luxury-gold transition-colors"
            >
              <X size={14} />
            </button>
            <div className="pr-4">
              <p className="text-xs font-semibold text-luxury-gold uppercase tracking-wider mb-1">
                Personal Decor Advisor
              </p>
              <p className="text-sm font-medium leading-relaxed">
                Namaste! Looking to redesign your bedroom? Let me help you find the perfect matching bedding.
              </p>
            </div>
            <div className="absolute right-6 -bottom-2 w-4 h-4 bg-luxury-charcoal rotate-45 border-r border-b border-luxury-stone/20" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        suppressHydrationWarning
        className="flex h-14 w-14 items-center justify-center rounded-full bg-luxury-charcoal text-luxury-gold shadow-luxury hover:bg-luxury-olive border border-luxury-gold/30 relative"
        aria-label="Toggle Shopping Assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6 text-luxury-warmWhite" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageSquare className="h-6 w-6" />
              {/* Pulse Online Indicator */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
