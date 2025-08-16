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
bun install
```

### Configuration

Create `.env` file:

```env
API_KEY=your_openai_api_key
TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_app_client_id
```

Add allowed channel IDs in `channels.mjs`.

## Usage

**Production**: `bun start`  
**Development**: `bun run dev`

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

- **Discord.js v14** - Discord API integration
- **OpenAI Responses API** - Unified AI interface
- **ES Modules** - Modern JavaScript architecture

## License

ISC License

---

Built by Decrypt
