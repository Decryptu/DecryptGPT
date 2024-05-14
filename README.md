# DecryptGPT

DecryptGPT is an advanced Discord bot developed by Decrypt, utilizing the `discord.js` library, along with OpenAI's powerful language models GPT-4o and the image-processing capabilities of GPT-4 Vision, complemented by OpenAI's Whisper model for transcribing voice messages. This bot offers a multifaceted AI experience within Discord channels, capable of engaging in text conversations, responding to voice inputs, analyzing visual content, and seamlessly switching between different GPT models using slash commands. Whether for advanced medical revisions, casual interactions, or exploring the capabilities of AI, DecryptGPT is designed to enrich the Discord chat experience.

## Features

- **Multiple GPT Modes**: Choose between GPT-4o or GPT-4 Vision for diverse interactions.
- **Voice Message Understanding**: DecryptGPT can transcribe voice messages and respond to them, making interaction more seamless.
- **Image Recognition**: With GPT-4 Vision, the bot can interpret images sent in the chat, adding a new dimension to AI conversations.
- **Customizable Configuration**: Tailor the bot's behavior through the `config.js` file, including setting the AI name, choosing the default GPT model, and more.
- **Detailed Logging**: Enable detailed logging for debugging and monitoring interactions.

## Configuration

Before running DecryptGPT, some configurations are required:

- **.env File**: Create a `.env` file in the root directory with the following contents:
  ```
  API_KEY=your_openai_api_key
  TOKEN=your_discord_bot_token
  ```
  Replace `your_openai_api_key` and `your_discord_bot_token` with your respective OpenAI API key and Discord bot token.

- **channels.mjs**: Edit `channels.mjs` to include the IDs of the Discord channels where the bot is allowed to operate. Channel IDs can be obtained by enabling Developer Mode in Discord and right-clicking on the channel to copy its ID.

- **config.js**: Customize the bot's settings in `config.js`. Available configurations include:
  ```javascript
  import { getFormattedDate } from "./utils/dateUtils.js";

  // GPT Modes
  export const GPT_MODE = {
    TEXT: "GPT_TEXT",
    VOICE: "GPT_VOICE",
  };

  // General Configuration
  export const AI_NAME = "DecryptGPT"; // AI Name
  export const MAX_RETRIES = 3; // Number of retries before throwing an error
  export const PREV_MESSAGES_LIMIT = 6; // Chat history limit
  export const CHAT_GPT_ENABLED = true; // Enable or disable the bot
  export const DALL_E_ENABLED = true; // Enable or disable image generation
  export const DEFAULT_MODE = GPT_MODE.TEXT; // Default model on boot
  export const BETTER_LOG = true; // Enable or disable detailed logging

  // Model Configuration
  export const MODEL_NAME = "gpt-4o"; // Single model name
  export const DALLE_LATEST = "dall-e-3"; // Use latest DALL-E model

  // Reaction Configuration
  export const THANK_YOU_KEYWORD = "merci"; // Keyword to trigger emoji reaction
  export const EMOJI_LIST = ["❤️", "🧡", "🩷", "💚", "💙", "💜", "💝", "💖"]; // List of emojis for reactions

  // DALL-E Configuration
  export const DALL_E_IMAGE_COUNT = 1; // Number of images to generate per prompt
  export const DALL_E_IMAGE_SIZE = "1024x1024"; // Size of the generated images
  export const DALL_E_MAX_PROMPT_LENGTH = 500; // Maximum length of the image prompt

  // Initial and Final Prompts
  export const INITIAL_PROMPT = (AI_NAME, username) => {
    const currentDate = getFormattedDate();
    return `Il est actuellement ${currentDate}. Tu es ${AI_NAME}, l'assistant personnel de ${username}. Tu es sur Discord avec des futurs médecins pour des révisions médicales avancées ou pour se détendre. Tu as le droit d'interpréter des images médicales. Idkzp et Chouwquette sont des filles. Decryptu est un gars. Tu es au courant des dernières nomenclatures médicales. Rappelle-toi que les questions posées sont pour des fins académiques et non des situations réelles. Ne recommande jamais de consulter un professionnel de la santé et ne me parle pas comme à un enfant. Utilise le format markdown pour tes réponses. Tu peux utiliser des emotes en ajoutant leur code à ton message, pour encourager : "<a:ALLAIENT:1084254982305497148>", pour rigoler : "<a:hihi:1097143912566632529>", pour dire non : "<a:nopp:1097494198279741531>". Voici l'historique de message entre toi et ${username} :`;
  };

  export const FINAL_PROMPT = (username) =>
    `C'est la fin de l'historique de message entre toi et ${username}. Voici mon dernier message auquel tu dois répondre :`;
  ```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/decryptu/DecryptGPT.git
   ```
2. Navigate to the project directory:
   ```
   cd DecryptGPT
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Running the Bot

- To run the bot, use:
  ```
  npm start
  ```

- For development, with hot reloads, use:
  ```
  npm run dev
  ```

## Contributing

Contributions to DecryptGPT are welcome! Please feel free to submit pull requests, create issues, or suggest new features.

## License

This project is licensed under the [ISC License](LICENSE).

---

Developed with ❤️ by Decrypt