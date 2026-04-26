'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PDFDocument, rgb, PDFFont, PDFPage, Color } from 'pdf-lib';
import * as fontkitLib from '@pdf-lib/fontkit';

function extractSongTitle(text: string): string {
  const bold = text.match(/\*\*(.+?)\*\*/);
  if (bold) return bold[1].trim();
  const first = text.split('\n').find(l => l.trim().length > 0);
  return first ? first.trim() : 'metal_forge_generation';
}

function sanitizeFilename(title: string): string {
  const s = title
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\p{L}\p{N}_-]/gu, '');
  return (s || 'metal_forge_generation') + '.pdf';
}

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const raw of text.split('\n')) {
    if (!raw.trim()) { lines.push(''); continue; }
    const words = raw.split(' ');
    let cur = '';
    for (const w of words) {
      const candidate = cur ? `${cur} ${w}` : w;
      if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
        cur = candidate;
      } else {
        if (cur) lines.push(cur);
        cur = w;
      }
    }
    if (cur) lines.push(cur);
  }
  return lines;
}

function ensurePageSpace(
  pdfDoc: PDFDocument,
  page: PDFPage,
  y: number,
  needed: number,
  bottomMargin: number,
  topY: number,
): { page: PDFPage; y: number } {
  if (y - needed < bottomMargin) {
    return { page: pdfDoc.addPage([595, 842]), y: topY };
  }
  return { page, y };
}

const GENRES = [
  'Death Metal','Old School Death','Brutal Death','Technical Death',
  'Melodic Death','Cavernous Death','Dissonant Death','Slam Death',
  'Deathgrind','Goregrind',
  'Black Metal','Atmospheric Black','Depressive Black','Symphonic Black',
  'Bestial Black','Blackened Death','War Metal','Raw Black','Ambient Black',
  'Post-Black','Blackgaze',
  'Doom Metal','Funeral Doom','Death-Doom','Stoner Doom','Drone Metal',
  'Sludge Metal','Post-Metal','Atmospheric Sludge',
  'Thrash Metal','Crossover Thrash','Speed Metal',
  'Power Metal','Epic Metal','Symphonic Power',
  'Heavy Metal','NWOBHM','Traditional Heavy',
  'Viking Metal','Folk Metal','Pagan Metal','Heathen Metal','Celtic Metal',
  'Gothic Metal','Symphonic Metal','Operatic Metal',
  'Grindcore','Powerviolence','Mathcore','Noisecore',
  'Progressive Metal','Djent','Avant-garde Metal',
  'Industrial Metal','EBM Metal','Cyber Metal',
  'Nu-Metal','Alternative Metal','Groove Metal',
  'Southern Metal','Desert Metal','Psychedelic Metal',
  'Ambient Metal','Instrumental Metal','Neoclassical Metal',
  'Pirate Metal','Medieval Metal','Oriental Metal',
  'Noise Metal','Experimental Metal','Drone Doom',
  'Crust Punk','D-Beat','Anarcho Metal',
  'Shoegaze Metal','Post-Rock Metal','Sludgecore',
];

const CONTENT_TYPES = ['Lyrics', 'Intro Monologue', 'Outro Text', 'Album Story'];
const PROMPT_TYPES = ['Suno', 'Udio', 'ComfyUI'];

interface Props {
  lang: string;
  onResult: (lyrics: string, musicPrompt: string, tags: string[]) => void;
  onGenreChange: (genre: string) => void;
  onContentTypeChange: (ct: string) => void;
  onTabChange?: (tab: 'forge' | 'result') => void;
}

