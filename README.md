# DecryptGPT

DecryptGPT is an advanced Discord bot developed by Decrypt, utilizing the `discord.js` library along with OpenAI's latest models including GPT-4o, GPT-4.1, and o3. The bot features image generation and editing capabilities using GPT-Image-1, voice message transcription with Whisper, and comprehensive document processing. Designed specifically for medical students and professionals, Edgar provides academic assistance and AI-powered conversations in French, making it ideal for advanced medical revisions and study sessions.

## Features

- **Multiple AI Models**: Switch between GPT-4o (Edgar), GPT-4.1 (Edgar +), and o3 (Edgar ++) for different conversation experiences
- **Text and Voice Modes**: Toggle between text and voice interaction modes
- **Voice Message Transcription**: Automatically transcribes voice messages using OpenAI's Whisper model
- **Image Analysis**: Interprets and analyzes medical images and other visual content
- **Image Generation**: Create new images from text descriptions using GPT-Image-1
- **Image Editing**: Modify existing images based on text instructions
- **Document Processing**: Extract and analyze content from various file formats:
  - PDF documents
  - Text files (.txt)
  - CSV files with data analysis
  - Excel files (.xls, .xlsx) including multiple sheets
- **Medical Focus**: Specialized prompts and responses tailored for medical education and revision
- **French Language Support**: Primary language support for French medical terminology and conversations
- **Custom Emotes**: Uses Discord emotes for enhanced interaction feedback
- **Graceful Shutdown**: Proper cleanup and shutdown handling

## Slash Commands

DecryptGPT supports the following slash commands:

- `/gpt-model` — Switch between AI models (GPT-4o, GPT-4.1, o3)
- `/gpt-mode` — Toggle between text and voice interaction modes
- `/image-gpt` — Generate new images from text descriptions using GPT-Image-1
- `/image-edit` — Upload an image and modify it with text instructions

All commands include comprehensive logging for monitoring and debugging purposes.

## Configuration

Before running DecryptGPT, configure the following:

### Environment Variables

Create a `.env` file in the root directory:

```bash
API_KEY=your_openai_api_key
TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_app_client_id
```

Replace the placeholder values with your actual OpenAI API key and Discord bot credentials.

### Channel Configuration

- **channels.mjs**: Add Discord channel IDs where the bot should operate. Enable Developer Mode in Discord and right-click channels to copy their IDs.

### Bot Settings

- **config.js**: Customize bot behavior including:
  - AI personality and prompts (currently optimized for French medical education)
  - Default model and mode settings
  - Token limits and retry configurations
  - Image generation settings

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Decryptu/DecryptGPT.git
```

2. Navigate to the project directory:

```bash
cd DecryptGPT
```

3. Install dependencies:

```bash
bun install
```

## Running the Bot

- **Production**: `bun start`
- **Development** (with auto-reload): `bun run dev`

## Usage Examples

### Generate an image

```
/image-gpt description: "A detailed anatomical diagram of the human heart"
```

### Edit an uploaded image

```
/image-edit image: [Upload your image] description: "Add labels to the anatomical structures"
```

### Switch AI models

```
/gpt-model model: o3
```

### Change interaction mode

```
/gpt-mode mode: voice
```

## Development

The bot is built with modern JavaScript (ES modules) and includes:

- **Discord.js v14**: Latest Discord API support
- **OpenAI API v4**: Access to latest AI models
- **Modular Architecture**: Organized command and event handling
- **Error Handling**: Comprehensive error logging and recovery
- **Document Processing**: Support for multiple file formats
- **Image Processing**: Generation and editing capabilities

## Node.js Requirements

- Node.js >= 18.0.0

## Contributing

Contributions to DecryptGPT are welcome! Feel free to submit pull requests, create issues, or suggest new features.

## License

This project is licensed under the ISC License.

---

Developed with ❤️ by Decrypt
