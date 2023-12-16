import { allowedChannels } from '../channels.mjs';
import splitMessage from '../utils/splitMessage.js';
import transcribeVoiceMessage from '../utils/transcribeVoiceMessage.js';
import { INITIAL_PROMPT, FINAL_PROMPT, MAX_RETRIES, CHAT_GPT_ENABLED, PREV_MESSAGES_LIMIT, AI_NAME } from '../config.js';

async function messageCreate(message, client) {
  if (message.author.bot) return;
  if (!allowedChannels.includes(message.channel.id)) return;
  if (message.content.startsWith('!')) return;

  let transcribedContent = '';

  const voiceAttachment = message.attachments.find(attachment => attachment.name.endsWith('.ogg'));
  if (voiceAttachment) {
    try {
      transcribedContent = await transcribeVoiceMessage(voiceAttachment.url, process.env.API_KEY);
      console.log(`Transcribed voice message: "${transcribedContent}"`);
    } catch (error) {
      console.error('Error processing voice message:', error);
      await message.channel.send('An error occurred while processing the voice message.');
      return;
    }
  }

  if (message.content.toLowerCase().includes('merci')) {
    const emojis = ['❤️', '🧡', '🩷', '💚', '💙', '💜', '💝', '💖'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    try {
      await message.react(randomEmoji);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réaction:', error);
    }
  }

  console.log(`Received message: "${message.content}" from user: "${message.author.username}"`);

  if (CHAT_GPT_ENABLED) {
    let conversationLog = [
      { 
        role: 'system',
        content: INITIAL_PROMPT(AI_NAME, message.author.username)
      }
    ];

    try {
      let prevMessages = await message.channel.messages.fetch({ limit: PREV_MESSAGES_LIMIT });
      prevMessages = Array.from(prevMessages.values()).reverse();

      prevMessages.forEach((msg) => {
        if (msg.content.startsWith('!') || (msg.author.bot && msg.author.id !== client.user.id)) return;
        conversationLog.push({ role: 'user', content: msg.content });
      });

      conversationLog.push({
        role: 'system',
        content: FINAL_PROMPT
      });

      if (transcribedContent) {
        conversationLog.push({ role: 'user', content: transcribedContent });
      } else {
        conversationLog.push({ role: 'user', content: message.content });
      }

      if (client.currentModel === 'gpt-4-vision-preview' && message.attachments.size > 0) {
        const imageAttachment = message.attachments.first();
        let imageUrl = imageAttachment.url.split('?')[0];
        console.log(`Cleaned Image URL: ${imageUrl}`);
        conversationLog.push({
          role: 'user',
          content: [{ type: "text", text: message.content }, { type: "image_url", image_url: imageUrl }],
        });
      } else {
        conversationLog.push({ role: 'user', content: message.content });
      }

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

            if (client.currentModel === 'gpt-4-vision-preview') {
              requestPayload.max_tokens = 4096;
            }

            result = await client.openai.createChatCompletion(requestPayload);
            break;
          } catch (error) {
            attempts++;
            console.log(`OPENAI ERR (tentative ${attempts}): ${error}`);
            if (attempts === MAX_RETRIES) throw error;
          }
        }

        const messageContent = result.data.choices[0].message.content;
        const tokenUsage = result.data.usage.total_tokens;
        console.log(`Tokens used: ${tokenUsage}`);
        const messageParts = splitMessage(messageContent);
        for (const part of messageParts) {
          await message.channel.send(part);
        }

        clearInterval(typingInterval);

      } catch (error) {
        console.error('Error:', error);
        clearInterval(typingInterval);
        await handleApiErrors(message, error);
      }
    } catch (error) {
      console.log(`ERR: ${error}`);
      clearInterval(typingInterval);
      await handleApiErrors(message, error);
    }
  }
}

async function handleApiErrors(message, error) {
  if (error.response && error.response.status === 401) {
    message.channel.send("Problème d'authentification avec l'API OpenAI. Veuillez vérifier les clés d'API.");
  } else if (error.response && error.response.status === 429) {
    message.channel.send("Trop de demandes. Réessayez plus tard.");
  } else {
    message.channel.send("Erreur lors du traitement de la requête. Contactez Decrypt si le problème persiste.");
  }
}

export default messageCreate;
