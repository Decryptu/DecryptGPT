// utils/setBotActivity.ts
import type { Client } from "discord.js";
import { MODEL_SURNAMES } from "../config.js";

function setBotActivity(client: Client, model: string): void {
  const modelName = MODEL_SURNAMES[model] || "Edgar";
  client.user?.setActivity(`✍🏻 ${modelName}`);
}

export default setBotActivity;
