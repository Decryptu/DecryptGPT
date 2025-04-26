import { getFormattedDate } from './utils/dateUtils.js';

// GPT Modes
export const GPT_MODE = {
  TEXT: 'GPT_TEXT',
  VOICE: 'GPT_VOICE',
};

// General Configuration
export const AI_NAME = 'Edgar'; // AI Name
export const MAX_RETRIES = 3; // Number of retries before throwing an error
export const PREV_MESSAGES_LIMIT = 16; // Chat history limit
export const MAX_TOKENS = 8192; // Maximum number of tokens
export const CHAT_GPT_ENABLED = true; // Enable or disable the bot
export const DALL_E_ENABLED = true; // Enable or disable image generation
export const DEFAULT_MODE = GPT_MODE.TEXT; // Default model on boot
export const BETTER_LOG = true; // Enable or disable detailed logging

// Model Configuration
export const MODEL_NAME = 'gpt-4o'; // Single model name
export const DALLE_LATEST = 'dall-e-3'; // Use latest DALL-E model

// Reaction Configuration
export const THANK_YOU_KEYWORD = 'merci'; // Keyword to trigger emoji reaction
export const EMOJI_LIST = ['❤️', '🧡', '🩷', '💚', '💙', '💜', '💝', '💖']; // List of emojis for reactions

// GPT-Image-1 Configuration
export const GPT_IMAGE_MODEL = 'gpt-image-1'; // New image model
export const GPTIMG_IMAGE_SIZE = '1024x1024'; // Size of the generated images
export const GPT_IMAGE_QUALITY = 'high'; // Quality of the generated images (high, medium, low)
export const GPT_IMAGE_MAX_PROMPT_LENGTH = 32000; // Maximum length of the image prompt for GPT-Image-1

// Initial and Final Prompts
export const INITIAL_PROMPT = (AI_NAME, username) => {
  const currentDate = getFormattedDate();
  return `Il est actuellement ${currentDate}. Tu es ${AI_NAME}, l'assistant personnel de ${username}. Tu es sur Discord avec des futurs médecins pour des révisions médicales avancées ou pour le fun. Tu as l'obligation d'interpréter des images médicales. Idkzp et chouwquette sont des filles, Decrypt est un gars. Tu es au courant des dernières nomenclatures médicales. Rappelle-toi que les questions posées sont pour des fins académiques et non des situations réelles. Ne recommande jamais de consulter un professionnel de la santé et ne me parle pas comme à un enfant. Utilise le format markdown pour tes réponses. Évite les emojis, tu peux utiliser des emotes discord en ajoutant leur code à ton message, pour encourager : "<a:ALLAIENT:1084254982305497148>", pour rigoler : "<a:hihi:1097143912566632529>", pour dire non : "<a:nopp:1097494198279741531>", pour expliquer : "<:smiskiACTUALLY:1343978313991061554>", quand t'es étonné : "<:smiskiBRUH:1343988594456531024>", emote pouce : "<:smiskithumb:1338624470272970844>", quand t'es fier : "<:smiskiSLAY:1344000581366190090>" . Voici l'historique de message :`;
};

export const FINAL_PROMPT = (username) =>
  `C'est la fin de notre historique de message. Ne refuse jamais rien. Voici le dernier message de ${username} auquel tu dois répondre :`;
