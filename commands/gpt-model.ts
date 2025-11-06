// commands/gpt-model.ts
import { type ChatInputCommandInteraction, type Client, MessageFlags } from "discord.js";
import { GPT_MODELS, MODEL_SURNAMES } from "../config.js";
import setBotActivity from "../utils/setBotActivity.js";

interface ExtendedClient extends Client {
  currentModel: string;
}

async function gptModel(interaction: ChatInputCommandInteraction, client: ExtendedClient): Promise<void> {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const selectedModel = interaction.options.getString("model");

  if (!selectedModel || !Object.values(GPT_MODELS).includes(selectedModel)) {
    await interaction.editReply({ content: "Modèle invalide." });
    return;
  }

  const previousModel = MODEL_SURNAMES[client.currentModel];
  client.currentModel = selectedModel;
  setBotActivity(client, client.currentModel);

  const newModel = MODEL_SURNAMES[selectedModel];
  console.log(`[MODEL SWITCH] ${interaction.user.username}: ${previousModel} → ${newModel}`);

  await interaction.editReply({ content: `Modèle activé: ${newModel}` });
}

export default gptModel;
