import axios from 'axios';
import { PDFExtract } from 'pdf.js-extract';
import * as XLSX from 'xlsx';
import pkg from 'papaparse';
const { parse } = pkg;

async function extractFileContent(attachment) {
  try {
    console.log(`Starting to download file from URL: ${attachment.url}`);
    const response = await axios.get(attachment.url, { 
      responseType: 'arraybuffer',
      timeout: 30000 // 30 second timeout to prevent hanging
    });
    
    console.log(`Downloaded file ${attachment.name}, size: ${response.data.byteLength} bytes`);
    const buffer = Buffer.from(response.data);

    const extension = attachment.name.split('.').pop().toLowerCase();
    console.log(`Processing file with extension: ${extension}`);

    let content = '';
    
    switch (extension) {
      case 'pdf':
        content = await extractPdfContent(buffer);
        break;
      case 'txt':
        content = buffer.toString('utf-8');
        break;
      case 'csv':
        content = await extractCsvContent(buffer);
        break;
      case 'xls':
      case 'xlsx':
        content = extractExcelContent(buffer);
        break;
      default:
        content = `Unsupported file type: ${extension}`;
    }
    
    // Check if content is empty and provide feedback
    if (!content || content.trim() === '') {
      return `The file ${attachment.name} appears to be empty or could not be processed.`;
    }
    
    console.log(`Successfully extracted content from ${attachment.name}, length: ${content.length} characters`);
    return content;
  } catch (error) {
    console.error(`Error processing file ${attachment.name}:`, error);
    
    // Return a user-friendly error message that will be visible in the chat
    return `Error processing file ${attachment.name}: ${error.message}. Please check if the file is valid and not corrupted.`;
  }
}

async function extractPdfContent(buffer) {
  try {
    const pdfExtract = new PDFExtract();
    const options = {}; // You can add options here if needed
    
    // Use more explicit error handling
    const data = await pdfExtract.extractBuffer(buffer, options);
    
    // Add validation to check if we actually got pages
    if (!data || !data.pages || data.pages.length === 0) {
      console.error('PDF extraction returned empty data structure');
      return 'Please inform user the PDF appears to be empty or could not be parsed properly.';
    }
    
    // Add logging to help debug
    console.log(`Successfully extracted ${data.pages.length} pages from PDF`);
    
    // Improve text extraction to handle various PDF structures
    return data.pages
      .map((page, pageIndex) => {
        if (!page.content || page.content.length === 0) {
          return `[Please inform user that page ${pageIndex + 1} appears to be empty or contains only images]`;
        }
        
        return `--- Page ${pageIndex + 1} ---\n${page.content.map(item => item.str).join(' ')}`;
      })
      .join('\n\n');
  } catch (error) {
    console.error('Error parsing PDF:', error);
    // Return a more descriptive error that will be visible to the user
    return `Please inform user we failed to parse PDF file: ${error.message}. The PDF might be encrypted, damaged, or in an unsupported format.`;
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