import {
	INITIAL_PROMPT,
	FINAL_PROMPT,
	PREV_MESSAGES_LIMIT,
	AI_NAME,
} from "../config.js";
import transcribeVoiceMessage from "./transcribeVoiceMessage.js";
import extractFileContent from "./extractFileContent.js";

const SUPPORTED_FILE_TYPES = [".pdf", ".txt", ".csv", ".xls", ".xlsx"];

async function buildConversationLog(message, client) {
	const conversationLog = [
		{
			role: "system",
			content: INITIAL_PROMPT(AI_NAME, message.author.username),
		},
	];

	const prevMessages = await message.channel.messages.fetch({
		limit: PREV_MESSAGES_LIMIT,
		before: message.id
	});
	
	// Convert to array and reverse to get chronological order (oldest first)
	const reversedMessages = Array.from(prevMessages.values()).reverse();
	
	for (const msg of reversedMessages) {
		if (
			msg.content.startsWith("!") ||
			(msg.author.bot && msg.author.id !== client.user.id)
		) {
			continue;
		}

		conversationLog.push({
			role: msg.author.id === client.user.id ? "assistant" : "user",
			content: msg.content,
		});
	}

	conversationLog.push({
		role: "system",
		content: FINAL_PROMPT(message.author.username),
	});

	const transcribedContent = await handleVoiceMessage(message);
	if (transcribedContent) {
		conversationLog.push({
			role: "user",
			content: transcribedContent,
		});
	}

	if (message.attachments.size > 0) {
		console.log(`Message contains ${message.attachments.size} attachments.`);
		const attachmentPromises = Array.from(message.attachments.values())
			.filter(attachment => !attachment.name.endsWith(".ogg"))
			.map(async (attachment) => {
				const isExtractableFile = SUPPORTED_FILE_TYPES.some(ext => 
					attachment.name.toLowerCase().endsWith(ext)
				);

				if (isExtractableFile) {
					return processExtractableFile(attachment);
				}

				if (attachment.contentType?.startsWith("image/")) {
					return {
						type: "image_url",
						image_url: { url: attachment.url, detail: "high" }
					};
				}

				return {
					type: "text",
					text: `Note: File ${attachment.name} is not a supported format.`
				};
			});

		const processedAttachments = (await Promise.all(attachmentPromises)).filter(
			Boolean,
		);

		if (processedAttachments.length > 0) {
			const userMessage = {
				role: "user",
				content: [
					{
						type: "text",
						text: message.content || "Please analyze this file.",
					},
					...processedAttachments,
				],
			};
			conversationLog.push(userMessage);
		}
	} else {
		conversationLog.push({
			role: "user",
			content: message.content,
		});
	}

	return conversationLog;
}

async function handleVoiceMessage(message) {
	const voiceAttachment = message.attachments.find((attachment) =>
		attachment.name.endsWith(".ogg"),
	);
	if (!voiceAttachment) return null;

	try {
		console.log(`Voice message URL: ${voiceAttachment.url}`);
		const transcribedContent = await transcribeVoiceMessage(
			voiceAttachment.url,
			process.env.API_KEY,
		);
		console.log(`Transcribed voice message: "${transcribedContent}"`);
		return transcribedContent;
	} catch (error) {
		console.error("Error transcribing voice message:", error);
		await message.channel.send(
			"An error occurred while processing the voice message.",
		);
		return null;
	}
}

async function processExtractableFile(attachment) {
	try {
		console.log(`Processing file: ${attachment.name}`);
		const extractedText = await extractFileContent(attachment);

		if (!extractedText?.trim()) {
			console.warn(`Warning: Extracted content from ${attachment.name} is empty`);
			return {
				type: "text",
				text: `Content from ${attachment.name}:\nThe file appears to be empty or could not be processed properly.`,
			};
		}

		return {
			type: "text",
			text: `Content from ${attachment.name}:\n${extractedText}`,
		};
	} catch (error) {
		console.error(`Error extracting content from ${attachment.name}:`, error);
		return {
			type: "text",
			text: `Failed to process ${attachment.name}: ${error.message}\nPlease check if the file is valid and not corrupted.`,
		};
	}
}

export default buildConversationLog;
