# DecryptGPT

DecryptGPT is an advanced Discord bot developed by Decrypt, utilizing the `discord.js` library, OpenAI's powerful language models GPT-3, GPT-4, and the image-processing capabilities of GPT-4 Vision, along with OpenAI's Whisper model for transcribing voice messages. This bot offers a multifaceted AI experience within Discord channels, capable of engaging in text conversations, responding to voice inputs, and analyzing visual content.

## Features

- **Multiple GPT Modes**: Choose between GPT-3, GPT-4, or GPT-4 Vision for diverse interactions.
- **Voice Message Understanding**: DecryptGPT can transcribe voice messages and respond to them, making interaction more seamless.
- **Image Recognition**: With GPT-4 Vision, the bot can interpret images sent in the chat, adding a new dimension to AI conversations.
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
  export const PREV_MESSAGES_LIMIT = 6; // Limit of previous messages to fetch
  export const AI_NAME = 'Edgar'; // AI's name
  export const GPT_3 = 'gpt-3.5-turbo-1106'; // GPT-3 model
  export const GPT_4 = 'gpt-4-1106-preview'; // GPT-4 model
  export const GPT_V = 'gpt-4-vision-preview'; // GPT-4 Vision model
  export const DEFAULT_MODEL = GPT_3; // Default model on startup
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