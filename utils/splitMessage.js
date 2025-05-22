/**
 * Splits a message into parts, each not exceeding a specified maximum length.
 * Handles strings and objects (converted to JSON strings).
 *
 * @param {string|object} content - The content to be split.
 * @param {number} maxLength - The maximum length of each part.
 * @returns {string[]} An array of message parts.
 */
function splitMessage(content, maxLength = 2000) {
  const contentStr = typeof content === "string" ? content : JSON.stringify(content);
  
  if (contentStr.length <= maxLength) return [contentStr];
  
  const parts = [];
  for (let i = 0; i < contentStr.length; i += maxLength) {
    parts.push(contentStr.slice(i, i + maxLength));
  }
  return parts;
}

export default splitMessage;
