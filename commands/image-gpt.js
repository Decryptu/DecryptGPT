// commands/image-gpt.js
import { EmbedBuilder, AttachmentBuilder, MessageFlags } from "discord.js";
import { GPT_IMAGE_MODEL, GPT_IMAGE_SIZE, GPT_IMAGE_QUALITY } from "../config.js";

async function imageGpt(interaction, client) {
  const description = interaction.options.getString("description");
  
  if (!description) {
    return await interaction.reply({
      content: "Veuillez fournir une description.",
      flags: MessageFlags.Ephemeral
    });
  }

  await interaction.deferReply();
  console.log(`[IMAGE GENERATION] ${interaction.user.username}: "${description}"`);

  try {
    const response = await client.openai.images.generate({
      model: GPT_IMAGE_MODEL,
      prompt: description,
      n: 1,
      size: GPT_IMAGE_SIZE,
      quality: GPT_IMAGE_QUALITY,
      // Removed response_format - no longer supported
    });

    // Check if response has base64 data or URL
    let buffer;
    if (response.data[0].b64_json) {
      // Base64 response
      buffer = Buffer.from(response.data[0].b64_json, "base64");
      console.log(`[IMAGE GENERATION] Received base64 image`);
    } else if (response.data[0].url) {
      // URL response - download the image
      console.log(`[IMAGE GENERATION] Downloading from URL: ${response.data[0].url}`);
      const imageResponse = await fetch(response.data[0].url);
      const arrayBuffer = await imageResponse.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      throw new Error("No image data in response");
    }

    const attachment = new AttachmentBuilder(buffer, { name: "image.png" });

    const embed = new EmbedBuilder()
      .setTitle("Image générée")
      .setDescription(`Prompt: ${description}`)
      .setImage("attachment://image.png")
      .setTimestamp();

    console.log(`[IMAGE GENERATION] Success - Image sent to ${interaction.user.username}`);
    await interaction.editReply({ embeds: [embed], files: [attachment] });
  } catch (error) {
    console.error("[IMAGE GENERATION] Error:", error);
    await interaction.editReply("Échec de génération d'image. " + (error.message || ""));
  }
}

export default imageGpt;