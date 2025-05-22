import { GPT_MODE, MODEL_SURNAMES } from "../config.js";

function setBotActivity(client, mode, model) {
  const modeStatus = mode === GPT_MODE.TEXT ? "✍🏻" : "🎙️";
  const modelSurname = MODEL_SURNAMES[model] || "Edgar";
  const status = `${modeStatus} ${modelSurname}`;

  try {
    client.user.setActivity(status);
  } catch (error) {
    console.error("Error setting bot activity:", error);
  }
}

export default setBotActivity;