// events/interactionCreate.js
import gptModel from "../commands/gpt-model.js";
import imageGpt from "../commands/image-gpt.js";
import imageEdit from "../commands/image-edit.js";
import handleInteractionError from "../utils/handleInteractionError.js";

const commandHandlers = {
  "model": gptModel,
  "image": imageGpt,
  "image-edit": imageEdit,
};

async function interactionCreate(interaction, client) {
  if (!interaction.isChatInputCommand()) return;
  
  const handler = commandHandlers[interaction.commandName];
  if (handler) {
    try {
      await handler(interaction, client);
    } catch (error) {
      console.error(`Error handling command ${interaction.commandName}:`, error);
      await handleInteractionError(interaction, error);
    }
  }
}

export default interactionCreate;