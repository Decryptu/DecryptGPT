// events/messageCreate.js
import shouldIgnoreMessage from "../utils/shouldIgnoreMessage.js";
import reactWithRandomEmoji from "../utils/reactWithRandomEmoji.js";
import buildInput from "../utils/buildInput.js";
import respondToMessage from "../utils/respondToMessage.js";
import handleApiErrors from "../utils/handleApiErrors.js";
import { CHAT_GPT_ENABLED, THANK_YOU_KEYWORD } from "../config.js";

async function messageCreate(message, client) {
  if (shouldIgnoreMessage(message)) return;

  try {
    console.log(`[MESSAGE] ${message.author.username}: "${message.content}"`);

    if (message.content.toLowerCase().includes(THANK_YOU_KEYWORD)) {
      await reactWithRandomEmoji(message);
    }

    if (CHAT_GPT_ENABLED) {
      const input = await buildInput(message, client);
      await respondToMessage(message, client, input);
    }
  } catch (error) {
    console.error("[MESSAGE ERROR]", error);
    await handleApiErrors(message, error);
  }
}

export default messageCreate;