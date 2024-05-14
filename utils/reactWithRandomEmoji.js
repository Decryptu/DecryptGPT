import { EMOJI_LIST } from "../config.js";

async function reactWithRandomEmoji(message) {
  const randomEmoji = EMOJI_LIST[Math.floor(Math.random() * EMOJI_LIST.length)];
  try {
    await message.react(randomEmoji);
  } catch (error) {
    console.error("Error adding reaction:", error);
  }
}

export default reactWithRandomEmoji;
