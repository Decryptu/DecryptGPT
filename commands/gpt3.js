import { GPT_3 } from '../config.js';

async function gpt3(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    console.log(`Switching to GPT-3.5 model for user: ${interaction.user.username}`);
    client.currentModel = GPT_3;
    setBotActivityAsync(client); // Handle asynchronously
    await interaction.editReply({ content: 'Passage à GPT-3.5.' });
}

async function setBotActivityAsync(client) {
    try {
        await client.setBotActivity(client.currentModel);
    } catch (error) {
        console.error('Error in setBotActivity:', error);
    }
}

export default gpt3;
