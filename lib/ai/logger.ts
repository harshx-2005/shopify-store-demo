import fs from "fs";
import path from "path";
import { ChatAnalytics } from "@/types/chat";

const LOG_FILE_PATH = path.join(process.cwd(), "lib", "chat-logs.json");

/**
 * Initialize log file if it doesn't exist
 */
function initLogFile() {
  const dir = path.dirname(LOG_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LOG_FILE_PATH)) {
    fs.writeFileSync(LOG_FILE_PATH, JSON.stringify([], null, 2), "utf8");
  }
}

/**
 * Read all logs from the JSON file
 */
export function readChatLogs(): ChatAnalytics[] {
  try {
    initLogFile();
    const data = fs.readFileSync(LOG_FILE_PATH, "utf8");
    return JSON.parse(data) as ChatAnalytics[];
  } catch (error) {
    console.error("Failed to read chat logs:", error);
    return [];
  }
}

/**
 * Save a new log or update an existing log by ID
 */
export function writeChatLog(newLog: ChatAnalytics): void {
  try {
    initLogFile();
    const logs = readChatLogs();
    const existingIndex = logs.findIndex((l) => l.id === newLog.id);

    if (existingIndex !== -1) {
      // Merge or update
      logs[existingIndex] = {
        ...logs[existingIndex],
        ...newLog,
        // Ensure lists merge uniquely
        intents: Array.from(new Set([...logs[existingIndex].intents, ...newLog.intents])),
        searches: Array.from(new Set([...logs[existingIndex].searches, ...newLog.searches])),
        recommendedProducts: Array.from(new Set([...logs[existingIndex].recommendedProducts, ...newLog.recommendedProducts])),
        // If converted once, keep true
        converted: logs[existingIndex].converted || newLog.converted,
      };
    } else {
      logs.push(newLog);
    }

    fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logs, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to write chat log:", error);
  }
}

/**
 * Fetch computed metrics for the admin dashboard
 */
export function getAnalyticsSummary() {
  const logs = readChatLogs();
  
  const totalSessions = logs.length;
  const convertedSessions = logs.filter((l) => l.converted).length;
  const conversionRate = totalSessions > 0 ? (convertedSessions / totalSessions) * 100 : 0;
  
  let totalMessages = 0;
  const languages: Record<string, number> = {};
  const modelUsage: Record<string, number> = {};
  const intentsCount: Record<string, number> = {};
  const popularSearches: Record<string, number> = {};
  const recommendationsCount: Record<string, number> = {};

  logs.forEach((log) => {
    totalMessages += log.messagesCount;
    
    // Lang
    languages[log.userLanguage] = (languages[log.userLanguage] || 0) + 1;
    
    // Model
    modelUsage[log.modelUsed] = (modelUsage[log.modelUsed] || 0) + 1;
    
    // Intents
    log.intents.forEach((intent) => {
      intentsCount[intent] = (intentsCount[intent] || 0) + 1;
    });

    // Searches
    log.searches.forEach((search) => {
      const clean = search.toLowerCase().trim();
      if (clean) popularSearches[clean] = (popularSearches[clean] || 0) + 1;
    });

    // Recommended
    log.recommendedProducts.forEach((prod) => {
      recommendationsCount[prod] = (recommendationsCount[prod] || 0) + 1;
    });
  });

  const averageMessages = totalSessions > 0 ? totalMessages / totalSessions : 0;

  return {
    totalSessions,
    convertedSessions,
    conversionRate: Math.round(conversionRate * 10) / 10,
    totalMessages,
    averageMessages: Math.round(averageMessages * 10) / 10,
    languages,
    modelUsage,
    topIntents: Object.entries(intentsCount).sort((a, b) => b[1] - a[1]).slice(0, 5),
    topSearches: Object.entries(popularSearches).sort((a, b) => b[1] - a[1]).slice(0, 5),
    topRecommendations: Object.entries(recommendationsCount).sort((a, b) => b[1] - a[1]).slice(0, 5),
    recentLogs: logs.slice(-10).reverse(), // Last 10 sessions
  };
}
