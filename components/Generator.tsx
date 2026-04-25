'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

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
