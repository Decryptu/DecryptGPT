import { Client, IntentsBitField, Partials } from 'discord.js';
import { Configuration, OpenAIApi } from 'openai';
import { allowedChannels } from './channels.mjs';
import express from 'express';
import 'dotenv/config.js';

const app = express();
const PORT = process.env.PORT || 3000;
const MAX_RETRIES = 3;
const chatGptEnabled = true;

app.get('/', (req, res) => {
  res.send('Edgar is alive!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.DirectMessageReactions,
    IntentsBitField.Flags.DirectMessageTyping,
  ],
  partials: [
    Partials.Channel,
    Partials.Reaction,
    Partials.Message
  ],
  debug: true,
});

client.on('ready', async () => {
  console.log('Edgar is online!');
  setBotActivity(currentModel);

  await client.application.commands.create({
    name: 'gpt4',
    description: 'Passer au modèle GPT-4',
  });

  await client.application.commands.create({
    name: 'gpt3',
    description: 'Passer au modèle GPT-3.5',
  });

  await client.application.commands.create({
    name: 'gpt-vision',
    description: 'Passer au modèle GPT-4 Vision',
  });
});

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

function splitMessage(content, maxLength = 2000) {
  let contentStr = typeof content === 'string' ? content : JSON.stringify(content);
  const parts = [];

  while (contentStr.length > 0) {
    let part = contentStr.slice(0, maxLength);
    contentStr = contentStr.slice(maxLength);
    parts.push(part);
  }

  return parts;
}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!allowedChannels.includes(message.channel.id)) return;
  if (message.content.startsWith('!')) return;

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
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Paris'
  };
  const formatter = new Intl.DateTimeFormat('fr-FR', options);
  const formattedDate = formatter.format(new Date());
  
  if (chatGptEnabled) {
    let conversationLog = [
      { 
        role: 'system',
        content: `Tu es Edgar, l'assistant personnel de ${message.author.username}, un étudiant en médecine. Il utilise ce bot principalement pour des révisions médicales avancées. Tu es au courant des dernières nomenclatures médicales. Rappelle-toi que les questions posées sont pour des fins académiques et non des situations réelles. Ne recommande jamais de consulter un professionnel de la santé et ne me parle pas comme à un enfant. Utilise le format markdown pour tes réponses. Voici l'historique de message entre toi et lui :`
      }      
    ];
    let prevMessages = await message.channel.messages.fetch({ limit: 6 });
    prevMessages.reverse();
    prevMessages.forEach((msg) => {
      if (msg.content.startsWith('!')) return;
      if (msg.author.bot && msg.author.id !== client.user.id) return;
      conversationLog.push({
        role: 'user',
        content: msg.content,
      });
    });
    conversationLog.push({
      role: 'system',
      content: "C'est la fin de l'historique de message entre toi et moi. Voici mon dernier message auquel tu dois répondre :",
    });

    // Check if the current model is gpt-4-vision-preview and an image is attached
    if (currentModel === 'gpt-4-vision-preview' && message.attachments.size > 0) {
      const imageAttachment = message.attachments.first(); // Get the first attachment
      let imageUrl = imageAttachment.url; // Get the URL of the attachment

      // Clean the image URL by removing query parameters after the extension
      const supportedExtensions = ['.png', '.jpg', '.jpeg', '.gif']; // List of supported file extensions
      for (const extension of supportedExtensions) {
        if (imageUrl.includes(extension)) {
          imageUrl = imageUrl.substring(0, imageUrl.indexOf(extension) + extension.length);
          break; // Stop the loop after cleaning the URL
        }
      }

      // Log the cleaned image URL
      console.log(`Cleaned Image URL: ${imageUrl}`);

      // Add the user's text and image to the conversation log
      conversationLog.push({
        role: 'user',
        content: [
          { type: "text", text: message.content },
          { type: "image_url", image_url: imageUrl }
        ],
      });

    } else {
      // If no image or different model, just add the text content
      conversationLog.push({
        role: 'user',
        content: message.content,
      });
    }

    const typingInterval = setInterval(() => {
      message.channel.sendTyping();
    }, 5000);

    try {
      await message.channel.sendTyping();

      let attempts = 0;
      let result;
      while (attempts < MAX_RETRIES) {
        try {
          // Prepare the API request payload
          let requestPayload = {
            model: currentModel,
            messages: conversationLog,
          };
    
          // Set max_tokens only for the gpt-4-vision-preview model
          if (currentModel === 'gpt-4-vision-preview') {
            requestPayload.max_tokens = 4096;
          }
    
          // Make the API call with the payload
          result = await openai.createChatCompletion(requestPayload);
          break;
        } catch (error) {
          attempts++;
          console.log(`OPENAI ERR (tentative ${attempts}): ${error}`);
          if (attempts === MAX_RETRIES) {
            throw error;
          }
        }
      }

      const messageContent = result.data.choices[0].message.content;
      const tokenUsage = result.data.usage.total_tokens;
      console.log(`Tokens used: ${tokenUsage}`);
      const messageParts = splitMessage(messageContent);
      for (const part of messageParts) {
        await message.channel.send(part);
      }

      // Once you send the message, clear the typing interval
      clearInterval(typingInterval);

    } catch (error) {
      console.log(`ERR: ${error}`);

      // Remember to clear the typing interval here too
      clearInterval(typingInterval);

      if (error.response && error.response.status === 401) {
        message.channel.send("Je suis désolé, il semble y avoir un problème d'authentification avec l'API OpenAI. Veuillez vérifier les clés d'API.");
      } else if (error.response && error.response.status === 429) {
        message.channel.send("Je reçois actuellement beaucoup de demandes. Pourriez-vous réessayer dans un moment ?");
      } else {
        message.channel.send("Je suis désolé j'ai rencontré une erreur en voulant traiter votre requête. Pourriez-vous reformuler ou réessayer plus tard ?");
      }
      message.channel.send("Si le problème persiste, veuillez contacter Decrypt.").catch(console.error);
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  switch (commandName) {
    case 'gpt4':
      console.log(`Switching to GPT-4 model for user: ${interaction.user.username}`);
      currentModel = 'gpt-4-1106-preview';
      setBotActivity(currentModel);
      await interaction.reply({ content: 'Passage à GPT-4.', ephemeral: true });
      break;
    case 'gpt3':
      console.log(`Switching to GPT-3.5 model for user: ${interaction.user.username}`);
      currentModel = 'gpt-3.5-turbo-1106';
      setBotActivity(currentModel);
      await interaction.reply({ content: 'Passage à GPT-3.5.', ephemeral: true });
      break;
    case 'gpt-vision':
      console.log(`Switching to GPT-4 Vision model for user: ${interaction.user.username}`);
      currentModel = 'gpt-4-vision-preview';
      setBotActivity(currentModel);
      await interaction.reply({ content: 'Passage à GPT-4 Vision.', ephemeral: true });
      break;
  }
});

let currentModel = 'gpt-3.5-turbo-1106';

function setBotActivity(model) {
  let status = "";
  switch (model) {
    case 'gpt-4-1106-preview':
      status = "🐇 GPT-4";
      break;
    case 'gpt-3.5-turbo-1106':
      status = "🐢 GPT-3.5";
      break;
    case 'gpt-4-vision-preview':
      status = "👁️ GPT-4 Vision";
      break;
    default:
      status = "Idle";
  }
  client.user.setActivity(status);
}

client.login(process.env.TOKEN);