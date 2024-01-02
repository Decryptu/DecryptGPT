# DecryptGPT

DecryptGPT is an advanced Discord bot developed by Decrypt, utilizing the `discord.js` library, along with OpenAI's powerful language models GPT-3, GPT-4, and the image-processing capabilities of GPT-4 Vision. Now featuring OpenAI's DALL-E for image generation, and complemented by OpenAI's Whisper model for transcribing voice messages, this bot offers a multifaceted AI experience within Discord channels. Capable of engaging in text conversations, responding to voice inputs, analyzing and generating visual content, and seamlessly switching between different GPT models using slash commands, DecryptGPT is designed to enrich the Discord chat experience, whether for advanced medical revisions, casual interactions, or exploring the capabilities of AI.

**Note**: The `/gpt3` and `/gpt4` slash commands are provided to switch the bot's underlying model for future interactions. Once set, the bot will continue to use the selected model for all responses in the allowed channels. It's not necessary to use these commands before each interaction.

## Features

- **Multiple GPT Modes**: Choose between GPT-3, GPT-4, or GPT-4 Vision for diverse interactions.
- **Voice Message Understanding**: DecryptGPT can transcribe voice messages and respond to them, making interaction more seamless.
- **Image Recognition**: With GPT-4 Vision, the bot can interpret images sent in the chat, adding a new dimension to AI conversations.
- **Image Generation with DALL-E**: Generate images from textual descriptions using DALL-E, adding a creative flair to the Discord experience.
- **Customizable Configuration**: Tailor the bot's behavior through the `config.js` file, including setting the AI name, choosing the default GPT model, and more.

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
  export const MAX_RETRIES = 3; // Number of retries before throwing an error
  export const CHAT_GPT_ENABLED = true; // Enable or disable the bot
  export const DALL_E_ENABLED = true; // Enable or disable image generation
  export const PREV_MESSAGES_LIMIT = 6; // Limit of previous messages to fetch
  export const AI_NAME = 'Edgar'; // AI's name
  export const GPT_3 = 'gpt-3.5-turbo-1106'; // GPT-3 model
  export const GPT_4 = 'gpt-4-1106-preview'; // GPT-4 model
  export const GPT_V = 'gpt-4-vision-preview'; // GPT-4 Vision model
  export const DEFAULT_MODEL = GPT_3; // Default model on startup
  export const THANK_YOU_KEYWORD = 'merci'; // Keyword to trigger emoji reaction
  export const EMOJI_LIST = ['❤️', '🧡', '🩷', '💚', '💙', '💜', '💝', '💖']; // List of emojis for reactions
  export const INITIAL_PROMPT = (AI_NAME, username) => `You are ${AI_NAME}, you will assist ${username}, a student. This is our chat history:`; // Initial conversation prompt
  export const FINAL_PROMPT = "This is the end of chat history between us, here is my request:"; // Final conversation prompt
  export const DALL_E_IMAGE_COUNT = 1; // Number of images to generate per prompt
  export const DALL_E_IMAGE_SIZE = "1024x1024"; // Size of the generated images
  export const DALL_E_MAX_PROMPT_LENGTH = 100; // Maximum length of the image prompt
  ```

## Discord Gateway Intents Configuration

To ensure the bot functions correctly, you must configure Discord Gateway Intents in the Discord Developer Portal. This allows the bot to listen to specific events on your Discord server. Follow these steps:

1. Navigate to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Select your application (bot).
3. Click on the "Bot" section in the settings menu.
4. Scroll down to "Privileged Gateway Intents."
5. Enable the following intents based on your bot's needs:
   - `SERVER MEMBERS INTENT` (if your bot uses server member data)
   - `MESSAGE CONTENT INTENT` (for reading message content in text channels)
   - `PRESENCE INTENT` (if your bot uses presence data, like user status)
6. Save your changes.

Without these intents, the bot may not be able to access all the necessary data from your Discord server and could encounter issues like the "Used disallowed intents" error.

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