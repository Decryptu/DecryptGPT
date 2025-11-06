// index.ts
import { Client, GatewayIntentBits, Partials } from "discord.js";
import OpenAI from "openai";
import "dotenv/config";
import { DEFAULT_MODEL } from "./config.js";
import interactionCreate from "./events/interactionCreate.js";
import messageCreate from "./events/messageCreate.js";
import ready from "./events/ready.js";

// Extend the Client type to include custom properties
interface ExtendedClient extends Client {
  openai: OpenAI;
  currentModel: string;
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
  ],
  partials: [Partials.Channel, Partials.Reaction, Partials.Message],
}) as ExtendedClient;

client.openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

client.currentModel = DEFAULT_MODEL;

client.on("ready", () => ready(client));
client.on("messageCreate", (message) => messageCreate(message, client));
client.on("interactionCreate", (interaction) =>
  interactionCreate(interaction, client)
);

client.login(process.env.TOKEN);

// Graceful shutdown
let isShuttingDown = false;
async function gracefulShutdown(): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log("Shutting down gracefully...");
  try {
    await client.destroy();
    console.log("Bot logged out from Discord");
  } catch (error) {
    console.error("Error during shutdown:", error);
  }
  process.exit(0);
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
