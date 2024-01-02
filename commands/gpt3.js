import { GPT_3 } from '../config.js';

async function gpt3(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    console.log(`Switching to GPT-3.5 model for user: ${interaction.user.username}`);
    client.currentModel = GPT_3;
    client.setBotActivity(client.currentModel);
    await interaction.editReply({ content: 'Passage à GPT-3.5.' });
}
  
export default gpt3;
