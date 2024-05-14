import gptText from "../commands/gpt-text.js";
import gptVoice from "../commands/gpt-voice.js";
import dalle from "../commands/dalle.js";

const commandHandlers = {
  "gpt-text": gptText,
  "gpt-voice": gptVoice,
  image: dalle,
};

async function interactionCreate(interaction, client) {
  if (!interaction.isCommand()) return;

  const handler = commandHandlers[interaction.commandName];

  if (handler) {
    try {
      await handler(interaction, client);
    } catch (error) {
      console.error(
        `Error handling command ${interaction.commandName}:`,
        error
      );
      // Send a generic error message to the user
      await interaction.reply({
        content: "Sorry, there was an error processing your command.",
        ephemeral: true,
      });
    }
  }
}

export default interactionCreate;
