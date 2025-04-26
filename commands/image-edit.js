import { EmbedBuilder, AttachmentBuilder } from "discord.js";
import axios from "axios";
import { toFile } from "openai";

async function imageEdit(interaction, client) {
  // Immediately defer the reply to avoid timeout issues
  await interaction.deferReply();
  
  try {
    // Log the interaction for debugging
    console.log("Image edit command received:", {
      user: interaction.user.tag,
      options: interaction.options.data
    });
    
    const description = interaction.options.getString("description");
    const imageAttachment = interaction.options.getAttachment("image");
    
    // Validate inputs after deferring to ensure we can respond properly
    if (!description) {
      return await interaction.editReply({
        content: "Please provide an image description."
      });
    }

    if (!imageAttachment) {
      return await interaction.editReply({
        content: "Please provide a valid image attachment."
      });
    }

    // Log the attachment details
    console.log("Attachment details:", {
      name: imageAttachment.name,
      contentType: imageAttachment.contentType,
      size: imageAttachment.size,
      url: imageAttachment.url
    });

    if (!imageAttachment.contentType?.startsWith("image/")) {
      return await interaction.editReply({
        content: "The provided attachment is not an image. Please upload a PNG, JPEG, or WebP image."
      });
    }
    
    // Download the image from Discord
    console.log("Downloading image from Discord...");
    const response = await axios.get(imageAttachment.url, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);
    console.log(`Image downloaded, size: ${imageBuffer.length} bytes`);
    
    // Convert to proper format for OpenAI
    console.log("Converting image for OpenAI...");
    const imageFile = await toFile(imageBuffer, imageAttachment.name || "image.png", {
      type: imageAttachment.contentType
    });
    console.log("Image converted successfully");

    // Call the edit endpoint
    console.log("Calling OpenAI edit API with prompt:", description);
    const result = await client.openai.images.edit({
      model: "gpt-image-1",
      image: imageFile,
      prompt: description,
    });

    console.log("OpenAI API response received:", result);

    if (!result?.data?.[0]?.b64_json) {
      throw new Error("No image data returned from API");
    }

    // Convert base64 to buffer for Discord attachment
    const outputBuffer = Buffer.from(result.data[0].b64_json, "base64");
    const attachment = new AttachmentBuilder(outputBuffer, { name: "edited-image.png" });

    const embed = new EmbedBuilder()
      .setTitle("Image edited successfully")
      .setDescription(`Prompt: ${description}`)
      .setImage("attachment://edited-image.png")
      .setTimestamp();

    await interaction.editReply({
      content: null,
      embeds: [embed],
      files: [attachment]
    });
    
    console.log("Successfully sent edited image response");
  } catch (error) {
    console.error("Error in imageEdit function:", error);
    
    // Check for specific API errors
    const errorMessage = error.response?.data?.error?.message || error.message || "Unknown error";
    console.error("Detailed error:", errorMessage);
    
    // Always use editReply since we deferred at the beginning
    await interaction.editReply({
      content: `Failed to edit the image. Error: ${errorMessage}`,
      embeds: [],
      files: []
    });
  }
}

export default imageEdit;