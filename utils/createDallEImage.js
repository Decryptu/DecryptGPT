import {
  DALL_E_IMAGE_COUNT,
  DALL_E_IMAGE_SIZE,
  DALLE_LATEST,
} from "../config.js";

async function createDallEImage(client, promptText) {
  try {
    const response = await client.openai.images.generate({
      model: DALLE_LATEST, // Use the DALL-E model version from config
      prompt: promptText,
      n: DALL_E_IMAGE_COUNT, // This should be 1 for DALL·E 3
      size: DALL_E_IMAGE_SIZE, // Confirm this is a supported size
    });

    if (response?.data?.[0]?.url) {
      return response.data[0].url;
    }
    throw new Error("No image URL in response");
  } catch (error) {
    console.error("Error in createDallEImage:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}

export default createDallEImage;
