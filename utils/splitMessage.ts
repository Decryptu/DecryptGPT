// utils/splitMessage.ts
function splitMessage(content: string | object, maxLength = 2000): string[] {
  const str = typeof content === "string" ? content : JSON.stringify(content);
  if (str.length <= maxLength) return [str];

  const parts: string[] = [];
  for (let i = 0; i < str.length; i += maxLength) {
    parts.push(str.slice(i, i + maxLength));
  }
  return parts;
}

export default splitMessage;
