import { GPT_4 } from '../config.js';

async function gpt4(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    console.log(`Switching to GPT-4 model for user: ${interaction.user.username}`);
    client.currentModel = GPT_4;
    setBotActivityAsync(client); // Handle asynchronously
    await interaction.editReply({ content: 'Passage à GPT-4.' });
}

async function setBotActivityAsync(client) {
    try {
        await client.setBotActivity(client.currentModel);
    } catch (error) {
        console.error('Error in setBotActivity:', error);
    }
}

export default gpt4;
