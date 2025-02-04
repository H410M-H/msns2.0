// src/lib/utils/pdf-reports.ts
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function generatePdf(
  data: Array<Record<string, unknown>>,
  headers: string[],
  title: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  function formatValue(value: unknown): string {
    if (value === null || value === undefined) return '';
    if (value instanceof Date) return value.toLocaleDateString();
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    
    if (typeof value === 'object') {
      // Handle arrays first
      if (Array.isArray(value)) {
        return value.map(item => formatValue(item)).join(', ');
      }
  
      // Handle plain objects
      const obj = value as Record<string, unknown>;
      const entries = Object.entries(obj)
        .map(([key, val]) => `${key}: ${formatValue(val)}`)
        .join(', ');
  
      return `{ ${entries} }`;
    }
  
    // Handle other types safely
    return String([value]);
  }
  // Add header
  page.drawText('ACADEMIC INSTITUTE', {
    x: 50,
    y: height - 40,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(title, {
    x: 50,
    y: height - 70,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  // Table setup
  const margin = 50;
  let y = height - 100;
  const rowHeight = 20;
  const columnWidths = [60, 100, 80, 80, 80, 60, 100, 80]; // Adjust based on your needs

  // Draw headers
  headers.forEach((header, colIndex) => {
    page.drawText(header, {
      x: margin + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0),
      y,
      size: 10,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
  });

  y -= rowHeight;

  // Draw rows
  data.forEach((row, rowIndex) => {
    headers.forEach((header, colIndex) => {
      const value = formatValue(row[header.toLowerCase()]);            page.drawText(value, {
        x: margin + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0),
        y: y - (rowIndex * rowHeight),
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
    });

    // Add horizontal line
    page.drawLine({
      start: { x: margin, y: y - (rowIndex * rowHeight) - 15 },
      end: { x: width - margin, y: y - (rowIndex * rowHeight) - 15 },
      thickness: 0.5,
      color: rgb(0, 0, 0),
    });
  });
  return pdfDoc.save();
}




