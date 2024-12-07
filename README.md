# DecryptGPT

DecryptGPT is an advanced Discord bot developed by Decrypt, utilizing the `discord.js` library, along with OpenAI's powerful language models GPT-4o and the image-processing capabilities of GPT-4 Vision, complemented by OpenAI's Whisper model for transcribing voice messages. This bot offers a comprehensive AI experience within Discord channels, capable of engaging in text conversations, responding to voice inputs, analyzing visual content, processing documents (pdf, csv...), and seamlessly switching between different GPT models using slash commands. Whether for advanced medical revisions, casual interactions, or exploring the capabilities of AI, DecryptGPT is designed to enrich the Discord chat experience.

## Features

- **Multiple GPT Modes**: Choose between GPT-4o or GPT-4 Vision for diverse interactions.
- **Voice Message Understanding**: DecryptGPT can transcribe voice messages and respond to them, making interaction more seamless.
- **Image Recognition**: With GPT-4 Vision, the bot can interpret images sent in the chat, adding a new dimension to AI conversations.
- **Document Processing**: The bot can analyze and extract text from various file formats:
  - PDF documents
  - Text files (.txt)
  - CSV files (with data analysis capabilities)
  - Excel files (.xls, .xlsx) including multiple sheets
- **Customizable Configuration**: Tailor the bot's behavior through the `config.js` file, including setting the AI name, choosing the default GPT model, and more.
- **Detailed Logging**: Enable detailed logging for debugging and monitoring interactions.

## Configuration

Before running DecryptGPT, some configurations are required:

- **.env File**: Create a `.env` file in the root directory with the following contents:

  ```bash
  API_KEY=your_openai_api_key
  TOKEN=your_discord_bot_token
  ```

  Replace `your_openai_api_key` and `your_discord_bot_token` with your respective OpenAI API key and Discord bot token.

- **channels.mjs**: Edit `channels.mjs` to include the IDs of the Discord channels where the bot is allowed to operate. Channel IDs can be obtained by enabling Developer Mode in Discord and right-clicking on the channel to copy its ID.

- **config.js**: Customize the bot's settings in `config.js`.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/decryptu/DecryptGPT.git
   ```

2. Navigate to the project directory:

   ```bash
   cd DecryptGPT
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Install additional packages for document processing:

   ```bash
   npm install pdf.js-extract xlsx
   ```

## Running the Bot

- To run the bot, use:

  ```bash
  npm start
  ```

- For development, with hot reloads, use:

  ```bash
  npm run dev
  ```

## Contributing

Contributions to DecryptGPT are welcome! Please feel free to submit pull requests, create issues, or suggest new features.

## License

This project is licensed under the [ISC License](LICENSE).

---

Developed with ❤️ by Decrypt
