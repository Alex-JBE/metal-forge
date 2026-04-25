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
}

export default function Generator({ lang, onResult, onGenreChange, onContentTypeChange }: Props) {
  const [genre, setGenre] = useState('Death Metal');
  const [contentType, setContentType] = useState('Lyrics');
  const [promptType, setPromptType] = useState('Suno');
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);

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
      const musicPrompt = buildMusicPrompt(genre, contentType, promptType, lang);
      const tags = buildTags(genre, contentType, lang);
      onResult(lyrics, musicPrompt, tags);
    } catch (err) {
      onResult(err instanceof Error ? err.message : 'Generation failed.', '', []);
    } finally {
      setLoading(false);
    }
  }

  function buildMusicPrompt(g: string, ct: string, pt: string, l: string): string {
    const style = g.toLowerCase();
    const base = `${style} metal, ${ct.toLowerCase()}, ${pt} style`;
    const langNote = l !== 'EN' ? `, lyrics in ${l}` : '';
    return base + langNote;
  }

  function buildTags(g: string, ct: string, l: string): string[] {
    return [g, ct, `Lang:${l}`, 'Metal Forge'];
  }

  function pill(active: boolean): React.CSSProperties {
    return {
      padding: '5px 12px',
      border: `1px solid ${active ? '#cc0000' : '#444'}`,
      background: active ? '#cc0000' : '#1a1a1a',
      color: active ? '#fff' : '#ccc',
      borderRadius: '100px',
      fontFamily: 'Cinzel,serif',
      fontSize: '11px',
      letterSpacing: '0.03em',
      cursor: 'pointer',
      textTransform: 'uppercase' as const,
      transition: 'all 0.15s',
      whiteSpace: 'nowrap' as const,
    };
  }

  const divider: React.CSSProperties = {
    height: '1px',
    background: 'rgba(255,255,255,0.07)',
    margin: '18px 0',
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
    <div style={{
      color: '#ccc',
      maxWidth: '560px',
      margin: '0 auto',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>

      {/* Genre pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '5px', width: '100%' }}>
        {GENRES.map(g => (
          <button key={g} onClick={() => selectGenre(g)} style={pill(genre === g)}>{g}</button>
        ))}
      </div>

      <div style={divider} />

      {/* Content Type 2×2 */}
      <span style={label}>Content Type</span>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
        {CONTENT_TYPES.map(ct => (
          <button key={ct} onClick={() => selectContentType(ct)} style={pill(contentType === ct)}>
            {ct}
          </button>
        ))}
      </div>

      <div style={divider} />

      {/* Prompt Type */}
      <span style={label}>Music Prompt Type</span>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
        {PROMPT_TYPES.map(pt => (
          <button key={pt} onClick={() => setPromptType(pt)} style={pill(promptType === pt)}>{pt}</button>
        ))}
      </div>

      <div style={divider} />

      {/* Theme input */}
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

      {/* FORGE button */}
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
  );
}
