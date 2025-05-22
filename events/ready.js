import { ApplicationCommandOptionType } from "discord.js";
import { AI_NAME, DEFAULT_MODE, DEFAULT_MODEL, GPT_MODELS, MODEL_SURNAMES } from "../config.js";
import setBotActivity from "../utils/setBotActivity.js";

async function ready(client) {
  console.log(`${AI_NAME} is online!`);
  client.currentMode = DEFAULT_MODE;
  client.currentModel = DEFAULT_MODEL;
  setBotActivity(client, client.currentMode, client.currentModel);

  // Set up the commands
  const commands = [
    {
      name: "gpt-mode",
      description: "Switch between GPT text and voice modes",
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: "mode",
          description: "Select the mode",
          required: true,
          choices: [
            { name: "Text", value: "text" },
            { name: "Voice", value: "voice" }
          ]
        },
      ],
    },
    {
      name: "gpt-model",
      description: "Choose the GPT model to use",
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: "model",
          description: "Select the model",
          required: true,
          choices: [
            { name: MODEL_SURNAMES[GPT_MODELS.GPT4O], value: GPT_MODELS.GPT4O },
            { name: MODEL_SURNAMES[GPT_MODELS.GPT41], value: GPT_MODELS.GPT41 },
            { name: MODEL_SURNAMES[GPT_MODELS.O3], value: GPT_MODELS.O3 }
          ]
        },
      ],
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
    // First fetch the existing commands
    const existingCommands = await client.application?.commands.fetch();
    console.log("Successfully fetched application commands");
    
    // Clear the existing commands
    await client.application.commands.set([]);
    console.log("Cleared existing commands");
    
    // Register the new commands and wait for it to complete
    const newCommands = await client.application.commands.set(commands);
    console.log(`Commands registered successfully (${newCommands.size} commands)`);
    
    return true; // Signal successful completion
  } catch (error) {
    console.error("Error registering commands:", error);
    return false; // Signal failure
  }
}

export default ready;