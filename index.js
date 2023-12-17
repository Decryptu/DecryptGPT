import { Client, IntentsBitField, Partials } from 'discord.js';
import { Configuration, OpenAIApi } from 'openai';
// import express from 'express';
import 'dotenv/config.js';

import interactionCreate from './events/interactionCreate.js';
import messageCreate from './events/messageCreate.js';
import ready from './events/ready.js';
import setBotActivity from './utils/setBotActivity.js';
import { AI_NAME, DEFAULT_MODEL } from './config.js';

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.get('/', (req, res) => {
//   res.send(`${AI_NAME} is alive!`);
// });

// let server = app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

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

client.on('ready', () => ready(client));
client.on('messageCreate', (message) => messageCreate(message, client));
client.on('interactionCreate', (interaction) => interactionCreate(interaction, client));

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
client.openai = new OpenAIApi(configuration);

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

  // Shut down the Express server
  // if (server) {
  //   server.close(() => {
  //     console.log('Express server closed');
  //   });
  // }
}

// Signal handling for graceful shutdown
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
