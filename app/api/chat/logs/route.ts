import { NextResponse } from "next/server";
import { getAnalyticsSummary, writeChatLog, readChatLogs } from "@/lib/ai/logger";
import { ChatAnalytics } from "@/types/chat";

/**
 * GET: Returns compiled metrics for the merchant dashboard
 */
export async function GET() {
  try {
    const summary = getAnalyticsSummary();
    return NextResponse.json(summary);
  } catch (error: any) {
    console.error("GET Chat Logs error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST: Accepts conversion updates or new session initializations
 */
export async function POST(req: Request) {
  try {
    const logData = await req.json() as Partial<ChatAnalytics> & { id: string };

    if (!logData.id) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    // Retrieve existing logs to check if the session is present
    const logs = readChatLogs();
    const existing = logs.find((l) => l.id === logData.id);

    const mergedLog: ChatAnalytics = {
      id: logData.id,
      timestamp: logData.timestamp || existing?.timestamp || new Date().toISOString(),
      userLanguage: logData.userLanguage || existing?.userLanguage || "English",
      modelUsed: logData.modelUsed || existing?.modelUsed || "openai-default",
      messagesCount: logData.messagesCount || existing?.messagesCount || 0,
      durationSeconds: logData.durationSeconds || existing?.durationSeconds || 10,
      intents: Array.from(new Set([...(existing?.intents || []), ...(logData.intents || [])])),
      searches: Array.from(new Set([...(existing?.searches || []), ...(logData.searches || [])])),
      recommendedProducts: Array.from(new Set([...(existing?.recommendedProducts || []), ...(logData.recommendedProducts || [])])),
      converted: logData.converted !== undefined ? logData.converted : (existing?.converted || false),
      messages: logData.messages || existing?.messages || [],
    };

    writeChatLog(mergedLog);

    return NextResponse.json({ success: true, log: mergedLog });
  } catch (error: any) {
    console.error("POST Chat Logs error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
