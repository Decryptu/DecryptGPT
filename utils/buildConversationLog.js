import {
  INITIAL_PROMPT,
  FINAL_PROMPT,
  PREV_MESSAGES_LIMIT,
  AI_NAME,
} from "../config.js";
import transcribeVoiceMessage from "./transcribeVoiceMessage.js";

async function buildConversationLog(message, client) {
  const conversationLog = [
    {
      role: "system",
      content: INITIAL_PROMPT(AI_NAME, message.author.username),
    },
  ];

  const prevMessages = await message.channel.messages.fetch({
    limit: PREV_MESSAGES_LIMIT,
  });
  const reversedMessages = Array.from(prevMessages.values()).reverse();

  for (const msg of reversedMessages) {
    if (
      msg.content.startsWith("!") ||
      (msg.author.bot && msg.author.id !== client.user.id)
    ) {
      continue;
    }

    const role = msg.author.id === client.user.id ? "assistant" : "user";

    conversationLog.push({
      role: role,
      content: msg.content,
    });
  }

  conversationLog.push({
    role: "system",
    content: FINAL_PROMPT(message.author.username),
  });

  const transcribedContent = await handleVoiceMessage(message);
  if (transcribedContent) {
    conversationLog.push({
      role: "user",
      content: transcribedContent,
    });
  }

  if (message.attachments.size > 0) {
    console.log(`Message contains ${message.attachments.size} attachments.`);
    const imageAttachments = Array.from(message.attachments.values())
      .filter((attachment) => !attachment.name.endsWith(".ogg"))
      .map((attachment) => {
        console.log(`Image attachment URL: ${attachment.url}`);
        return {
          type: "image_url",
          image_url: { url: attachment.url },
        };
      });

    if (imageAttachments.length > 0) {
      conversationLog.push({
        role: "user",
        content: [
          {
            type: "text",
            text: message.content,
          },
          ...imageAttachments,
        ],
      });
    }
  } else {
    conversationLog.push({
      role: "user",
      content: message.content,
    });
  }

  return conversationLog;
}

async function handleVoiceMessage(message) {
  const voiceAttachment = message.attachments.find((attachment) =>
    attachment.name.endsWith(".ogg")
  );
  if (!voiceAttachment) return null;

  try {
    console.log(`Voice message URL: ${voiceAttachment.url}`);
    const transcribedContent = await transcribeVoiceMessage(
      voiceAttachment.url,
      process.env.API_KEY
    );
    console.log(`Transcribed voice message: "${transcribedContent}"`);
    return transcribedContent;
  } catch (error) {
    console.error("Error transcribing voice message:", error);
    await message.channel.send(
      "An error occurred while processing the voice message."
    );
    return null;
  }
}

export default buildConversationLog;
