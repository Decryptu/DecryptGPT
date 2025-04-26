import { EmbedBuilder, AttachmentBuilder, MessageFlags } from "discord.js";

async function imageGpt(interaction, client) {
  const description = interaction.options.getString("description");
  if (!description) {
    await interaction.reply({
      content: "Please provide an image description.",
      flags: MessageFlags.Ephemeral
    });
    return;
  }

  try {
    // Acknowledge the interaction immediately to prevent timeouts
    await interaction.deferReply();
    
    const imageBase64 = await client.createGptImage(description);

    if (!imageBase64) {
      throw new Error("No image data returned");
    }

    // Convert base64 to buffer for Discord attachment
    const buffer = Buffer.from(imageBase64, "base64");
    const attachment = new AttachmentBuilder(buffer, { name: "generated-image.png" });

    const embed = new EmbedBuilder()
      .setTitle("Votre image")
      .setImage("attachment://generated-image.png");

    await interaction.editReply({
      embeds: [embed],
      files: [attachment]
    });
  } catch (error) {
    console.error("Error in imageGpt function:", error);
    
    // Check if the interaction has already been replied to
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({
        content: "Échec de la génération d'une image. Veuillez réessayer ultérieurement.",
        files: []
      });
    } else {
      await interaction.reply({
        content: "Échec de la génération d'une image. Veuillez réessayer ultérieurement.",
        flags: MessageFlags.Ephemeral
      });
    }
  }
}

export default imageGpt;