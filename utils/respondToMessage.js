import splitMessage from "./splitMessage.js";
import handleApiErrors from "./handleApiErrors.js";
import { 
  GPT_MODE, 
  MODEL_CONFIG,
  MAX_RETRIES, 
  BETTER_LOG,
  DEFAULT_MODEL
} from "../config.js";
import fs from "node:fs";
import path from "node:path";

let speechFiles = new Set();

/**
 * Handles responding to a message with either text or voice
 * @param {Message} message - The Discord message to respond to
 * @param {Client} client - The Discord client instance
 * @param {Array} conversationLog - Array of previous messages for context
 */
async function respondToMessage(message, client, conversationLog) {
  const typingInterval = setInterval(() => message.channel.sendTyping(), 5000);

  try {
    await message.channel.sendTyping();
    let attempts = 0;
    let result;

    // Use the selected model or fall back to default
    const modelToUse = client.currentModel || DEFAULT_MODEL;
    
    // Get model-specific configuration
    const modelConfig = MODEL_CONFIG[modelToUse] || MODEL_CONFIG[DEFAULT_MODEL];

    while (attempts < MAX_RETRIES) {
      try {
        const requestPayload = {
          model: modelToUse,
          messages: conversationLog,
        };

        // Apply model-specific parameters for text mode
        if (client.currentMode === GPT_MODE.TEXT) {
          requestPayload[modelConfig.tokenParam] = modelConfig.maxTokens;
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
        
        // Exponential backoff with jitter
        const delay = Math.min(1000 * Math.pow(2, attempts - 1), 10000) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
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

/**
 * Handles generating and sending TTS audio responses
 * @param {Message} message - The Discord message to respond to
 * @param {Client} client - The Discord client instance
 * @param {string} text - The text to convert to speech
 */
async function sendTtsResponse(message, client, text) {
  const speechFile = path.resolve(`./speech-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.mp3`);

  try {
    // Clean up old files (keep only last 3 files to prevent accumulation)
    await cleanupOldSpeechFiles();

    const mp3 = await client.openai.audio.speech.create({
      model: "tts-1-hd",
      voice: "echo",
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
    speechFiles.add(speechFile);

    await message.channel.send({
      files: [
        {
          attachment: speechFile,
          name: "response.mp3",
        },
      ],
    });

    // Schedule cleanup after a delay to allow Discord to process the file
    setTimeout(async () => {
      try {
        await fs.promises.unlink(speechFile);
        speechFiles.delete(speechFile);
        console.log(`Cleaned up speech file: ${speechFile}`);
      } catch (error) {
        console.error(`Error cleaning up speech file ${speechFile}:`, error);
        speechFiles.delete(speechFile); // Remove from set even if deletion failed
      }
    }, 60000); // 1 minute delay

  } catch (error) {
    console.error("Error generating TTS audio:", error);
    // Clean up file if it was created but sending failed
    if (speechFiles.has(speechFile)) {
      try {
        await fs.promises.unlink(speechFile);
        speechFiles.delete(speechFile);
      } catch (cleanupError) {
        console.error(`Error cleaning up failed speech file:`, cleanupError);
        speechFiles.delete(speechFile);
      }
    }
    await message.channel.send(
      "An error occurred while generating the TTS audio."
    );
  }
}

/**
 * Clean up old speech files to prevent memory leaks
 */
async function cleanupOldSpeechFiles() {
  if (speechFiles.size <= 3) return;

  const filesToDelete = Array.from(speechFiles).slice(0, speechFiles.size - 3);
  
  for (const file of filesToDelete) {
    try {
      await fs.promises.unlink(file);
      speechFiles.delete(file);
      console.log(`Cleaned up old speech file: ${file}`);
    } catch (error) {
      console.error(`Error cleaning up old speech file ${file}:`, error);
      speechFiles.delete(file); // Remove from set even if deletion failed
    }
  }
}

export default respondToMessage;