// events/ready.ts
import { type Client, ApplicationCommandOptionType } from "discord.js";
import { AI_NAME, DEFAULT_MODEL, GPT_MODELS, MODEL_SURNAMES } from "../config.js";
import setBotActivity from "../utils/setBotActivity.js";

interface ExtendedClient extends Client {
  currentModel?: string;
}

async function ready(client: ExtendedClient): Promise<void> {
  console.log(`[STARTUP] ${AI_NAME} is online!`);
  console.log(`[STARTUP] Default model: ${MODEL_SURNAMES[DEFAULT_MODEL]}`);

  client.currentModel = DEFAULT_MODEL;
  setBotActivity(client, client.currentModel);

  const commands = [
    {
      name: "model",
      description: "Choisir le modèle GPT",
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: "model",
          description: "Sélectionner le modèle",
          required: true,
          choices: [
            { name: MODEL_SURNAMES[GPT_MODELS.STANDARD], value: GPT_MODELS.STANDARD },
            { name: MODEL_SURNAMES[GPT_MODELS.REASONING], value: GPT_MODELS.REASONING }
          ]
        },
      ],
    },
    {
      name: "image",
      description: "Générer une image avec GPT-Image-1",
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: "description",
          description: "Description de l'image à générer",
          required: true,
        },
      ],
    },
    {
      name: "image-edit",
      description: "Modifier une image avec GPT-Image-1",
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: "description",
          description: "Description de la modification",
          required: true,
        },
        {
          type: ApplicationCommandOptionType.Attachment,
          name: "image",
          description: "L'image à modifier",
          required: true,
        },
      ],
    },
  ];

  try {
    await client.application?.commands.set(commands as any);
    console.log(`[COMMANDS] Registered ${commands.length} commands successfully`);
  } catch (error) {
    console.error("[COMMANDS] Error registering commands:", error);
  }
}

export default ready;
