import { GPT_4 } from '../config.js';

async function gpt4(interaction, client) {
    console.log(`Switching to GPT-4 model for user: ${interaction.user.username}`);
    client.currentModel = GPT_4;
    client.setBotActivity(client.currentModel);
    await interaction.reply({ content: 'Passage à GPT-4.', ephemeral: true });
  }
  
  export default gpt4;
  