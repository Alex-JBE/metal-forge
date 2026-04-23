import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function POST(req: NextRequest) {
  const { content, subgenre, type = "lyrics" } = await req.json();

  if (!content || !subgenre) {
    return Response.json(
      { error: "content and subgenre are required" },
      { status: 400 },
    );
  }

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - 60;

  // Header
  page.drawText("METAL FORGE", {
    x: margin,
    y,
    size: 22,
    font: boldFont,
    color: rgb(0.85, 0, 0),
  });
  y -= 22;

  page.drawText(`${subgenre.toUpperCase()} — ${type.toUpperCase()}`, {
    x: margin,
    y,
    size: 9,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });
  y -= 18;

  page.drawLine({
    start: { x: margin, y },
    end: { x: pageWidth - margin, y },
    thickness: 0.5,
    color: rgb(0.25, 0.25, 0.25),
  });
  y -= 20;

  // Content — word-wrap each line
  const lines = wrapContent(content, font, 10, contentWidth);

  for (const line of lines) {
    if (y < margin + 20) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
    if (line !== "") {
      page.drawText(line, {
        x: margin,
        y,
        size: 10,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });
    }
    y -= line === "" ? 8 : 15;
  }

  const pdfBytes = await pdfDoc.save();

  const slug = subgenre.toLowerCase().replace(/[\s/]+/g, "-");
  const filename = `${slug}-${Date.now()}.pdf`;
  const dir = path.join(process.cwd(), "public", "exports", "pdf");

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), pdfBytes);

  return Response.json({ filename, url: `/exports/pdf/${filename}` });
}

function wrapContent(
  text: string,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  size: number,
  maxWidth: number,
): string[] {
  const result: string[] = [];

  for (const paragraph of text.split("\n")) {
    if (paragraph.trim() === "") {
      result.push("");
      continue;
    }
    const words = paragraph.split(" ");
    let current = "";
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      let w = maxWidth + 1;
      try {
        w = font.widthOfTextAtSize(test, size);
      } catch {}
      if (w > maxWidth && current) {
        result.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) result.push(current);
  }

  return result;
}
