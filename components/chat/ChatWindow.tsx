"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Sparkles,
  Volume2,
  VolumeX,
  Trash2,
  X,
  Mic,
  MicOff,
  Image as ImageIcon,
  Send,
  UploadCloud,
  ChevronRight,
  Globe,
  Settings2,
} from "lucide-react";
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/useSpeech";
import MessageList from "../messages/MessageList";

interface ChatWindowProps {
  onClose: () => void;
}

const LANGUAGES = [
  { name: "English", code: "en-IN" },
  { name: "Hindi (हिंदी)", code: "hi-IN" },
  { name: "Marathi (मराठी)", code: "mr-IN" },
  { name: "Gujarati (ગુજરાતી)", code: "gu-IN" },
  { name: "Tamil (தமிழ்)", code: "ta-IN" },
  { name: "Telugu (తెలుగు)", code: "te-IN" },
  { name: "Kannada (ಕನ್ನಡ)", code: "kn-IN" },
  { name: "Malayalam (മലയാളം)", code: "ml-IN" },
  { name: "Punjabi (ਪੰਜਾਬੀ)", code: "pa-IN" },
];

const QUICK_SUGGESTIONS = [
  "Suggest bedroom decor sets",
  "Show comforters under ₹5000",
  "Which blankets are warmest?",
  "Track order status",
];

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const [provider, setProvider] = useState<"openai" | "gemini" | "mock">("gemini");
  const [language, setLanguage] = useState("English");
  const [langCode, setLangCode] = useState("en-IN");
  const [sessionId, setSessionId] = useState("");
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [localInput, setLocalInput] = useState("");
  
  // Image Upload State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize session ID
  useEffect(() => {
    let id = sessionStorage.getItem("shopify_chat_session_id");
    if (!id) {
      id = "session_" + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("shopify_chat_session_id", id);
    }
    setSessionId(id);
  }, []);

  // Voice Inputs Hook
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition();
  const { isPlaying: isSpeaking, speak, stopSpeaking } = useSpeechSynthesis();

  // Vercel AI SDK useChat Hook — transport carries api + body
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({
          provider,
          sessionId,
          language,
          modelName:
            provider === "gemini"
              ? "gemini-2.5-flash"
              : provider === "openai"
              ? "gpt-4o-mini"
              : "mock-engine",
        }),
      }),
    [provider, sessionId, language],
  );

  const {
    messages,
    sendMessage,
    status,
    setMessages,
  } = useChat({
    transport,
    onFinish: (message) => {
      // Automatic Text-To-Speech if active and response streams in
      if (isTtsEnabled) {
        const text =
          message.parts
            ?.filter((p: any) => p.type === "text")
            .map((p: any) => p.text)
            .join("") ?? "";
        if (text) speak(text, langCode);
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Watch speech recognition transcript to fill input
  useEffect(() => {
    if (transcript) {
      setLocalInput(transcript);
    }
  }, [transcript]);

  // Handle TTS toggles
  const toggleTts = () => {
    const nextState = !isTtsEnabled;
    setIsTtsEnabled(nextState);
    if (!nextState) {
      stopSpeaking();
    } else if (messages.length > 0) {
      // Speak last response if activated retroactively
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "assistant") {
        speak(lastMsg.content, langCode);
      }
    }
  };

  // Handle Photo uploads
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      setUploadPreview(base64Url);
      setAttachments([
        {
          url: base64Url,
          name: file.name,
          contentType: file.type,
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setUploadPreview(null);
    setAttachments([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Process manual form submission
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!(localInput || "").trim() && attachments.length === 0) return;

    sendMessage({
      text: localInput,
      files: attachments.length > 0
        ? attachments.map((att) => ({
            type: "file",
            mediaType: att.contentType,
            filename: att.name,
            url: att.url,
          }))
        : undefined,
    });

    // Reset local input & attachments
    setLocalInput("");
    clearPhoto();
    setIsUploadOpen(false);
  };

  const handleQuickSuggestion = (text: string) => {
    sendMessage({ text });
  };

  const clearChat = () => {
    setMessages([]);
    stopSpeaking();
    setLocalInput("");
    // Reset session
    const nextId = "session_" + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("shopify_chat_session_id", nextId);
    setSessionId(nextId);
  };

  return (
    <div className="w-[400px] h-[600px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-100px)] rounded-3xl bg-luxury-cream/90 backdrop-blur-md border border-luxury-stone/20 shadow-luxury flex flex-col overflow-hidden text-luxury-charcoal relative">
      {/* Dynamic Header */}
      <div className="bg-luxury-charcoal text-luxury-warmWhite p-4 flex items-center justify-between border-b border-luxury-stone/30 select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-luxury-gold to-luxury-goldLight flex items-center justify-center shadow-inner relative">
            <Sparkles size={18} className="text-luxury-charcoal" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-luxury-charcoal" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-luxury-gold tracking-wide">Aura</h3>
            <p className="text-[10px] text-luxury-stone font-medium">Luxury Styling Consultant</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Clear Logs */}
          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg text-luxury-stone hover:text-red-400 transition-colors duration-200"
            title="Clear Chat Logs"
          >
            <Trash2 size={16} />
          </button>

          {/* Close Panel */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-luxury-stone hover:text-luxury-gold transition-colors duration-200"
            title="Close Assistant"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Model & Language Config Drawer */}
      {showConfig && (
        <div className="bg-luxury-beige border-b border-luxury-stone/10 p-3 text-xs flex flex-col gap-2 animate-fadeIn z-10 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-luxury-stone mb-1">
                AI Intelligence Provider
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as any)}
                className="w-full bg-luxury-warmWhite rounded-lg p-1.5 border border-luxury-stone/30 font-medium"
              >
                <option value="gemini">Google Gemini 2.5 (Fast)</option>
                <option value="openai">OpenAI GPT-4o-mini (Deep)</option>
                <option value="mock">Artisan Simulator (No Keys Required)</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-luxury-stone mb-1 flex items-center gap-1">
                <Globe size={10} /> Language
              </label>
              <select
                value={language}
                onChange={(e) => {
                  const name = e.target.value;
                  const item = LANGUAGES.find((l) => l.name === name);
                  setLanguage(name);
                  if (item) setLangCode(item.code);
                }}
                className="w-full bg-luxury-warmWhite rounded-lg p-1.5 border border-luxury-stone/30 font-medium"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.name} value={l.name}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Message List Area */}
      <div className="flex-1 overflow-hidden relative">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          onSuggestionClick={handleQuickSuggestion}
        />

        {/* Empty Chat State */}
        {messages.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-luxury-beige flex items-center justify-center text-luxury-gold mb-4 border border-luxury-stone/10 shadow-inner">
              <Sparkles size={28} />
            </div>
            <h4 className="font-serif font-bold text-lg mb-1 tracking-wide">Artisan Advisory</h4>
            <p className="text-xs text-luxury-stone max-w-xs leading-relaxed mb-6">
              Connect to Indian craftsmanship. Speak, upload pictures of your bedroom, or explore comforters and sheets.
            </p>

            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              {QUICK_SUGGESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickSuggestion(q)}
                  className="p-2.5 text-[10px] font-semibold text-left text-luxury-charcoal bg-luxury-warmWhite hover:bg-luxury-beige rounded-xl border border-luxury-stone/10 hover:border-luxury-gold/30 hover:-translate-y-0.5 transition-all duration-200 shadow-sm flex items-center justify-between group"
                >
                  <span>{q}</span>
                  <ChevronRight size={10} className="text-luxury-stone group-hover:text-luxury-gold transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Multimodal Upload Drawer */}
      {isUploadOpen && (
        <div className="bg-luxury-beige/90 border-t border-luxury-stone/20 p-4 animate-slideUp">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-luxury-stone flex items-center gap-1.5">
              <UploadCloud size={14} /> Room Analyzer
            </span>
            <button onClick={() => setIsUploadOpen(false)} className="text-luxury-stone hover:text-luxury-gold">
              <X size={14} />
            </button>
          </div>

          {!uploadPreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-luxury-stone/30 hover:border-luxury-gold rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-luxury-warmWhite/80 hover:bg-luxury-warmWhite transition-all duration-200 group"
            >
              <UploadCloud size={24} className="text-luxury-stone group-hover:text-luxury-gold mb-2 transition-colors" />
              <p className="text-[11px] font-semibold text-luxury-stone group-hover:text-luxury-charcoal">
                Drop your bedroom photo or Click to Browse
              </p>
              <p className="text-[9px] text-luxury-stone mt-1">Supports PNG, JPG (Max 5MB)</p>
            </div>
          ) : (
            <div className="flex items-center gap-4 bg-luxury-warmWhite p-2.5 rounded-xl border border-luxury-stone/10 shadow-sm relative">
              <img
                src={uploadPreview}
                alt="Upload Preview"
                className="w-16 h-16 object-cover rounded-lg border border-luxury-stone/10"
              />
              <div className="flex-1">
                <p className="text-[11px] font-bold text-luxury-charcoal truncate">Room analysis ready</p>
                <p className="text-[9px] text-luxury-stone mt-0.5">Let Aura inspect the style & colors</p>
              </div>
              <button
                onClick={clearPhoto}
                className="p-1 rounded-full bg-luxury-beige text-luxury-charcoal hover:bg-red-400 hover:text-luxury-warmWhite transition-colors"
                title="Remove photo"
              >
                <X size={12} />
              </button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}

      {/* Input Control Console */}
      <form
        onSubmit={handleFormSubmit}
        className="p-3 bg-luxury-warmWhite border-t border-luxury-stone/15 flex items-center gap-2 select-none relative"
      >
        {/* Attachment Switch */}
        <button
          type="button"
          onClick={() => setIsUploadOpen(!isUploadOpen)}
          className={`p-2 rounded-xl transition-colors ${
            isUploadOpen || uploadPreview
              ? "bg-luxury-gold text-luxury-charcoal"
              : "text-luxury-stone hover:text-luxury-gold hover:bg-luxury-beige"
          }`}
          title="Add bedroom photo for AI analysis"
        >
          <ImageIcon size={18} />
        </button>

        {/* Input Field */}
        <input
          type="text"
          value={localInput}
          onChange={(e) => setLocalInput(e.target.value)}
          placeholder={isListening ? "Listening to your voice..." : "Ask Aura about bedsheets, comforters..."}
          disabled={isListening}
          className="flex-grow p-2.5 text-xs bg-luxury-cream text-luxury-charcoal rounded-xl border border-luxury-stone/10 focus:border-luxury-gold focus:outline-none placeholder-luxury-stone/70 transition-all font-medium"
        />

        {/* Send Action */}
        <button
          type="submit"
          id="chat-submit-btn"
          disabled={isLoading || (!(localInput || "").trim() && attachments.length === 0)}
          className="p-2.5 rounded-xl bg-luxury-charcoal text-luxury-gold hover:bg-luxury-olive disabled:bg-luxury-beige disabled:text-luxury-stone transition-all shadow-md"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
