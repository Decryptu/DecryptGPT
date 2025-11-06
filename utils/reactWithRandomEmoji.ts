// utils/reactWithRandomEmoji.ts
import type { Message } from "discord.js";
import { EMOJI_LIST } from "../config.js";

async function reactWithRandomEmoji(message: Message): Promise<void> {
  try {
    const emoji = EMOJI_LIST[Math.floor(Math.random() * EMOJI_LIST.length)];
    await message.react(emoji);
  } catch (error) {
    console.error("Reaction error:", error);
  }
}

export default reactWithRandomEmoji;
