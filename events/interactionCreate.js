import gptText from "../commands/gpt-text.js";
import gptVoice from "../commands/gpt-voice.js";
import imageGpt from "../commands/image-gpt.js";
import imageEdit from "../commands/image-edit.js";
import { MessageFlags } from "discord.js";

const commandHandlers = {
  "gpt-text": gptText,
  "gpt-voice": gptVoice,
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
      
      try {
        // Handle the error response based on the interaction state
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply({
            content: "Sorry, there was an error processing your command.",
          });
        } else {
          await interaction.reply({
            content: "Sorry, there was an error processing your command.",
            flags: MessageFlags.Ephemeral
          });
        }
      } catch (secondaryError) {
        // If we can't respond to the interaction, log it but don't crash
        console.error("Failed to send error message:", secondaryError);
      }
    }
  } else {
    console.warn(`No handler found for command: ${interaction.commandName}`);
  }
}

export default interactionCreate;