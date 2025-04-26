import { ApplicationCommandOptionType } from "discord.js";
import { AI_NAME, DEFAULT_MODE } from "../config.js";
import setBotActivity from "../utils/setBotActivity.js";

async function ready(client) {
	console.log(`${AI_NAME} is online!`);
	client.currentMode = DEFAULT_MODE;
	setBotActivity(client, client.currentMode);

	// First, delete existing commands to avoid conflicts
	try {
		await client.application?.commands.fetch();
		console.log("Successfully fetched application commands");
	} catch (error) {
		console.error("Error fetching commands:", error);
	}

	// Set up the commands
	const commands = [
		{
			name: "gpt-voice",
			description: "Switch to GPT-VOICE mode",
		},
		{
			name: "gpt-text",
			description: "Switch to GPT-TEXT mode",
		},
		{
			name: "image",
			description: "Generate an image with GPT-Image-1 model",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "description",
					description: "Description of the image to generate",
					required: true,
				},
			],
		},
		{
			name: "image-edit",
			description: "Edit an image with GPT-Image-1 model",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "description",
					description: "Description of the edit to make",
					required: true,
				},
				{
					type: ApplicationCommandOptionType.Attachment,
					name: "image",
					description: "The image to edit",
					required: true,
				},
			],
		},
	];

	try {
		// Clear the existing commands first
		await client.application.commands.set([]);
		console.log("Cleared existing commands");

		// Then register the new ones
		await client.application.commands.set(commands);
		console.log("Commands registered successfully");
	} catch (error) {
		console.error("Error registering commands:", error);
	}
}

export default ready;
