import { DALL_E_IMAGE_COUNT, DALL_E_IMAGE_SIZE } from '../config.js';

async function createDallEImage(client, promptText) {
    try {
        const response = await client.openai.createImage({
            prompt: promptText,
            n: DALL_E_IMAGE_COUNT,
            size: DALL_E_IMAGE_SIZE
        });

        if (response && response.data && response.data.data[0] && response.data.data[0].url) {
            return response.data.data[0].url;
        } else {
            console.error("Unexpected API response format:", response);
            throw new Error("Unexpected API response format");
        }
    } catch (error) {
        console.error('Error while creating image:', error);
        throw error;
    }
}

export default createDallEImage;
