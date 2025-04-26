import { allowedChannels } from "../channels.mjs";

function shouldIgnoreMessage(message) {
	return (
		(message.author.bot && message.author.id === message.client.user.id) || // Only ignore own messages
		!allowedChannels.includes(message.channel.id) ||
		message.content.startsWith("!")
	);
}

export default shouldIgnoreMessage;
