"use client";

import React from "react";
import { MessageCircle, Phone, Mail, Clock, ShieldAlert } from "lucide-react";

interface HandoffCardProps {
  contacts: {
    whatsapp: string;
    phone: string;
    email: string;
    timing: string;
  };
  message?: string;
}

export default function HandoffCard({ contacts, message }: HandoffCardProps) {
  return (
    <div className="rounded-2xl border border-luxury-stone/20 bg-luxury-cream shadow-sm p-4 font-sans text-luxury-charcoal flex flex-col gap-3.5 select-none mt-2">
      {/* Title Header */}
      <div className="flex gap-2.5 items-start">
        <div className="w-7 h-7 rounded-lg bg-luxury-gold/20 flex items-center justify-center text-luxury-gold shrink-0 border border-luxury-gold/30">
          <ShieldAlert size={14} />
        </div>
        <div className="flex-1">
          <h4 className="font-serif font-bold text-xs">Human Handoff Request</h4>
          <p className="text-[10px] text-luxury-stone font-semibold mt-0.5">
            {message || "We are transferring your inquiry to a dedicated concierge stylist."}
          </p>
        </div>
      </div>

      {/* Hand Off Action Contacts buttons */}
      <div className="flex flex-col gap-2 pt-2 border-t border-luxury-stone/10">
        {/* WhatsApp */}
        <a
          href={contacts.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/50 active:scale-95 transition-all text-xs font-semibold shadow-sm group"
        >
          <div className="flex items-center gap-2">
            <MessageCircle size={14} className="fill-emerald-800" />
            <span>Connect on WhatsApp</span>
          </div>
          <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider group-hover:translate-x-0.5 transition-transform">
            Direct Chat
          </span>
        </a>

        {/* Telephonic Concierge */}
        <a
          href={`tel:${contacts.phone.replace(/\s+/g, "")}`}
          className="flex items-center justify-between p-2.5 rounded-xl bg-luxury-warmWhite hover:bg-luxury-beige text-luxury-charcoal border border-luxury-stone/10 active:scale-95 transition-all text-xs font-semibold shadow-sm group"
        >
          <div className="flex items-center gap-2">
            <Phone size={14} className="fill-luxury-stone text-luxury-stone" />
            <span>Call Customer Styling Concierge</span>
          </div>
          <span className="text-[9px] text-luxury-gold font-bold uppercase tracking-wider group-hover:translate-x-0.5 transition-transform">
            {contacts.phone}
          </span>
        </a>

        {/* Email concierge */}
        <a
          href={`mailto:${contacts.email}?subject=${encodeURIComponent("Fashion Handloom Concierge Assistance Request")}`}
          className="flex items-center justify-between p-2.5 rounded-xl bg-luxury-warmWhite hover:bg-luxury-beige text-luxury-charcoal border border-luxury-stone/10 active:scale-95 transition-all text-xs font-semibold shadow-sm group"
        >
          <div className="flex items-center gap-2">
            <Mail size={14} />
            <span>Email styling team</span>
          </div>
          <span className="text-[9px] text-luxury-gold font-bold uppercase tracking-wider group-hover:translate-x-0.5 transition-transform truncate max-w-[120px]">
            {contacts.email}
          </span>
        </a>
      </div>

      {/* Operation Timings info */}
      <div className="flex items-center gap-2 text-[9px] text-luxury-stone font-semibold mt-1">
        <Clock size={11} />
        <span>Stylists active: {contacts.timing}</span>
      </div>
    </div>
  );
}
