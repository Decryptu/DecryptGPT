import { Client, IntentsBitField, Partials } from "discord.js";
import OpenAI from "openai";
import "dotenv/config.js";

import interactionCreate from "./events/interactionCreate.js";
import messageCreate from "./events/messageCreate.js";
import ready from "./events/ready.js";
import createGptImage from "./utils/createGptImage.js";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.DirectMessageReactions,
    IntentsBitField.Flags.DirectMessageTyping,
  ],
  partials: [Partials.Channel, Partials.Reaction, Partials.Message],
  debug: true,
});

client.openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

// Add the new function
client.createGptImage = (description) =>
  createGptImage(client, description);

client.on("ready", () => ready(client));
client.on("messageCreate", (message) => messageCreate(message, client));
client.on("interactionCreate", (interaction) =>
  interactionCreate(interaction, client)
);

client.login(process.env.TOKEN);

let isShuttingDown = false;

async function gracefulShutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log("Shutting down gracefully...");

  try {
    await client.destroy();
    console.log("Bot logged out from Discord");
  } catch (error) {
    console.error("Error during Discord client shutdown:", error);
  }
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);