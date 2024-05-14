import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import dotenv from "dotenv";
import { SERVER_IDS } from "../config.js";

dotenv.config();

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const rest = new REST({ version: "9" }).setToken(token);

async function deleteOldCommands() {
  try {
    for (const guildId of SERVER_IDS) {
      const commands = await rest.get(
        Routes.applicationGuildCommands(clientId, guildId)
      );

      const oldCommands = commands.filter(
        (cmd) => cmd.name === "gpt3" || cmd.name === "gpt-new"
      );

      for (const command of oldCommands) {
        await rest.delete(
          Routes.applicationGuildCommand(clientId, guildId, command.id)
        );
        console.log(`Deleted command ${command.name} in guild ${guildId}`);
      }
    }
    console.log("Finished deleting old commands.");
  } catch (error) {
    console.error("Error deleting commands:", error);
  }
}

deleteOldCommands();
