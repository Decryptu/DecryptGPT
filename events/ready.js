import { AI_NAME } from '../config.js';

async function ready(client) {
  console.log(`${AI_NAME} is online!`);
  client.setBotActivity(client.currentModel);

  const commands = [
    {
      name: 'gpt4',
      description: 'Passer au modèle GPT-4',
    },
    {
      name: 'gpt3',
      description: 'Passer au modèle GPT-3.5',
    },
    {
      name: 'gpt-vision',
      description: 'Passer au modèle GPT-4 Vision',
    }
  ];

  try {
    await client.application.commands.set(commands);
  } catch (error) {
    console.error("Error setting up commands:", error);
  }
}

export default ready;
