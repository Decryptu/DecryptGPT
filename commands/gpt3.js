import { GPT_3 } from '../config.js';

async function gpt3(interaction, client) {
    console.log(`Switching to GPT-3.5 model for user: ${interaction.user.username}`);
    client.currentModel = GPT_3;
    client.setBotActivity(client.currentModel);
    await interaction.reply({ content: 'Passage à GPT-3.5.', ephemeral: true });
  }
  
  export default gpt3;
  