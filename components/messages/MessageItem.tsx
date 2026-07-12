"use client";

import React from "react";
import { Sparkles, User } from "lucide-react";
import ProductCard from "../cards/ProductCard";
import ProductCompare from "../cards/ProductCompare";
import OrderCard from "../cards/OrderCard";
import HandoffCard from "../cards/HandoffCard";
import { ChatMessage } from "@/types/chat";

interface MessageItemProps {
  message: ChatMessage & { toolInvocations?: any[]; parts?: any[] };
  onSuggestionClick: (text: string) => void;
}

// ============================================================================
// VERCEL AI SDK V4.0+ / V7.0+ COMPATIBILITY HELPERS
// ============================================================================

/**
 * Extract message text safely from either message.content or message.parts
 */
function getMessageText(message: any): string {
  if (message.content) return message.content;
  if (!message.parts) return "";
  return message.parts
    .filter((part: any) => part.type === "text")
    .map((part: any) => part.text)
    .join("");
}

/**
 * Extract attachments safely from either message.attachments or message.parts
 */
function getMessageAttachments(message: any): any[] {
  if (message.attachments) return message.attachments;
  if (!message.parts) return [];
  return message.parts
    .filter((part: any) => part.type === "file")
    .map((part: any) => ({
      url: part.url,
      name: part.filename,
      contentType: part.mediaType,
    }));
}

/**
 * Extract tool invocations safely from either message.toolInvocations or message.parts
 */
