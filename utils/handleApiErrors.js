// utils/handleApiErrors.js
async function handleApiErrors(message, error) {
  console.error("API Error:", error);
  
  const errorMessage = error.response?.status === 401 
    ? "Problème d'authentification API."
    : error.response?.status === 429 
    ? "Limite de quota dépassée."
    : "Erreur lors du traitement. Contactez Decrypt si le problème persiste.";
    
  await message.channel.send(errorMessage);
}

export default handleApiErrors;