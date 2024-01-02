import { EmbedBuilder } from 'discord.js';
import { DALL_E_ENABLED } from '../config.js';

async function dalle(interaction, client) {
    if (!DALL_E_ENABLED) {
        await interaction.reply({ content: 'DALL-E functionality is currently disabled.', ephemeral: true });
        return;
    }

    const description = interaction.options.getString('description');
    if (!description) {
        await interaction.reply({ content: 'Please provide an image description.', ephemeral: true });
        return;
    }

    await interaction.deferReply();

    try {
        const imageUrl = await client.createDallEImage(description);

        if (!imageUrl) {
            throw new Error('No image URL returned');
        }

        const embed = new EmbedBuilder();
        embed.setTitle("Votre image");
        embed.setImage(imageUrl);

        await interaction.followUp({ embeds: [embed] });
    } catch (error) {
        console.error("Error in dalle function:", error);
        await interaction.followUp({ content: "Échec de la génération d'une image. Veuillez réessayer ultérieurement." });
    }
}

export default dalle;
