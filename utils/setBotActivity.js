// utils/setBotActivity.js
import { MODEL_SURNAMES } from "../config.js";

function setBotActivity(client, model) {
  const modelName = MODEL_SURNAMES[model] || "Edgar";
  client.user?.setActivity(`✍🏻 ${modelName}`);
}

export default setBotActivity;