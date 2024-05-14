import splitMessage from "./splitMessage.js";
import handleApiErrors from "./handleApiErrors.js";
import { GPT_MODE, MODEL_NAME, MAX_RETRIES, BETTER_LOG } from "../config.js";
import fs from "node:fs";
import path from "node:path";

let lastSpeechFile = null;

async function respondToMessage(message, client, conversationLog) {
  const typingInterval = setInterval(() => message.channel.sendTyping(), 5000);

  try {
    await message.channel.sendTyping();
    let attempts = 0;
    let result;

    while (attempts < MAX_RETRIES) {
      try {
        const requestPayload = {
          model: MODEL_NAME,
          messages: conversationLog,
        };

        if (client.currentMode === GPT_MODE.TEXT) {
          requestPayload.max_tokens = 4096;
        }

        if (BETTER_LOG) {
          console.log(
            "Full request payload:",
            JSON.stringify(requestPayload, null, 2)
          );
        }

        result = await client.openai.chat.completions.create(requestPayload);
        break;
      } catch (error) {
        attempts++;
        console.log(`OPENAI ERR (attempt ${attempts}): ${error}`);
        if (attempts === MAX_RETRIES) throw error;
      }
    }

    const messageContent = result.choices[0].message.content;
    const tokenUsage = result.usage.total_tokens;
    console.log(`Tokens used: ${tokenUsage}`);

    if (client.currentMode === GPT_MODE.VOICE) {
      await sendTtsResponse(message, client, messageContent);
    } else {
      const messageParts = splitMessage(messageContent);
      for (const part of messageParts) {
        await message.channel.send(part);
      }
    }
  } catch (error) {
    console.error("Error:", error);
    await handleApiErrors(message, error);
  } finally {
    clearInterval(typingInterval);
  }
}

async function sendTtsResponse(message, client, text) {
  const speechFile = path.resolve(`./speech-${Date.now()}.mp3`);

  try {
    if (lastSpeechFile) {
      await fs.promises.unlink(lastSpeechFile);
      console.log(`Deleted previous speech file: ${lastSpeechFile}`);
    }

    const mp3 = await client.openai.audio.speech.create({
      model: "tts-1-hd",
      voice: "echo",
      input: text,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
    lastSpeechFile = speechFile;
    await message.channel.send({
      files: [
        {
          attachment: speechFile,
          name: "response.mp3",
        },
      ],
    });
  } catch (error) {
    console.error("Error generating TTS audio:", error);
    await message.channel.send(
      "An error occurred while generating the TTS audio."
    );
  }
}

export default respondToMessage;
