import { GPT_MODE } from "../config.js";
import setBotActivity from "../utils/setBotActivity.js";
import { MessageFlags } from "discord.js";

async function gptMode(interaction, client) {
  const mode = interaction.options.getString('mode');
  const targetMode = mode === 'voice' ? GPT_MODE.VOICE : GPT_MODE.TEXT;
  const modeText = mode === 'voice' ? 'GPT-VOICE' : 'GPT-TEXT';
  
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  console.log(`Switching to ${modeText} mode for user: ${interaction.user.username}`);
  
  client.currentMode = targetMode;
  setBotActivity(client, client.currentMode, client.currentModel);
  
  await interaction.editReply({ content: `Switched to ${modeText} mode.` });
}

export default gptMode;