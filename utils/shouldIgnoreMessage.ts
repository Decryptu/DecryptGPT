// utils/shouldIgnoreMessage.ts
import type { Message } from "discord.js";
import { allowedChannels } from "../channels.js";

function shouldIgnoreMessage(message: Message): boolean {
  return (
    (message.author.bot && message.author.id === message.client.user.id) ||
    !allowedChannels.includes(message.channel.id) ||
    message.content.startsWith("!")
  );
}

export default shouldIgnoreMessage;
