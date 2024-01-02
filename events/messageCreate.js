import { allowedChannels } from '../channels.mjs';
import splitMessage from '../utils/splitMessage.js';
import transcribeVoiceMessage from '../utils/transcribeVoiceMessage.js';
import {
  GPT_V, THANK_YOU_KEYWORD, EMOJI_LIST, INITIAL_PROMPT, FINAL_PROMPT, 
  MAX_RETRIES, CHAT_GPT_ENABLED, PREV_MESSAGES_LIMIT, AI_NAME 
} from '../config.js';

async function messageCreate(message, client) {
  if (shouldIgnoreMessage(message)) return;

  try {
    await processMessage(message, client);
  } catch (error) {
    console.error('Error processing message:', error);
    await handleApiErrors(message, error);
  }
}

function shouldIgnoreMessage(message) {
  return message.author.bot 
    || !allowedChannels.includes(message.channel.id) 
    || message.content.startsWith('!');
}

async function processMessage(message, client) {
  if (message.content.toLowerCase().includes(THANK_YOU_KEYWORD)) {
    await reactWithRandomEmoji(message);
  }

  if (CHAT_GPT_ENABLED) {
    const conversationLog = await buildConversationLog(message, client);
    await respondToMessage(message, client, conversationLog);
  }
}

async function reactWithRandomEmoji(message) {
  const randomEmoji = EMOJI_LIST[Math.floor(Math.random() * EMOJI_LIST.length)];
  try {
    await message.react(randomEmoji);
  } catch (error) {
    console.error('Error adding reaction:', error);
  }
}

async function buildConversationLog(message, client) {
  let conversationLog = [{ role: 'system', content: INITIAL_PROMPT(AI_NAME, message.author.username) }];
  
  // Add previous messages
  const prevMessages = await message.channel.messages.fetch({ limit: PREV_MESSAGES_LIMIT });
  prevMessages.reverse().forEach(msg => {
    if (msg.content.startsWith('!') || (msg.author.bot && msg.author.id !== client.user.id)) return;
    conversationLog.push({ role: 'user', content: msg.content });
  });

  conversationLog.push({ role: 'system', content: FINAL_PROMPT });

  // Handle voice or image messages
  const transcribedContent = await handleVoiceMessage(message);
  if (transcribedContent) {
    conversationLog.push({ role: 'user', content: transcribedContent });
  } else if (client.currentModel === GPT_V && message.attachments.size > 0) {
    const imageAttachment = message.attachments.first();
    const imageUrl = imageAttachment.url.split('?')[0];
    console.log(`Cleaned Image URL: ${imageUrl}`);
    conversationLog.push({
      role: 'user',
      content: [{ type: "text", text: message.content }, { type: "image_url", image_url: imageUrl }],
    });
  } else {
    conversationLog.push({ role: 'user', content: message.content });
  }

  return conversationLog;
}

async function handleVoiceMessage(message) {
  const voiceAttachment = message.attachments.find(attachment => attachment.name.endsWith('.ogg'));
  if (!voiceAttachment) return null;

  try {
    const transcribedContent = await transcribeVoiceMessage(voiceAttachment.url, process.env.API_KEY);
    console.log(`Transcribed voice message: "${transcribedContent}"`);
    return transcribedContent;
  } catch (error) {
    console.error('Error transcribing voice message:', error);
    await message.channel.send('An error occurred while processing the voice message.');
    return null;
  }
}

async function respondToMessage(message, client, conversationLog) {
  const typingInterval = setInterval(() => message.channel.sendTyping(), 5000);

  try {
    await message.channel.sendTyping();
    let attempts = 0;
    let result;

    while (attempts < MAX_RETRIES) {
      try {
        let requestPayload = {
          model: client.currentModel,
          messages: conversationLog,
        };

        if (client.currentModel === GPT_V) {
          requestPayload.max_tokens = 4096;
        }

        result = await client.openai.chat.completions.create(requestPayload);
        break;
      } catch (error) {
        attempts++;
        console.log(`OPENAI ERR (attempt ${attempts}): ${error}`);
        if (attempts === MAX_RETRIES) throw error;
      }
    }

    const messageContent = result.choices[0].message.content;
    const tokenUsage = result.usage.total_tokens;
    console.log(`Tokens used: ${tokenUsage}`);
    const messageParts = splitMessage(messageContent);
    for (const part of messageParts) {
      await message.channel.send(part);
    }
  } catch (error) {
    console.error('Error:', error);
    await handleApiErrors(message, error);
  } finally {
    clearInterval(typingInterval);
  }
}

async function handleApiErrors(message, error) {
  if (error.response && error.response.status === 401) {
    await message.channel.send("Authentication issue with the OpenAI API. Please check the API keys.");
  } else if (error.response && error.response.status === 429) {
    await message.channel.send("Too many requests. Please try again later.");
  } else {
    await message.channel.send("An error occurred while processing your request. Please contact Decrypt if the problem persists.");
  }
}

export default messageCreate;
