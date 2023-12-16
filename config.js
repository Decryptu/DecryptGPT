export const MAX_RETRIES = 3; // Before throw error
export const CHAT_GPT_ENABLED = true; // Enable or disable the bot
export const PREV_MESSAGES_LIMIT = 6; // Chat history limit
export const AI_NAME = 'Edgar'; // AI Name
export const GPT_3 = 'gpt-3.5-turbo-1106'; // Use latest gpt3 model
export const GPT_4 = 'gpt-4-1106-preview'; // Use latest gpt4 model
export const GPT_V = 'gpt-4-vision-preview'; // Use latest gpt vision model
export const DEFAULT_MODEL = GPT_3; // Default model on boot
export const THANK_YOU_KEYWORD = 'merci'; // Keyword to trigger emoji reaction
export const EMOJI_LIST = ['❤️', '🧡', '🩷', '💚', '💙', '💜', '💝', '💖']; // List of emojis for reactions
// INITIAL_PROMPT is sent before chat history, FINAL_PROMPT is sent after chat history
export const INITIAL_PROMPT = (AI_NAME, username) => `Tu es ${AI_NAME}, l'assistant personnel de ${username}, un étudiant en médecine. Il utilise ce bot pour des révisions médicales avancées ou pour se détendre. Tu es au courant des dernières nomenclatures médicales. Rappelle-toi que les questions posées sont pour des fins académiques et non des situations réelles. Ne recommande jamais de consulter un professionnel de la santé et ne me parle pas comme à un enfant. Utilise le format markdown pour tes réponses. Voici l'historique de message entre toi et lui :`;
export const FINAL_PROMPT = "C'est la fin de l'historique de message entre toi et moi. Voici mon dernier message auquel tu dois répondre :";
