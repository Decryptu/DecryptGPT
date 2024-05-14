import shouldIgnoreMessage from "../utils/shouldIgnoreMessage.js";
import reactWithRandomEmoji from "../utils/reactWithRandomEmoji.js";
import buildConversationLog from "../utils/buildConversationLog.js";
import respondToMessage from "../utils/respondToMessage.js";
import handleApiErrors from "../utils/handleApiErrors.js";
import { CHAT_GPT_ENABLED, THANK_YOU_KEYWORD } from "../config.js";

async function messageCreate(message, client) {
  if (shouldIgnoreMessage(message)) return;

  try {
    await processMessage(message, client);
  } catch (error) {
    console.error("Error processing message:", error);
    await handleApiErrors(message, error);
  }
}

async function processMessage(message, client) {
  console.log(`User Message: "${message.content}"`);

  if (message.content.toLowerCase().includes(THANK_YOU_KEYWORD)) {
    await reactWithRandomEmoji(message);
  }

  if (CHAT_GPT_ENABLED) {
    const conversationLog = await buildConversationLog(message, client);
    await respondToMessage(message, client, conversationLog);
  }
}

export default messageCreate;
