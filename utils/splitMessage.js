/**
 * Splits a message into parts, each not exceeding a specified maximum length.
 * Handles strings and objects (converted to JSON strings).
 * 
 * @param {string|object} content - The content to be split.
 * @param {number} maxLength - The maximum length of each part.
 * @returns {string[]} An array of message parts.
 */
function splitMessage(content, maxLength = 2000) {
  let contentStr = typeof content === 'string' ? content : JSON.stringify(content);
  const parts = [];

  while (contentStr.length > 0) {
    let part = contentStr.slice(0, maxLength);
    contentStr = contentStr.slice(maxLength);
    parts.push(part);
  }

  return parts;
}

export default splitMessage;
