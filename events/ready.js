import { AI_NAME } from '../config.js';

async function ready(client) {
    console.log(`${AI_NAME} is online!`);
    client.setBotActivity(client.currentModel);

    await client.application.commands.create({
      name: 'gpt4',
      description: 'Passer au modèle GPT-4',
    });

    await client.application.commands.create({
      name: 'gpt3',
      description: 'Passer au modèle GPT-3.5',
    });

    await client.application.commands.create({
      name: 'gpt-vision',
      description: 'Passer au modèle GPT-4 Vision',
    });
}

export default ready;
