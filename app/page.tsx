'use client';

import { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import Generator from '@/components/Generator';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import SiteFooter from '@/components/SiteFooter';

export default function Home() {
  const [lang, setLang] = useState('EN');
  const [genre, setGenre] = useState('Death Metal');
  const [contentType, setContentType] = useState('Lyrics');
  const [lyricsResult, setLyricsResult] = useState('');
  const [musicPrompt, setMusicPrompt] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SiteHeader language={lang} onLanguageChange={setLang} />

      <div style={{ display: 'flex', flex: 1, width: '100%' }}>

        {/* Left 25% */}
        <div style={{
          width: '25%',
          flexShrink: 0,
          backdropFilter: 'blur(14px)',
          background: 'rgba(0,0,0,0.62)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          position: 'relative',
          zIndex: 1,
        }}>
          <LeftSidebar result={lyricsResult} genre={genre} contentType={contentType} lang={lang} />
        </div>

        {/* Center 50% */}
        <div style={{
          width: '50%',
          flexShrink: 0,
          backdropFilter: 'blur(10px)',
          background: 'rgba(0,0,0,0.45)',
          position: 'relative',
          zIndex: 1,
        }}>
          <Generator
            lang={lang}
            onResult={(lyrics, prompt, t) => { setLyricsResult(lyrics); setMusicPrompt(prompt); setTags(t); }}
            onGenreChange={setGenre}
            onContentTypeChange={setContentType}
          />
        </div>

        {/* Right 25% */}
        <div style={{
          width: '25%',
          flexShrink: 0,
          backdropFilter: 'blur(14px)',
          background: 'rgba(0,0,0,0.62)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          position: 'relative',
          zIndex: 1,
        }}>
          <RightSidebar musicPrompt={musicPrompt} tags={tags} />
        </div>

      </div>

      <SiteFooter />
    </div>
  );
}
