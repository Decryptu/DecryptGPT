import { DALL_E_IMAGE_COUNT, DALL_E_IMAGE_SIZE } from '../config.js';

async function createDallEImage(client, promptText) {
    try {
        const response = await client.openai.images.generate({
            model: "dall-e-3",  // Ensure this matches your model
            prompt: promptText,
            n: DALL_E_IMAGE_COUNT,  // This should be 1 for DALL·E 3
            size: DALL_E_IMAGE_SIZE  // Confirm this is a supported size
        });

        if (response && response.data && response.data[0] && response.data[0].url) {
            return response.data[0].url;
        } else {
            throw new Error("No image URL in response");
        }
    } catch (error) {
        console.error('Error in createDallEImage:', error);
        throw error;  // Rethrow the error to handle it in the calling function
    }
}

export default createDallEImage;
