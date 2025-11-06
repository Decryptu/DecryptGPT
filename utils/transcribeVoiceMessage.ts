// utils/transcribeVoiceMessage.ts
import OpenAI from "openai";
import { toFile } from "openai";

async function transcribeVoiceMessage(voiceUrl: string, apiKey: string): Promise<string> {
  const openai = new OpenAI({ apiKey });

  try {
    const response = await fetch(voiceUrl);
    const buffer = await response.arrayBuffer();
    const audioFile = await toFile(buffer, "voice.ogg", { type: "audio/ogg" });

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "fr"
    });

    return transcription.text;
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
}

export default transcribeVoiceMessage;
