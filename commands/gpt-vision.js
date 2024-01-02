import { GPT_V } from '../config.js';

async function gptVision(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    console.log(`Switching to GPT-4 Vision model for user: ${interaction.user.username}`);
    client.currentModel = GPT_V;
    client.setBotActivity(client.currentModel);
    await interaction.editReply({ content: 'Passage à GPT-4 Vision.' });
}

export default gptVision;
