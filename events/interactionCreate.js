import gptMode from "../commands/gpt-mode.js";
import gptModel from "../commands/gpt-model.js";
import imageGpt from "../commands/image-gpt.js";
import imageEdit from "../commands/image-edit.js";
import handleInteractionError from "../utils/handleInteractionError.js";

const commandHandlers = {
  "gpt-mode": gptMode,
  "gpt-model": gptModel,
  "image": imageGpt,
  "image-edit": imageEdit,
};

async function interactionCreate(interaction, client) {
  // Add debugging
  console.log(`Received interaction: ${interaction.type} - ${interaction.commandName || 'unnamed'}`);
  
  if (!interaction.isChatInputCommand()) return;

  const handler = commandHandlers[interaction.commandName];

  if (handler) {
    console.log(`Executing handler for command: ${interaction.commandName}`);
    try {
      await handler(interaction, client);
    } catch (error) {
      console.error(
        `Error handling command ${interaction.commandName}:`,
        error
      );
      
      await handleInteractionError(interaction, error);
    }
  } else {
    console.warn(`No handler found for command: ${interaction.commandName}`);
  }
}

export default interactionCreate;