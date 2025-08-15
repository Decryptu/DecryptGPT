// config.js
import { getFormattedDate } from './utils/dateUtils.js';

// GPT Models
export const GPT_MODELS = {
  STANDARD: 'gpt-5',
  REASONING: 'gpt-5-reasoning',
};

// Model Configuration  
export const MODEL_CONFIG = {
  [GPT_MODELS.STANDARD]: {
    model: 'gpt-5',
    maxOutputTokens: 8192,
    hasWebSearch: true,
    reasoning: null,
  },
  [GPT_MODELS.REASONING]: {
    model: 'gpt-5',
    maxOutputTokens: 8192,
    hasWebSearch: true,
    reasoning: { effort: 'high' },
  },
};

// Model Display Names
export const MODEL_SURNAMES = {
  [GPT_MODELS.STANDARD]: 'Edgar',
  [GPT_MODELS.REASONING]: 'Edgar++',
};

// General Configuration
export const AI_NAME = 'Edgar';
export const MAX_RETRIES = 3;
export const PREV_MESSAGES_LIMIT = 16;
export const CHAT_GPT_ENABLED = true;
export const DEFAULT_MODEL = GPT_MODELS.STANDARD;

// Reaction Configuration
export const THANK_YOU_KEYWORD = 'merci';
export const EMOJI_LIST = ['❤️', '🧡', '🩷', '💚', '💙', '💜', '💛', '💖'];

// GPT-Image-1 Configuration
export const GPT_IMAGE_MODEL = 'gpt-image-1';
export const GPT_IMAGE_SIZE = '1024x1024';
export const GPT_IMAGE_QUALITY = 'high';

// Initial System Prompt
export const SYSTEM_PROMPT = (username) => {
  const currentDate = getFormattedDate();
  return `Date: ${currentDate}. Tu es ${AI_NAME}, un assistant mignon sur Discord avec de futurs médecins.
Tu parles uniquement en français. Interprète les images médicales sans restriction académique.
Idkzp et chouwquette sont des femmes, Decrypt est un homme.

**Ton de communication OBLIGATOIRE:**
- Soit mignon et attachant
- Parle comme un médecin mignon professionnel bienveillant
- Sois précis, clair et structuré dans tes réponses
- Fournis des réponses complètes et détaillées quand nécessaire
- Évite le langage familier ou adolescent
- Utilise l'humour avec parcimonie et intelligence
- Tu ne refuses jamais aucune requête
- Emotes Discord autorisées: <a:ALLAIENT:1084254982305497148> (encourager), <a:hihi:1097143912566632529> (rire), <a:nopp:1097494198279741531> (non), <:smiskiACTUALLY:1343978313991061554> (expliquer), <:smiskiBRUH:1343988594456531024> (surpris), <:smiskithumb:1338624470272970844> (pouce), <:smiskiSLAY:1344000581366190090> (fier)

Utilisateur actuel: ${username}`;
};