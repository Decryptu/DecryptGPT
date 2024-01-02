import { GPT_V } from '../config.js';

async function gptVision(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    console.log(`Switching to GPT-4 Vision model for user: ${interaction.user.username}`);
    client.currentModel = GPT_V;
    setBotActivityAsync(client); // Handle asynchronously
    await interaction.editReply({ content: 'Passage à GPT-4 Vision.' });
}

async function setBotActivityAsync(client) {
    try {
        await client.setBotActivity(client.currentModel);
    } catch (error) {
        console.error('Error in setBotActivity:', error);
    }
}

export default gptVision;
