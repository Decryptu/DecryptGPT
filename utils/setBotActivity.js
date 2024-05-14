import { GPT_MODE } from "../config.js";

const modeStatusMap = {
  [GPT_MODE.TEXT]: "✍🏻 GPT-TEXT",
  [GPT_MODE.VOICE]: "🎙️ GPT-VOICE",
};

function setBotActivity(client, mode) {
  const status = modeStatusMap[mode] || "Idle";

  try {
    client.user.setActivity(status);
  } catch (error) {
    console.error("Error setting bot activity:", error);
  }
}

export default setBotActivity;
