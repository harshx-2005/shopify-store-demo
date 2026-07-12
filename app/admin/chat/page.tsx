"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Globe,
  Compass,
  Search,
  CheckCircle,
  Eye,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
  Clock,
} from "lucide-react";

export default function ChatAdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<any>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat/logs");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Failed to load logs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-luxury-cream p-8 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={24} className="animate-spin text-luxury-gold" />
          <p className="text-xs font-semibold text-luxury-stone">Loading merchant analytics...</p>
        </div>
      </div>
    );
  }

  const {
    totalSessions = 0,
    convertedSessions = 0,
    conversionRate = 0,
    totalMessages = 0,
    averageMessages = 0,
    languages = {},
    modelUsage = {},
    topIntents = [],
    topSearches = [],
    topRecommendations = [],
    recentLogs = [],
  } = data || {};

  return (
    <div className="min-h-screen bg-luxury-cream text-luxury-charcoal p-6 lg:p-10 font-sans select-none">
      {/* Title Panel */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-luxury-gold">
            Aura Shop Assistant
          </span>
          <h1 className="font-serif font-bold text-2xl lg:text-3xl tracking-wide mt-1 text-luxury-charcoal">
            Merchant AI Console
          </h1>
          <p className="text-xs text-luxury-stone mt-1 leading-relaxed">
            Monitor advisor performance, customer intents, and shop conversion metrics in real-time.
          </p>
        </div>
        
        <button
          onClick={fetchLogs}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-luxury-charcoal hover:bg-luxury-olive text-luxury-gold text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Metrics Summary Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Sessions */}
        <div className="bg-luxury-warmWhite border border-luxury-stone/10 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-luxury-stone tracking-wider">Total Sessions</p>
            <h3 className="text-2xl font-bold mt-1 text-luxury-charcoal">{totalSessions}</h3>
            <p className="text-[9px] text-luxury-stone font-semibold mt-1">Unique shoppers engaged</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-luxury-beige flex items-center justify-center text-luxury-stone shadow-inner">
            <MessageSquare size={18} />
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-luxury-warmWhite border border-luxury-gold/30 p-5 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-luxury-gold/5 rounded-full -mr-8 -mt-8" />
          <div className="z-10">
            <p className="text-[10px] uppercase font-bold text-luxury-stone tracking-wider">AI Conversion Rate</p>
            <h3 className="text-2xl font-bold mt-1 text-luxury-charcoal">{conversionRate}%</h3>
            <p className="text-[9px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
              <TrendingUp size={10} />
              <span>{convertedSessions} checkouts initiated</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-luxury-gold/20 flex items-center justify-center text-luxury-gold shadow-inner shrink-0 z-10 border border-luxury-gold/30">
            <ShoppingBag size={18} />
          </div>
        </div>

        {/* Avg Message length */}
        <div className="bg-luxury-warmWhite border border-luxury-stone/10 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-luxury-stone tracking-wider">Interaction Depth</p>
            <h3 className="text-2xl font-bold mt-1 text-luxury-charcoal">{averageMessages} msgs</h3>
            <p className="text-[9px] text-luxury-stone font-semibold mt-1">Average conversation length</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-luxury-beige flex items-center justify-center text-luxury-stone shadow-inner">
            <Clock size={18} />
          </div>
        </div>

        {/* Total messages processed */}
        <div className="bg-luxury-warmWhite border border-luxury-stone/10 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-luxury-stone tracking-wider">Messages Routed</p>
            <h3 className="text-2xl font-bold mt-1 text-luxury-charcoal">{totalMessages}</h3>
            <p className="text-[9px] text-luxury-stone font-semibold mt-1">Total inputs generated</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-luxury-beige flex items-center justify-center text-luxury-stone shadow-inner">
            <BarChart3 size={18} />
          </div>
        </div>
      </div>

      {/* Main Analytics Panels split layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Trends & Intent Statistics */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Top Searches */}
          <div className="bg-luxury-warmWhite border border-luxury-stone/10 rounded-2xl p-5 shadow-sm">
            <h3 className="font-serif font-bold text-sm tracking-wide text-luxury-charcoal mb-4 flex items-center gap-2">
              <Search size={14} className="text-luxury-gold" />
              <span>Popular Shopper Queries</span>
            </h3>
            {topSearches.length === 0 ? (
              <p className="text-xs text-luxury-stone italic py-2">No queries logged yet.</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {topSearches.map(([term, count]: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="font-medium bg-luxury-beige px-2 py-1 rounded-lg text-luxury-charcoal">
                      "{term}"
                    </span>
                    <span className="text-[10px] text-luxury-stone font-bold uppercase">
                      {count} {count === 1 ? "Search" : "Searches"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Recommendations */}
          <div className="bg-luxury-warmWhite border border-luxury-stone/10 rounded-2xl p-5 shadow-sm">
            <h3 className="font-serif font-bold text-sm tracking-wide text-luxury-charcoal mb-4 flex items-center gap-2">
              <Compass size={14} className="text-luxury-gold" />
              <span>Bestsellers Recommended</span>
            </h3>
            {topRecommendations.length === 0 ? (
              <p className="text-xs text-luxury-stone italic py-2">No product recommendations yet.</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {topRecommendations.map(([prod, count]: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="font-medium text-luxury-charcoal truncate max-w-[180px]">
                      {prod}
                    </span>
                    <span className="text-[10px] text-luxury-stone font-bold uppercase shrink-0">
                      Shown {count}x
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Languages & Models */}
          <div className="bg-luxury-warmWhite border border-luxury-stone/10 rounded-2xl p-5 shadow-sm grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-serif font-bold text-xs mb-3 flex items-center gap-1.5">
                <Globe size={12} className="text-luxury-gold" />
                <span>Languages</span>
              </h4>
              <div className="flex flex-col gap-1.5 text-[10px]">
                {Object.entries(languages).map(([name, val]: any, i) => (
                  <div key={i} className="flex justify-between font-medium">
                    <span>{name}</span>
                    <span className="text-luxury-stone">{val}</span>
                  </div>
                ))}
                {Object.keys(languages).length === 0 && <span className="text-luxury-stone italic">None</span>}
              </div>
            </div>

            <div>
              <h4 className="font-serif font-bold text-xs mb-3 flex items-center gap-1.5">
                <Sparkles size={12} className="text-luxury-gold" />
                <span>LLM Engine</span>
              </h4>
              <div className="flex flex-col gap-1.5 text-[10px]">
                {Object.entries(modelUsage).map(([name, val]: any, i) => (
                  <div key={i} className="flex justify-between font-medium truncate">
                    <span className="truncate max-w-[90px]">{name}</span>
                    <span className="text-luxury-stone">{val}</span>
                  </div>
                ))}
                {Object.keys(modelUsage).length === 0 && <span className="text-luxury-stone italic">None</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Conversation Logs Audit Feed */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-luxury-warmWhite border border-luxury-stone/10 rounded-2xl p-5 shadow-sm flex-1 flex flex-col">
            <h3 className="font-serif font-bold text-sm tracking-wide text-luxury-charcoal mb-4">
              Real-time Conversation Logs
            </h3>
            
            <div className="flex-grow overflow-y-auto max-h-[500px] flex flex-col gap-3 pr-2 scrollbar-thin">
              {recentLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center text-luxury-stone">
                  <MessageSquare size={32} className="mb-2 opacity-55" />
                  <p className="text-xs italic">No conversations recorded yet. Initiate chat via storefront widget.</p>
                </div>
              ) : (
                recentLogs.map((log: any) => (
                  <div
                    key={log.id}
                    className="p-3 bg-luxury-cream rounded-xl border border-luxury-stone/10 hover:border-luxury-gold/50 cursor-pointer transition-all flex items-center justify-between gap-4"
                    onClick={() => setActiveSession(log)}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-luxury-charcoal font-mono truncate max-w-[120px]">
                          {log.id}
                        </span>
                        <span className="text-[8px] bg-luxury-beige px-1.5 py-0.5 rounded text-luxury-stone font-semibold">
                          {log.userLanguage}
                        </span>
                        {log.converted && (
                          <span className="text-[8px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 px-1.5 rounded flex items-center gap-0.5">
                            <CheckCircle size={8} />
                            <span>Converted</span>
                          </span>
                        )}
                      </div>
                      
                      {/* Last Message preview */}
                      <p className="text-[10px] text-luxury-stone mt-1 truncate max-w-[280px]">
                        Last: {log.messages?.[log.messages.length - 1]?.content || "No content"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[8px] text-luxury-stone font-bold">
                        {new Date(log.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                      <button className="p-1.5 rounded-lg bg-luxury-warmWhite text-luxury-stone hover:text-luxury-gold border border-luxury-stone/5 hover:border-luxury-gold/30">
                        <Eye size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Drawer Overlay */}
      {activeSession && (
        <div className="fixed inset-0 bg-luxury-charcoal/45 backdrop-blur-sm z-50 flex items-center justify-end p-4">
          <div className="w-[500px] max-w-full h-full bg-luxury-cream shadow-2xl border-l border-luxury-stone/20 rounded-l-3xl overflow-hidden flex flex-col animate-slideLeft">
            
            {/* Header */}
            <div className="bg-luxury-charcoal text-luxury-warmWhite p-4 flex items-center justify-between border-b border-luxury-stone/30 select-none">
              <div>
                <h3 className="font-serif font-bold text-sm text-luxury-gold">Session Details</h3>
                <p className="text-[9px] text-luxury-stone mt-0.5 font-mono">{activeSession.id}</p>
              </div>
              <button
                onClick={() => setActiveSession(null)}
                className="p-1.5 text-luxury-stone hover:text-luxury-gold rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Session statistics metadata */}
            <div className="bg-luxury-beige/60 p-4 border-b border-luxury-stone/10 grid grid-cols-3 gap-2 text-center text-[10px]">
              <div>
                <p className="text-luxury-stone font-semibold">Language</p>
                <p className="font-bold text-luxury-charcoal mt-0.5">{activeSession.userLanguage}</p>
              </div>
              <div>
                <p className="text-luxury-stone font-semibold">Conversations</p>
                <p className="font-bold text-luxury-charcoal mt-0.5">{activeSession.messagesCount} message(s)</p>
              </div>
              <div>
                <p className="text-luxury-stone font-semibold">Intents Detected</p>
                <div className="flex justify-center flex-wrap gap-0.5 mt-0.5">
                  {activeSession.intents?.map((int: string, i: number) => (
                    <span key={i} className="bg-luxury-gold/25 text-luxury-charcoal text-[7px] font-bold px-1 rounded-sm">
                      {int}
                    </span>
                  ))}
                  {(!activeSession.intents || activeSession.intents.length === 0) && (
                    <span className="text-luxury-stone font-semibold">-</span>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Transcript bubble viewport */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-luxury-cream/50">
              {activeSession.messages?.map((msg: any, i: number) => {
                const isBot = msg.role === "assistant";
                return (
                  <div key={i} className={`flex flex-col gap-1 w-full ${isBot ? "items-start" : "items-end"}`}>
                    <span className="text-[8px] uppercase font-bold text-luxury-stone tracking-wide px-1.5">
                      {isBot ? "Aura" : "Customer"}
                    </span>
                    <div
                      className={`p-3 rounded-2xl text-[11px] leading-relaxed shadow-sm border max-w-[85%] ${
                        isBot
                          ? "bg-luxury-warmWhite border-luxury-stone/10 rounded-tl-none text-luxury-charcoal"
                          : "bg-luxury-charcoal text-luxury-warmWhite border-luxury-stone/20 rounded-tr-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Footer details */}
            <div className="bg-luxury-warmWhite p-4 border-t border-luxury-stone/10 text-center text-[10px] text-luxury-stone font-semibold">
              Logged at {new Date(activeSession.timestamp).toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Close Icon wrapper
function X({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
