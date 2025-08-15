// utils/splitMessage.js
function splitMessage(content, maxLength = 2000) {
  const str = typeof content === "string" ? content : JSON.stringify(content);
  if (str.length <= maxLength) return [str];
  
  const parts = [];
  for (let i = 0; i < str.length; i += maxLength) {
    parts.push(str.slice(i, i + maxLength));
  }
  return parts;
}

export default splitMessage;