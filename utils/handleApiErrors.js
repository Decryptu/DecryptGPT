async function handleApiErrors(message, error) {
  console.error("API Error details:", error);
  
  // Check for specific error types
  if (error.response && error.response.status === 401) {
    await message.channel.send(
      "Authentication issue with the OpenAI API. Please check the API keys."
    );
  } else if (
    (error.response && error.response.status === 429) ||
    (error.code && error.code === "insufficient_quota")
  ) {
    await message.channel.send(
      "OpenAI API quota limit exceeded. Please wait or upgrade your plan for more usage. For more information, visit https://platform.openai.com/docs/guides/error-codes/api-errors."
    );
  } else if (error.code === 'unsupported_parameter') {
    // Handle model-specific parameter errors
    await message.channel.send(
      `Model parameter error: ${error.message}. Please contact Decrypt to update the bot configuration.`
    );
  } else {
    await message.channel.send(
      "An error occurred while processing your request. Please contact Decrypt if the problem persists."
    );
  }
}

export default handleApiErrors;