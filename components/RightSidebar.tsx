'use client';

import { motion } from 'framer-motion';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface Props {
  musicPrompt: string;
  tags: string[];
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

  page.drawText(title, { x: margin, y: height - margin, size: 16, font, color: rgb(0.8, 0, 0) });
  let y = height - margin - 36;
  for (const raw of text.split('\n')) {
    const words = raw.split(' ');
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, fontSize) > width - margin * 2) {
        page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0.85, 0.85, 0.85) });
        y -= lineHeight; line = word;
      } else { line = test; }
    }
    if (line) { page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0.85, 0.85, 0.85) }); }
    y -= lineHeight;
  }

  const bytes = await doc.save();
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = title + '.pdf'; a.click();
  URL.revokeObjectURL(url);
}

async function copyToClipboard(text: string) {
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

export default function RightSidebar({ musicPrompt, tags }: Props) {
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
        Music Prompt
      </p>

      {musicPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p style={{
            fontFamily: 'Georgia,serif',
            fontSize: '13px',
            color: '#f0f0f0',
            lineHeight: '1.8',
            marginBottom: '20px',
            whiteSpace: 'pre-line',
          }}>
            {musicPrompt}
          </p>

          {tags.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{
                fontFamily: 'Cinzel,serif',
                fontSize: '7px',
                letterSpacing: '0.22em',
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}>
                Metatags
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {tags.map(tag => (
                  <span key={tag} style={{
                    padding: '4px 10px',
                    border: '1px solid rgba(204,0,0,0.35)',
                    background: 'rgba(204,0,0,0.08)',
                    color: 'rgba(255,255,255,0.6)',
                    borderRadius: '100px',
                    fontFamily: 'Cinzel,serif',
                    fontSize: '8px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '6px' }}>
            <button style={btnStyle} onClick={() => downloadTxt(musicPrompt, 'music-prompt.txt')}>
              Download TXT
            </button>
            <button style={btnStyle} onClick={() => downloadPdf(musicPrompt, 'Music Prompt')}>
              Download PDF
            </button>
            <button style={btnStyle} onClick={() => copyToClipboard(musicPrompt)}>
              Share Link
            </button>
          </div>
        </motion.div>
      )}
    </aside>
  );
}
