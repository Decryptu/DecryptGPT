// utils/buildInput.ts
import type { Message, Client } from "discord.js";
import { SYSTEM_PROMPT, PREV_MESSAGES_LIMIT } from "../config.js";
import transcribeVoiceMessage from "./transcribeVoiceMessage.js";

type MessageRole = "system" | "assistant" | "user";

interface TextContent {
  type: "input_text";
  text: string;
}

interface ImageContent {
  type: "input_image";
  image_url: string;
}

interface FileContent {
  type: "input_file";
  file_url: string;
}

type ContentItem = TextContent | ImageContent | FileContent;

interface InputMessage {
  role: MessageRole;
  content: string | ContentItem[];
}

async function buildInput(message: Message, client: Client): Promise<InputMessage[]> {
  const input: InputMessage[] = [];

  // Add system prompt
  input.push({
    role: "system",
    content: SYSTEM_PROMPT(message.author.username)
  });

  // Fetch previous messages
  const prevMessages = await message.channel.messages.fetch({
    limit: PREV_MESSAGES_LIMIT,
    before: message.id
  });

  const reversedMessages = Array.from(prevMessages.values()).reverse();
  let contextMessages = 0;
  let totalContextLength = 0;

  for (const msg of reversedMessages) {
    if (msg.content.startsWith("!") || (msg.author.bot && msg.author.id !== client.user?.id)) {
      continue;
    }

    // Clean up bot messages to remove sources section if present
    let messageContent = msg.content;
    if (msg.author.id === client.user?.id) {
      // Remove the **Sources:** section to avoid bloat
      const sourcesIndex = messageContent.indexOf("\n\n**Sources:**");
      if (sourcesIndex !== -1) {
        messageContent = messageContent.substring(0, sourcesIndex);
      }
    }

    input.push({
      role: msg.author.id === client.user?.id ? "assistant" : "user",
      content: messageContent
    });

    contextMessages++;
    totalContextLength += messageContent.length;
  }

  console.log(`[CONTEXT] Loaded ${contextMessages} messages (~${Math.round(totalContextLength / 4)} estimated tokens)`);

  // Handle current message with attachments
  const currentContent: ContentItem[] = [];
  let hasAttachments = false;

  // Add text content
  if (message.content) {
    currentContent.push({ type: "input_text", text: message.content });
  }

  // Handle voice messages
  const voiceAttachment = message.attachments.find(a => a.name?.endsWith(".ogg"));
  if (voiceAttachment && process.env.API_KEY) {
    try {
      console.log(`[VOICE] Transcribing voice message from ${message.author.username}`);
      const transcribed = await transcribeVoiceMessage(voiceAttachment.url, process.env.API_KEY);
      currentContent.push({ type: "input_text", text: `[Message vocal transcrit] ${transcribed}` });
      console.log(`[VOICE] Transcription: "${transcribed}"`);
    } catch (error) {
      console.error("[VOICE] Transcription error:", error);
    }
  }

  // Handle images and files
  for (const attachment of message.attachments.values()) {
    if (attachment.name?.endsWith(".ogg")) continue;

    if (attachment.contentType?.startsWith("image/")) {
      currentContent.push({
        type: "input_image",
        image_url: attachment.url
      });
      console.log(`[IMAGE] Processing image: ${attachment.name}`);
      hasAttachments = true;
    } else if (attachment.url) {
      // Let Responses API handle files directly
      currentContent.push({
        type: "input_file",
        file_url: attachment.url
      });
      console.log(`[FILE] Processing file: ${attachment.name}`);
      hasAttachments = true;
    }
  }

  // Add current message
  if (currentContent.length === 1 && currentContent[0].type === "input_text") {
    input.push({ role: "user", content: currentContent[0].text });
  } else if (currentContent.length > 0) {
    input.push({ role: "user", content: currentContent });
  }

  if (hasAttachments) {
    console.log(`[ATTACHMENTS] Processed ${message.attachments.size} attachment(s)`);
  }

  // Debug: Check if input is abnormally large
  const inputString = JSON.stringify(input);
  if (inputString.length > 50000) {
    console.warn(`[WARNING] Large input detected: ${inputString.length} characters`);
    console.log(`[DEBUG] Input structure: ${input.length} messages`);
    for (let i = 0; i < input.length; i++) {
      const msg = input[i];
      const contentLength = typeof msg.content === 'string'
        ? msg.content.length
        : JSON.stringify(msg.content).length;
      console.log(`[DEBUG] Message ${i}: role=${msg.role}, length=${contentLength}`);
    }
  }

  return input;
}

export default buildInput;
