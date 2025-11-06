# EdgarGPT

EdgarGPT is a Discord bot powered by OpenAI's latest GPT-5 model and Responses API. Built for medical students and professionals, it provides AI-powered assistance in French with advanced document processing, image analysis, and web search capabilities.

## Features

- **Dual AI Modes**: Edgar (GPT-5) and Edgar++ (GPT-5 with reasoning)
- **Voice Transcription**: Processes Discord voice messages with Whisper
- **Image Analysis**: Medical image interpretation without restrictions
- **Image Generation & Editing**: Create and modify images with GPT-Image-1
- **Document Processing**: Direct file analysis through Responses API (PDF, TXT, CSV, Excel)
- **Web Search**: Real-time information retrieval when needed
- **Medical Focus**: Optimized for medical education in French
- **Smart Context**: Maintains conversation history for coherent discussions

## Commands

- `/model` — Switch between Edgar and Edgar++ modes
- `/image` — Generate images from text descriptions
- `/image-edit` — Modify uploaded images with text prompts

## Setup

### Prerequisites

- Node.js >= 18.0.0
- OpenAI API key
- Discord bot token

### Installation

```bash
git clone https://github.com/Decryptu/EdgarGPT.git
cd EdgarGPT
npm install
```

### Configuration

Create `.env` file:

```env
API_KEY=your_openai_api_key
TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_app_client_id
```

Copy and configure the example files:

```bash
cp config.example.ts config.ts
cp channels.example.ts channels.ts
```

Edit `channels.ts` to add your allowed channel IDs.

## Usage

**Development**: `npm run dev`

**Production**:
```bash
npm run build
npm start
```

### Examples

Generate an image:

```txt
/image description: "anatomical diagram of the human heart"
```

Switch to reasoning mode:

```txt
/model model: Edgar++
```

## Tech Stack

- **TypeScript** - Type-safe development
- **Discord.js v14** - Discord API integration
- **OpenAI Responses API** - Unified AI interface

## License

ISC License

---

Built by Decrypt
