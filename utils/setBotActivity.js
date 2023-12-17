import { GPT_3, GPT_4, GPT_V } from '../config.js';

const modelStatusMap = {
  [GPT_4]: "🐇 GPT-4",
  [GPT_3]: "🐢 GPT-3.5",
  [GPT_V]: "👁️ GPT-4 Vision"
};

function setBotActivity(client, model) {
  const status = modelStatusMap[model] || "Idle";

  try {
    client.user.setActivity(status);
  } catch (error) {
    console.error("Error setting bot activity:", error);
  }
}

export default setBotActivity;
