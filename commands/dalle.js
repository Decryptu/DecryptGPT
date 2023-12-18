import { EmbedBuilder } from 'discord.js';
import { DALL_E_ENABLED } from '../config.js';

async function dalle(interaction, client) {
    // Check if DALL-E functionality is enabled
    if (!DALL_E_ENABLED) {
        await interaction.reply({ content: 'DALL-E functionality is currently disabled.', ephemeral: true });
        return;
    }

    // Check if the user provided an image description
    if (!interaction.options.getString('description')) {
        await interaction.reply({ content: 'Please provide an image description.', ephemeral: true });
        return;
    }

    const description = interaction.options.getString('description');
    console.log(`Received /image command with description: ${description}`);

    // Acknowledge the interaction before processing
    await interaction.deferReply();

    try {
        // Generate image from the description
        const imageUrl = await client.createDallEImage(description);

        // Create an embed with the generated image
        const embed = new EmbedBuilder();
        embed.setTitle("Votre image");
        embed.setImage(imageUrl);

        // Send the embed as a follow-up message
        await interaction.followUp({ embeds: [embed] });
    } catch (error) {
        console.error("Error while generating image:", error);
        await interaction.followUp({ content: "Échec de la génération d'une image. Veuillez réessayer ultérieurement." });
    }
}

export default dalle;
