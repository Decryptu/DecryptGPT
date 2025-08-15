// commands/image-edit.js
import { EmbedBuilder, AttachmentBuilder } from "discord.js";
import { toFile } from "openai";

async function imageEdit(interaction, client) {
  await interaction.deferReply();
  
  try {
    const description = interaction.options.getString("description");
    const imageAttachment = interaction.options.getAttachment("image");
    
    if (!imageAttachment?.contentType?.startsWith("image/")) {
      return await interaction.editReply("Veuillez fournir une image valide (PNG, JPEG, WebP).");
    }

    console.log(`[IMAGE EDIT] ${interaction.user.username}: "${description}"`);
    console.log(`[IMAGE EDIT] Input image: ${imageAttachment.name} (${imageAttachment.size} bytes)`);

    const response = await fetch(imageAttachment.url);
    const buffer = await response.arrayBuffer();
    const imageFile = await toFile(buffer, imageAttachment.name, {
      type: imageAttachment.contentType
    });

    const result = await client.openai.images.edit({
      model: "gpt-image-1",
      image: imageFile,
      prompt: description,
      // Removed response_format - no longer supported
    });

    // Check if response has base64 data or URL
    let outputBuffer;
    if (result.data[0].b64_json) {
      // Base64 response
      outputBuffer = Buffer.from(result.data[0].b64_json, "base64");
      console.log(`[IMAGE EDIT] Received base64 edited image`);
    } else if (result.data[0].url) {
      // URL response - download the image
      console.log(`[IMAGE EDIT] Downloading from URL: ${result.data[0].url}`);
      const imageResponse = await fetch(result.data[0].url);
      const arrayBuffer = await imageResponse.arrayBuffer();
      outputBuffer = Buffer.from(arrayBuffer);
    } else {
      throw new Error("No image data in response");
    }

    const attachment = new AttachmentBuilder(outputBuffer, { name: "edited.png" });

    const embed = new EmbedBuilder()
      .setTitle("Image modifiée")
      .setDescription(`Prompt: ${description}`)
      .setImage("attachment://edited.png")
      .setTimestamp();

    console.log(`[IMAGE EDIT] Success - Edited image sent to ${interaction.user.username}`);
    await interaction.editReply({ embeds: [embed], files: [attachment] });
  } catch (error) {
    console.error("[IMAGE EDIT] Error:", error);
    await interaction.editReply("Échec de modification d'image. " + (error.message || ""));
  }
}

export default imageEdit;