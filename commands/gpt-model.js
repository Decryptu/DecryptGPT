import { GPT_MODELS, MODEL_SURNAMES } from "../config.js";
import setBotActivity from "../utils/setBotActivity.js";
import { MessageFlags } from "discord.js";

async function gptModel(interaction, client) {
	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

	const selectedModel = interaction.options.getString("model");

	if (!Object.values(GPT_MODELS).includes(selectedModel)) {
		await interaction.editReply({ content: "Invalid model selected." });
		return;
	}

	console.log(
		`Switching global model to: ${selectedModel} (requested by ${interaction.user.username})`,
	);

	client.currentModel = selectedModel;
	setBotActivity(client, client.currentMode, client.currentModel);

	const surname = MODEL_SURNAMES[selectedModel];
	await interaction.editReply({ content: `Switched to model: ${surname}` });
}

export default gptModel;
