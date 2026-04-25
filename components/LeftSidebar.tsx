'use client';

import { motion } from 'framer-motion';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface Props {
  result: string;
  genre: string;
  contentType: string;
  lang: string;
}

function downloadTxt(text: string, filename: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

async function downloadPdf(text: string, title: string) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const page = doc.addPage([595, 842]);
  const { width, height } = page.getSize();
  const margin = 50;
  const fontSize = 11;
  const lineHeight = fontSize * 1.6;
  const maxWidth = width - margin * 2;

  page.drawText(title, { x: margin, y: height - margin, size: 16, font, color: rgb(0.8, 0, 0) });

  const lines = text.split('\n');
  let y = height - margin - 36;
  for (const raw of lines) {
    const words = raw.split(' ');
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, fontSize) > maxWidth) {
        page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0.85, 0.85, 0.85) });
        y -= lineHeight; line = word;
      } else { line = test; }
    }
    if (line) {
      page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0.85, 0.85, 0.85) });
    }
    y -= lineHeight;
  }

  const bytes = await doc.save();
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = title + '.pdf'; a.click();
  URL.revokeObjectURL(url);
}

async function shareLink(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  } catch {
    alert('Copy failed — please copy manually.');
  }
}

const btnStyle: React.CSSProperties = {
  flex: 1,
  padding: '6px 4px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(255,255,255,0.55)',
  fontFamily: 'Cinzel,serif',
  fontSize: '7px',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  borderRadius: '4px',
  transition: 'all 0.15s',
};

export default function LeftSidebar({ result, genre, contentType, lang }: Props) {
  const title = `${genre} · ${contentType} · ${lang}`;

  return (
    <aside style={{ padding: '16px 14px', height: '100%' }}>

      <p style={{
        fontFamily: 'Cinzel,serif',
        fontSize: '13px',
        letterSpacing: '0.25em',
        color: '#ffffff',
        textTransform: 'uppercase',
        textAlign: 'center',
        padding: '10px 24px',
        background: 'rgba(204,0,0,0.15)',
        border: '1px solid rgba(204,0,0,0.4)',
        borderRadius: '4px',
        marginBottom: '20px',
        display: 'inline-block',
        width: '100%',
      }}>
        Text Prompt
      </p>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p style={{
            fontFamily: 'Georgia,serif',
            fontSize: '13px',
            color: '#f0f0f0',
            lineHeight: '1.9',
            whiteSpace: 'pre-line',
            marginBottom: '20px',
          }}>
            {result}
          </p>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button style={btnStyle} onClick={() => downloadTxt(result, `${title}.txt`)}>
              Download TXT
            </button>
            <button style={btnStyle} onClick={() => downloadPdf(result, title)}>
              Download PDF
            </button>
            <button style={btnStyle} onClick={() => shareLink(result)}>
              Share Link
            </button>
          </div>
        </motion.div>
      )}
    </aside>
  );
}