export default function Generator({ lang, onResult, onGenreChange, onContentTypeChange, onTabChange }: Props) {
  const [genre, setGenre] = useState('Death Metal');
  const [contentType, setContentType] = useState('Lyrics');
  const [promptType, setPromptType] = useState('Suno');
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'forge' | 'result'>('forge');
  const [lyricsText, setLyricsText] = useState('');
  const [musicPromptText, setMusicPromptText] = useState('');

  function switchTab(tab: 'forge' | 'result') {
    setActiveTab(tab);
    onTabChange?.(tab);
  }

  function selectGenre(g: string) {
    setGenre(g);
    onGenreChange(g);
  }

  function selectContentType(ct: string) {
    setContentType(ct);
    onContentTypeChange(ct);
  }

  async function handleForge() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subgenre: genre,
          type: contentType.toLowerCase().replace(/\s+/g, '_'),
          promptType,
          prompt: theme,
          language: lang.toLowerCase(),
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? `HTTP ${res.status}`);
      }
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');
      const dec = new TextDecoder();
      let lyrics = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        lyrics += dec.decode(value, { stream: true });
      }
      const marker = '[MUSIC_PROMPT]';
      const markerIdx = lyrics.indexOf(marker);
      const lyricsOnly = markerIdx !== -1 ? lyrics.slice(0, markerIdx).trim() : lyrics.trim();
      const musicPrompt = markerIdx !== -1 ? lyrics.slice(markerIdx + marker.length).trim() : '';
      const tags = buildTags(genre, contentType, lang);
      setLyricsText(lyricsOnly);
      setMusicPromptText(musicPrompt);
      switchTab('result');
      onResult(lyricsOnly, musicPrompt, tags);
    } catch (err) {
      onResult(err instanceof Error ? err.message : 'Generation failed.', '', []);
    } finally {
      setLoading(false);
    }
  }

  const ACTION_BUTTON_STYLE: React.CSSProperties = {
    padding: '8px 18px',
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(0,0,0,0.9)',
    color: '#fff',
    fontSize: '11px',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    cursor: 'pointer',
  };

  const handleCopyLyrics = () => {
    if (!lyricsText) return;
    navigator.clipboard.writeText(lyricsText).catch(() => {});
  };

  const handleCopyMusic = () => {
    if (!musicPromptText) return;
    navigator.clipboard.writeText(musicPromptText).catch(() => {});
  };

  const handleSavePdf = async () => {
    if (!lyricsText && !musicPromptText) return;

    const titleText = extractSongTitle(lyricsText);
    const filename = sanitizeFilename(titleText);

    const fontUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosans/NotoSans-Regular.ttf';
    const fontBytes = await fetch(fontUrl).then(r => r.arrayBuffer());

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkitLib as any);
    const font = await pdfDoc.embedFont(fontBytes);

    const W = 595, H = 842, M = 60;
    const contentWidth = W - M * 2;
    const startY = H - M;
    const bottomMargin = M;

    let page = pdfDoc.addPage([W, H]);
    let y = startY;

    function putLine(text: string, size: number, color: Color = rgb(0.1, 0.1, 0.1)): void {
      const lh = size * 1.5;
      const sp = ensurePageSpace(pdfDoc, page, y, lh, bottomMargin, startY);
      page = sp.page;
      y = sp.y;
      page.drawText(text, { x: M, y: y - size, font, size, color });
      y -= lh;
    }

    putLine(titleText, 18, rgb(0.8, 0, 0));
    y -= 8;

    const sections: [string, string][] = [
      ['LYRICS', lyricsText],
      ['MUSIC PROMPT', musicPromptText],
    ];

    for (const [heading, body] of sections) {
      if (!body.trim()) continue;
      y -= 12;
      putLine(heading, 12, rgb(0.8, 0, 0));
      y -= 4;
      for (const line of wrapText(body, font, 10, contentWidth)) {
        putLine(line || ' ', 10);
      }
    }

    const pdfBytes = await pdfDoc.save();

    if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [{ description: 'PDF Document', accept: { 'application/pdf': ['.pdf'] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(pdfBytes);
        await writable.close();
        return;
      } catch { /* user cancelled or API unavailable */ }
    }

    const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveFullGeneration = () => {
    if (!lyricsText && !musicPromptText) return;
    const full = `LYRICS PROMPT\n\n${lyricsText || ''}\n\n---\n\nMUSIC PROMPT\n\n${musicPromptText || ''}`;
    const blob = new Blob([full], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const titleBase = extractSongTitle(lyricsText)
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\p{L}\p{N}_-]/gu, '') || 'metal_forge_generation';
    a.download = titleBase + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  function buildTags(g: string, ct: string, l: string): string[] {
    return [g, ct, `Lang:${l}`, 'Metal Forge'];
  }

  function pill(active: boolean): React.CSSProperties {
    return {
      padding: '10px 16px',
      borderRadius: '999px',
      border: active ? '1px solid #cc0000' : '1px solid rgba(255,255,255,0.18)',
      backgroundColor: active ? '#cc0000' : 'rgba(0,0,0,0.65)',
      color: active ? '#fff' : '#ccc',
      fontFamily: 'Cinzel,serif',
      fontSize: '13px',
      lineHeight: 1.15,
      letterSpacing: '0.03em',
      textAlign: 'center' as const,
      cursor: 'pointer',
      textTransform: 'uppercase' as const,
      transition: 'all 0.15s',
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      justifySelf: 'stretch' as const,
      minWidth: 0,
      minHeight: '40px',
    };
  }

  function controlPill(active: boolean): React.CSSProperties {
    return {
      padding: '6px 14px',
      borderRadius: '999px',
      border: active ? '1px solid #cc0000' : '1px solid rgba(255,255,255,0.18)',
      backgroundColor: active ? '#cc0000' : 'rgba(0,0,0,0.65)',
      color: active ? '#fff' : '#ccc',
      fontFamily: 'Cinzel,serif',
      fontSize: '10px',
      letterSpacing: '0.05em',
      textAlign: 'center' as const,
      cursor: 'pointer',
      textTransform: 'uppercase' as const,
      transition: 'all 0.15s',
      whiteSpace: 'nowrap' as const,
    };
  }

  const divider: React.CSSProperties = {
    height: '1px',
    background: 'rgba(255,255,255,0.07)',
    margin: '8px 0',
  };

  const label: React.CSSProperties = {
    fontFamily: 'Cinzel,serif',
    fontSize: '7px',
    letterSpacing: '0.25em',
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    textAlign: 'center',
    display: 'block',
    marginBottom: '10px',
  };

  return (
    <div style={{ color: '#ccc', padding: '12px 16px 6px', display: 'flex', flexDirection: 'column' }}>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', gap: '8px' }}>
        <button
          onClick={() => switchTab('forge')}
          style={{
            padding: '6px 18px',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.25)',
            fontSize: '11px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            backgroundColor: activeTab === 'forge' ? 'rgba(255,0,0,0.8)' : 'rgba(0,0,0,0.6)',
            color: '#fff',
            opacity: activeTab === 'forge' ? 1 : 0.7,
            cursor: 'pointer',
            transition: 'background-color 160ms ease, opacity 160ms ease',
          }}
        >
          FORGE
        </button>
        <button
          onClick={() => switchTab('result')}
          style={{
            padding: '6px 18px',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.25)',
            fontSize: '11px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            backgroundColor: activeTab === 'result' ? 'rgba(255,0,0,0.8)' : 'rgba(0,0,0,0.6)',
            color: '#fff',
            opacity: activeTab === 'result' ? 1 : 0.7,
            cursor: 'pointer',
            transition: 'background-color 160ms ease, opacity 160ms ease',
          }}
        >
          RESULT
        </button>
      </div>

      {/* RESULT tab */}
      {activeTab === 'result' && lyricsText && (
        <>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '40px 0 56px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}>
          {/* Lyrics column */}
          <div>
            <p style={{ fontFamily: 'Cinzel,serif', textAlign: 'center', fontSize: '12px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)', margin: '0 0 10px 0', borderBottom: '1px solid rgba(255,255,255,0.35)', paddingBottom: '6px' }}>
              Lyrics Prompt
            </p>
            <pre style={{
              backgroundColor: 'rgba(0,0,0,0.9)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.16)',
              padding: '16px 18px 12px',
              color: '#fff',
              fontFamily: 'Georgia,serif',
              fontSize: '13px',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: '60vh',
              overflowY: 'auto',
              margin: 0,
            }}>
              {lyricsText}
            </pre>
          </div>
          {/* Music Prompt column */}
          <div>
            <p style={{ fontFamily: 'Cinzel,serif', textAlign: 'center', fontSize: '12px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)', margin: '0 0 10px 0', borderBottom: '1px solid rgba(255,255,255,0.35)', paddingBottom: '6px' }}>
              Music Prompt
            </p>
            <pre style={{
              backgroundColor: 'rgba(0,0,0,0.9)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.16)',
              padding: '16px 18px 12px',
              color: '#fff',
              fontFamily: 'Georgia,serif',
              fontSize: '13px',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: '60vh',
              overflowY: 'auto',
              margin: 0,
            }}>
              {musicPromptText || '—'}
            </pre>
          </div>
        </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto 1fr', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '1200px', margin: '10px auto 0' }}>
          <button onClick={handleCopyLyrics} style={{ ...ACTION_BUTTON_STYLE, justifySelf: 'start' }}>Copy lyrics prompt</button>
          <button onClick={handleSaveFullGeneration} style={{ ...ACTION_BUTTON_STYLE, justifySelf: 'center' }}>Save full generation</button>
          <button onClick={handleSavePdf} style={{ ...ACTION_BUTTON_STYLE, justifySelf: 'center' }}>Save as PDF</button>
          <button onClick={handleCopyMusic} style={{ ...ACTION_BUTTON_STYLE, justifySelf: 'end' }}>Copy music prompt</button>
        </div>
        </>
      )}

      {/* FORGE tab */}
      {activeTab === 'forge' && <>

      {/* Genre pills — full width */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
        gap: '14px 18px',
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        alignItems: 'stretch',
      }}>
        {GENRES.map(g => (
          <button key={g} onClick={() => selectGenre(g)} style={pill(genre === g)}>{g}</button>
        ))}
      </div>

      {/* Controls — centered below genres */}
      <div style={{ maxWidth: '560px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <div style={divider} />

        <span style={label}>Content Type</span>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {CONTENT_TYPES.map(ct => (
            <button key={ct} onClick={() => selectContentType(ct)} style={controlPill(contentType === ct)}>
              {ct}
            </button>
          ))}
        </div>

        <div style={divider} />

        <span style={label}>Music Prompt Type</span>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
          {PROMPT_TYPES.map(pt => (
            <button key={pt} onClick={() => setPromptType(pt)} style={controlPill(promptType === pt)}>{pt}</button>
          ))}
        </div>

        <div style={divider} />

        <input
          type="text"
          value={theme}
          onChange={e => setTheme(e.target.value)}
          disabled={loading}
          placeholder="Theme / direction (optional)..."
          style={{
            width: '80%',
            borderRadius: '100px',
            background: '#1a1a1a',
            border: '1px solid #444',
            color: '#ccc',
            padding: '10px 18px',
            fontSize: '12px',
            outline: 'none',
            fontFamily: 'Cinzel,serif',
            marginBottom: '16px',
          }}
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleForge}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: '#cc0000',
            borderRadius: '100px',
            fontFamily: 'Cinzel,serif',
            fontSize: '13px',
            letterSpacing: '0.25em',
            color: '#fff',
            textTransform: 'uppercase',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}
              />
              FORGING…
            </span>
          ) : 'FORGE'}
        </motion.button>

      </div>
      </>}

    </div>
  );
}
