// src/lib/utils/pdf-reports.ts
import { PDFDocument, StandardFonts, rgb, type PDFPage, type PDFFont } from 'pdf-lib';

export async function generatePdf(
  data: Array<Record<string, unknown>>,
  headers: string[],
  title: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Add header
  const headerHeight = 60;
  page.drawRectangle({
    x: 0,
    y: height - headerHeight,
    width,
    height: headerHeight,
    color: rgb(0.2, 0.4, 0.6),
  });
  
  page.drawText('ACADEMIC INSTITUTE', {
    x: 50,
    y: height - 40,
    size: 18,
    font: boldFont,
    color: rgb(1, 1, 1),
  });
  
  page.drawText(new Date().toLocaleDateString(), {
    x: width - 100,
    y: height - 40,
    size: 12,
    font,
    color: rgb(1, 1, 1),
  });

  // Add title
  page.drawText(title, {
    x: 50,
    y: height - 90,
    size: 16,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Table setup
  const margin = 50;
  const rowHeight = 20;
  const columnWidths = new Array(headers.length).fill(120); // Fixed column width initialization
  let y = height - 120;
  let currentPage = 1;

  // Add table headers
  page.drawRectangle({
    x: margin,
    y: y - rowHeight,
    width: width - 2 * margin,
    height: rowHeight,
    color: rgb(0.9, 0.9, 0.9),
  });

  headers.forEach((header, index) => {
    const safeIndex = Math.min(index, columnWidths.length - 1);
    page.drawText(header, {
      x: margin + (safeIndex * columnWidths[safeIndex]) + 5,
      y: y - 15,
      size: 12,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });
  });

  y -= 40;

  // Add data rows
  for (const [rowIndex, item] of data.entries()) {
    if (y < margin + rowHeight) {
      // Add new page
      const newPage = pdfDoc.addPage([595.28, 841.89]);
      page = newPage;
      y = height - margin;
      currentPage++;
      addFooter(newPage, currentPage, font, width);
    }

    // Alternate row colors
    const rowColor = rowIndex % 2 === 0 ? rgb(1, 1, 1) : rgb(0.95, 0.95, 0.95);
    page.drawRectangle({
      x: margin,
      y: y - rowHeight,
      width: width - 2 * margin,
      height: rowHeight,
      color: rowColor,
    });

    headers.forEach((header, colIndex) => {
      const value = formatValue(item[header.toLowerCase()]);
      const safeColIndex = Math.min(colIndex, columnWidths.length - 1);
      page.drawText(value, {
        x: margin + (safeColIndex * columnWidths[safeColIndex]) + 5,
        y: y - 15,
        size: 10,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
    });

    // Add grid lines
    page.drawLine({
      start: { x: margin, y: y - rowHeight },
      end: { x: width - margin, y: y - rowHeight },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });

    y -= rowHeight;
  }

  // Add footer to all pages
  const pages = pdfDoc.getPages();
  pages.forEach((page, index) => addFooter(page, index + 1, font, width));

  return pdfDoc.save();
}

function addFooter(page: PDFPage, pageNumber: number, font: PDFFont, width: number) {
  page.drawText(`Page ${pageNumber}`, {
    x: width / 2 - 25,
    y: 30,
    size: 10,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  page.drawText('Confidential - © 2024 Academic Institute', {
    x: 50,
    y: 30,
    size: 10,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  if (typeof value === 'number') {
    return Number(value.toFixed(2)).toLocaleString();
  }
  if (typeof value === 'object') {
    return '[Object]'; // Prevent raw object stringification
  }
  return String().slice(0, 50); // Truncate long text
}
