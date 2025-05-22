import axios from "axios";
import fs, { promises as fsPromises } from "node:fs";
import FormData from "form-data";
import { randomUUID } from "node:crypto";

async function transcribeVoiceMessage(url, apiKey) {
  let filePath;
  let fileStream;

  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const data = response.data;
    filePath = `temp_voice_message_${randomUUID()}.ogg`;
    await fsPromises.writeFile(filePath, data);

    const formData = new FormData();
    fileStream = fs.createReadStream(filePath);
    formData.append("file", fileStream);
    formData.append("model", "whisper-1");
    formData.append("language", "fr");

    const transcriptionResponse = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return transcriptionResponse.data.text;
  } catch (error) {
    console.error("Error transcribing voice message:", error);
    throw error;
  } finally {
    // Ensure file stream is closed before attempting to delete
    if (fileStream) {
      try {
        fileStream.destroy();
      } catch (streamError) {
        console.error("Error closing file stream:", streamError);
      }
    }

    // Add a small delay to ensure file handle is released
    if (filePath) {
      setTimeout(async () => {
        try {
          await fsPromises.access(filePath); // Check if file still exists
          await fsPromises.unlink(filePath);
          console.log(`Cleaned up temp voice file: ${filePath}`);
        } catch (err) {
          if (err.code !== 'ENOENT') { // Ignore "file not found" errors
            console.error("Error cleaning up temp file:", err);
          }
        }
      }, 100); // Small delay to ensure file handle is released
    }
  }
}

export default transcribeVoiceMessage;