function getMessageToolInvocations(message: any): any[] {
  if (message.toolInvocations) return message.toolInvocations;
  if (!message.parts) return [];
  
  // Find all parts where the type starts with 'tool-' or is 'dynamic-tool'
  return message.parts
    .filter((part: any) => (part.type && part.type.startsWith("tool-")) || part.type === "dynamic-tool")
    .map((part: any) => {
      const toolName = part.type === "dynamic-tool" ? part.toolName : part.type.substring(5);
      return {
        toolCallId: part.toolCallId,
        toolName: toolName,
        args: part.input,
        state: part.state === "output-available" ? "result" : "call",
        result: part.output,
      };
    });
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function MessageItem({ message, onSuggestionClick }: MessageItemProps) {
  const isAssistant = message.role === "assistant";
  
  // Extract values using SDK compatibility helpers
  const messageText = getMessageText(message);
  const messageAttachments = getMessageAttachments(message);
  const messageToolInvocations = getMessageToolInvocations(message);

  // Custom Regex Markdown Parser for lightweight, secure rich text
  const parseMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      let parsed = line;
      // Bold **text**
      parsed = parsed.replace(/\*\*([^*]+)\*\*/g, "<strong class='font-bold text-luxury-charcoal'>$1</strong>");
      // Italic *text*
      parsed = parsed.replace(/\*([^*]+)\*/g, "<em class='italic'>$1</em>");
      // Inline Code `code`
      parsed = parsed.replace(/`([^`]+)`/g, "<code class='bg-luxury-beige px-1.5 py-0.5 rounded font-mono text-[10px] text-luxury-olive'>$1</code>");
      // Markdown links [label](url)
      parsed = parsed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2' target='_blank' class='text-luxury-gold underline hover:text-luxury-olive font-semibold transition-colors'>$1</a>");

      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li
            key={idx}
            className="ml-4 list-disc text-xs leading-relaxed mb-1"
            dangerouslySetInnerHTML={{ __html: parsed.substring(2) }}
          />
        );
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p
          key={idx}
          className="text-xs leading-relaxed mb-1.5"
          dangerouslySetInnerHTML={{ __html: parsed }}
        />
      );
    });
  };

  const getTimestampStr = () => {
    if (message.createdAt) {
      try {
        return new Date(message.createdAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
      } catch (e) {}
    }
    if (message.timestamp) {
      try {
        return new Date(message.timestamp).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
      } catch (e) {}
    }
    return new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  };
  const timestampStr = getTimestampStr();

  return (
    <div className={`flex gap-3 w-full ${isAssistant ? "justify-start" : "justify-end"}`}>
      {/* Bot Avatar */}
      {isAssistant && (
        <div className="w-8 h-8 rounded-full bg-luxury-charcoal flex items-center justify-center text-luxury-gold shadow-sm shrink-0 border border-luxury-gold/20 select-none">
          <Sparkles size={13} />
        </div>
      )}

      {/* Message Content Bubble */}
      <div className={`flex flex-col gap-1.5 max-w-[80%]`}>
        {/* Render text response */}
        {messageText && (
          <div
            className={`p-3 rounded-2xl shadow-sm border ${
              isAssistant
                ? "bg-luxury-warmWhite border-luxury-stone/10 rounded-tl-none"
                : "bg-luxury-charcoal text-luxury-warmWhite border-luxury-stone/20 rounded-tr-none"
            }`}
          >
            {parseMarkdown(messageText)}

            {/* Attachments rendering */}
            {messageAttachments && messageAttachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-luxury-stone/10">
                {messageAttachments.map((att: any, i: number) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border border-luxury-stone/20 shadow-sm">
                    <img src={att.url} alt="User attachment" className="w-24 h-24 object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* If no text but has user attachments */}
        {!messageText && messageAttachments && messageAttachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {messageAttachments.map((att: any, i: number) => (
              <div key={i} className="relative group rounded-lg overflow-hidden border border-luxury-stone/20 shadow-sm">
                <img src={att.url} alt="User attachment" className="w-24 h-24 object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Tool Invocation Results Card mapping */}
        {messageToolInvocations &&
          messageToolInvocations.map((tool: any) => {
            const { toolCallId, toolName, state, result } = tool;
            if (state !== "result") return null;

            switch (toolName) {
              case "searchProducts":
              case "getCollectionProducts":
                const products = result?.products || [];
                if (products.length === 0) {
                  return (
                    <div key={toolCallId} className="p-3 text-xs bg-luxury-beige border rounded-xl text-luxury-stone italic">
                      No matching products found in the catalog.
                    </div>
                  );
                }
                return (
                  <div key={toolCallId} className="w-full flex flex-col gap-2 overflow-x-auto pb-2 scrollbar-none mt-1">
                    <div className="flex gap-3 w-max">
                      {products.map((p: any) => (
                        <div key={p.id} className="w-64">
                          <ProductCard product={p} />
                        </div>
                      ))}
                    </div>
                  </div>
                );

              case "getProductDetails":
                const prod = result?.product;
                const rec = result?.recommended || [];
                if (!prod) return null;
                return (
                  <div key={toolCallId} className="w-full flex flex-col gap-3 mt-1">
                    <ProductCard product={prod} detailMode />
                    {rec.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-luxury-stone px-1">
                          Complements this beautifully:
                        </span>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                          <div className="flex gap-3 w-max">
                            {rec.map((r: any) => (
                              <div key={r.id} className="w-56">
                                <ProductCard product={r} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );

              case "compareProducts":
                if (!result?.products || result.products.length === 0) return null;
                return (
                  <div key={toolCallId} className="w-full mt-1">
                    <ProductCompare products={result.products} features={result.features} />
                  </div>
                );

              case "trackOrder":
                if (result?.error) {
                  return (
                    <div key={toolCallId} className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 mt-1 font-semibold">
                      {result.error}
                    </div>
                  );
                }
                if (!result?.order) return null;
                return (
                  <div key={toolCallId} className="w-full mt-1">
                    <OrderCard order={result.order} />
                  </div>
                );

              case "handleHandoff":
                if (!result?.contacts) return null;
                return (
                  <div key={toolCallId} className="w-full mt-1">
                    <HandoffCard contacts={result.contacts} message={result.message} />
                  </div>
                );

              default:
                return null;
            }
          })}

        {/* Suggestion Questions rendering */}
        {isAssistant && message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {message.suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => onSuggestionClick(q)}
                className="px-2.5 py-1 text-[10px] font-semibold bg-luxury-warmWhite hover:bg-luxury-beige text-luxury-charcoal rounded-full border border-luxury-stone/15 hover:border-luxury-gold/50 shadow-sm transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className={`text-[9px] text-luxury-stone font-medium px-1.5 ${!isAssistant && "text-right"}`}>
          {timestampStr}
        </span>
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="w-8 h-8 rounded-full bg-luxury-gold text-luxury-charcoal flex items-center justify-center font-bold shadow-sm shrink-0 border border-luxury-stone/10 select-none">
          <User size={13} />
        </div>
      )}
    </div>
  );
}
