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
    },
    {
      name: 'image',
      description: 'Générer une image avec DALL-E',
      options: [{
        type: 3,
        name: 'description',
        description: 'Description de l\'image à générer',
        required: true,
      }],
    }
  ];

  try {
    await client.application?.commands.set(commands);
    console.log('Commands set successfully');
  } catch (error) {
    console.error("Error setting up commands:", error);
  }
}

export default ready;
