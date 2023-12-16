function setBotActivity(client, model) {
    let status = "";
    switch (model) {
      case 'gpt-4-1106-preview':
        status = "🐇 GPT-4";
        break;
      case 'gpt-3.5-turbo-1106':
        status = "🐢 GPT-3.5";
        break;
      case 'gpt-4-vision-preview':
        status = "👁️ GPT-4 Vision";
        break;
      default:
        status = "Idle";
    }
    client.user.setActivity(status);
  }
  
  export default setBotActivity;
  