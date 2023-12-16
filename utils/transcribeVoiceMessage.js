import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

async function transcribeVoiceMessage(url, apiKey) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const data = response.data;
  const filePath = 'temp_voice_message.ogg';
  fs.writeFileSync(filePath, data);

  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  formData.append('model', 'whisper-1');

  const transcriptionResponse = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
    headers: {
      ...formData.getHeaders(),
      'Authorization': `Bearer ${apiKey}`
    }
  });

  fs.unlinkSync(filePath); // Delete the temp file after processing
  return transcriptionResponse.data.text;
}

export default transcribeVoiceMessage;
