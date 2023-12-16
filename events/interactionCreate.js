import gpt3 from '../commands/gpt3.js';
import gpt4 from '../commands/gpt4.js';
import gptVision from '../commands/gpt-vision.js';

async function interactionCreate(interaction, client) {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  switch (commandName) {
    case 'gpt4':
      await gpt4(interaction, client);
      break;
    case 'gpt3':
      await gpt3(interaction, client);
      break;
    case 'gpt-vision':
      await gptVision(interaction, client);
      break;
  }
}

export default interactionCreate;
