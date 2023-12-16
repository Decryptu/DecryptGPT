import { GPT_3, GPT_4, GPT_V } from '../config.js';

function setBotActivity(client, model) {
  let status = "";
  switch (model) {
    case GPT_4:
      status = "🐇 GPT-4";
      break;
    case GPT_3:
      status = "🐢 GPT-3.5";
      break;
    case GPT_V:
      status = "👁️ GPT-4 Vision";
      break;
    default:
      status = "Idle";
  }
  client.user.setActivity(status);
}

export default setBotActivity;
