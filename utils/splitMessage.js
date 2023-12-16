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
  