import { GPT_MODE } from "../config.js";
import setBotActivity from "../utils/setBotActivity.js";

async function gptVoice(interaction, client) {
  await interaction.deferReply({ ephemeral: true });
  console.log(
    `Switching to GPT-VOICE mode for user: ${interaction.user.username}`
  );
  client.currentMode = GPT_MODE.VOICE;
  setBotActivity(client, client.currentMode); // Update bot activity
  await interaction.editReply({ content: "Switched to GPT-VOICE mode." });
}

export default gptVoice;
