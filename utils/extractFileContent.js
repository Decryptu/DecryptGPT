import axios from 'axios';
import { PDFExtract } from 'pdf.js-extract';

async function extractFileContent(attachment) {
  const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data);

  if (attachment.name.endsWith('.pdf')) {
    try {
      const pdfExtract = new PDFExtract();
      const data = await pdfExtract.extractBuffer(buffer);
      const text = data.pages
        .map(page => page.content.map(item => item.str).join(' '))
        .join('\n\n');
      return text;
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Failed to parse PDF file');
    }
  } else if (attachment.name.endsWith('.txt')) {
    return buffer.toString('utf-8');
  }

  throw new Error('Unsupported file type');
}

export default extractFileContent;