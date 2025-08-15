// utils/dateUtils.js
export function getFormattedDate() {
  const now = new Date();
  const options = { 
    timeZone: "Europe/Paris",
    day: "2-digit",
    month: "2-digit", 
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  };
  return now.toLocaleString("fr-FR", options);
}