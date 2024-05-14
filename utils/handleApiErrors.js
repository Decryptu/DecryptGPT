async function handleApiErrors(message, error) {
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
  } else {
    await message.channel.send(
      "An error occurred while processing your request. Please contact Decrypt if the problem persists."
    );
  }
}

export default handleApiErrors;
