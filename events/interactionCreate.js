import gpt3 from '../commands/gpt3.js';
import gpt4 from '../commands/gpt4.js';
import gptVision from '../commands/gpt-vision.js';

const commandHandlers = {
  'gpt4': gpt4,
  'gpt3': gpt3,
  'gpt-vision': gptVision
};

async function interactionCreate(interaction, client) {
  if (!interaction.isCommand()) return;

  const handler = commandHandlers[interaction.commandName];
  
  if (handler) {
    try {
      await handler(interaction, client);
    } catch (error) {
      console.error(`Error handling command ${interaction.commandName}:`, error);
      // Send a generic error message to the user
      await interaction.reply({ 
        content: "Sorry, there was an error processing your command.", 
        ephemeral: true 
      });
    }
  }
}

export default interactionCreate;
