// scripts/delete-commands.ts
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token || !clientId) {
  console.error("Missing TOKEN or CLIENT_ID in environment variables");
  process.exit(1);
}

const rest = new REST({ version: "9" }).setToken(token);

async function deleteCommands(): Promise<void> {
  if (!token || !clientId) {
    throw new Error("TOKEN and CLIENT_ID must be defined");
  }

  try {
    // Get all guilds
    const guilds = await rest.get(Routes.userGuilds()) as any[];

    for (const guild of guilds) {
      const guildId = guild.id;
      // Get all commands in this guild
      const commands = await rest.get(
        Routes.applicationGuildCommands(clientId as string, guildId)
      ) as any[];

      // Find the image command
      const imageCommand = commands.find(cmd => cmd.name === "image");

      if (imageCommand) {
        await rest.delete(
          Routes.applicationGuildCommand(clientId as string, guildId, imageCommand.id)
        );
        console.log(`Deleted image command in guild ${guildId}`);
      }
    }

    console.log("Finished deleting commands.");
  } catch (error) {
    console.error("Error deleting commands:", error);
  }
}

deleteCommands();
