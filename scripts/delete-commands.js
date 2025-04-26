import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const rest = new REST({ version: "9" }).setToken(token);

async function deleteCommands() {
  try {
    // Get all guilds
    const guilds = await rest.get(Routes.userGuilds());
    
    for (const guild of guilds) {
      const guildId = guild.id;
      // Get all commands in this guild
      const commands = await rest.get(
        Routes.applicationGuildCommands(clientId, guildId)
      );

      // Find the image command
      const imageCommand = commands.find(cmd => cmd.name === "image");
      
      if (imageCommand) {
        await rest.delete(
          Routes.applicationGuildCommand(clientId, guildId, imageCommand.id)
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