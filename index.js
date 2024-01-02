import { Client, IntentsBitField, Partials } from 'discord.js';
import OpenAI from 'openai';
import 'dotenv/config.js';

import interactionCreate from './events/interactionCreate.js';
import messageCreate from './events/messageCreate.js';
import ready from './events/ready.js';
import setBotActivity from './utils/setBotActivity.js';
import createDallEImage from './utils/createDallEImage.js';
import { AI_NAME, DEFAULT_MODEL } from './config.js';

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

client.currentModel = DEFAULT_MODEL;
client.setBotActivity = (model) => setBotActivity(client, model);

client.openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

client.createDallEImage = (description) => createDallEImage(client, description);

client.on('ready', () => ready(client));
client.on('messageCreate', (message) => messageCreate(message, client));
client.on('interactionCreate', (interaction) => interactionCreate(interaction, client));

client.login(process.env.TOKEN);

let isShuttingDown = false;

async function gracefulShutdown() {
  if (isShuttingDown) return; // Prevent multiple shutdowns
  isShuttingDown = true;

  console.log('Shutting down gracefully...');

  // Shut down the Discord client
  try {
    await client.destroy();
    console.log('Bot logged out from Discord');
  } catch (error) {
    console.error('Error during Discord client shutdown:', error);
  }
}

// Signal handling for graceful shutdown
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
