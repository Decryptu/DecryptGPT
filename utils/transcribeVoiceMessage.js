import axios from 'axios';
import fs, { promises as fsPromises } from 'fs';
import FormData from 'form-data';
import { randomUUID } from 'crypto';

async function transcribeVoiceMessage(url, apiKey) {
  let filePath;

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const data = response.data;
    filePath = `temp_voice_message_${randomUUID()}.ogg`;
    await fsPromises.writeFile(filePath, data);

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('model', 'whisper-1');

    const transcriptionResponse = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${apiKey}`
      }
    });

    return transcriptionResponse.data.text;
  } catch (error) {
    console.error('Error transcribing voice message:', error);
    throw error; // Re-throw the error after logging
  } finally {
    if (filePath) {
      await fsPromises.unlink(filePath).catch(err => console.error('Error cleaning up temp file:', err));
    }
  }
}

export default transcribeVoiceMessage;
