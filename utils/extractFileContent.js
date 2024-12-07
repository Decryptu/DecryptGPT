import axios from 'axios';
import { PDFExtract } from 'pdf.js-extract';
import * as XLSX from 'xlsx';
import pkg from 'papaparse';
const { parse } = pkg;

async function extractFileContent(attachment) {
  const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data);

  const extension = attachment.name.split('.').pop().toLowerCase();

  switch (extension) {
    case 'pdf':
      return await extractPdfContent(buffer);
    case 'txt':
      return buffer.toString('utf-8');
    case 'csv':
      return await extractCsvContent(buffer);
    case 'xls':
    case 'xlsx':
      return extractExcelContent(buffer);
    default:
      throw new Error('Unsupported file type');
  }
}

async function extractPdfContent(buffer) {
  try {
    const pdfExtract = new PDFExtract();
    const data = await pdfExtract.extractBuffer(buffer);
    return data.pages
      .map(page => page.content.map(item => item.str).join(' '))
      .join('\n\n');
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
}

async function extractCsvContent(buffer) {
  try {
    const csvText = buffer.toString('utf-8');
    const result = parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    });

    // Format CSV data into a readable table structure
    if (result.data.length === 0) return 'Empty CSV file';

    const headers = Object.keys(result.data[0]);
    const summary = `Table with ${result.data.length} rows and the following columns: ${headers.join(', ')}\n\n`;
    
    // Convert data to a readable format
    const formattedData = result.data.slice(0, 10).map(row => {
      return headers.map(header => `${header}: ${row[header]}`).join(', ');
    }).join('\n');

    return summary + formattedData + (result.data.length > 10 ? '\n\n[Table truncated, showing first 10 rows]' : '');
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw new Error('Failed to parse CSV file');
  }
}

function extractExcelContent(buffer) {
  try {
    const workbook = XLSX.read(buffer);
    const result = [];

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      if (data.length === 0) continue;

      const headers = Object.keys(data[0]);
      const summary = `Sheet "${sheetName}" with ${data.length} rows and the following columns: ${headers.join(', ')}\n\n`;
      
      // Convert data to a readable format
      const formattedData = data.slice(0, 10).map(row => {
        return headers.map(header => `${header}: ${row[header]}`).join(', ');
      }).join('\n');

      result.push(summary + formattedData + (data.length > 10 ? '\n\n[Table truncated, showing first 10 rows]' : ''));
    }

    return result.join('\n\n=== Next Sheet ===\n\n') || 'Empty Excel file';
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    throw new Error('Failed to parse Excel file');
  }
}

export default extractFileContent;