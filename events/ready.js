import { AI_NAME, DEFAULT_MODE } from "../config.js";
import setBotActivity from "../utils/setBotActivity.js";

async function ready(client) {
  console.log(`${AI_NAME} is online!`);
  client.currentMode = DEFAULT_MODE; // Initialize the current mode to the default mode
  setBotActivity(client, client.currentMode); // Set the initial activity

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
      description: "Generate an image with DALL-E",
      options: [
        {
          type: 3,
          name: "description",
          description: "Description of the image to generate",
          required: true,
        },
      ],
    },
  ];

  try {
    await client.application?.commands.set(commands);
    console.log("Commands set successfully");
  } catch (error) {
    console.error("Error setting up commands:", error);
  }
}

export default ready;
