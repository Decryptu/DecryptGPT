import { GPT_MODE } from "../config.js";
import setBotActivity from "../utils/setBotActivity.js";

async function gptText(interaction, client) {
  await interaction.deferReply({ ephemeral: true });
  console.log(
    `Switching to GPT-TEXT mode for user: ${interaction.user.username}`
  );
  client.currentMode = GPT_MODE.TEXT;
  setBotActivity(client, client.currentMode); // Update bot activity
  await interaction.editReply({ content: "Switched to GPT-TEXT mode." });
}

export default gptText;
