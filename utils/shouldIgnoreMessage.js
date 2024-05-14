import { allowedChannels } from "../channels.mjs";

function shouldIgnoreMessage(message) {
  return (
    message.author.bot ||
    !allowedChannels.includes(message.channel.id) ||
    message.content.startsWith("!")
  );
}

export default shouldIgnoreMessage;
