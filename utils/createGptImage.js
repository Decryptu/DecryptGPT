import {
    GPT_IMAGE_MODEL,
    GPTIMG_IMAGE_SIZE,
    GPT_IMAGE_QUALITY,
  } from "../config.js";
  
  async function createGptImage(client, promptText) {
    try {
      const response = await client.openai.images.generate({
        model: GPT_IMAGE_MODEL,
        prompt: promptText,
        n: 1,
        size: GPTIMG_IMAGE_SIZE,
        quality: GPT_IMAGE_QUALITY,
      });
  
      // GPT-Image-1 always returns base64-encoded images
      if (response?.data?.[0]?.b64_json) {
        return response.data[0].b64_json;
      }
      throw new Error("No image data in response");
    } catch (error) {
      console.error("Error in createGptImage:", error);
      throw error;
    }
  }
  
  export default createGptImage;