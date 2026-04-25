'use client';

import { useState, useEffect } from 'react';
import SiteHeader from '@/components/SiteHeader';
import Generator from '@/components/Generator';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import SiteFooter from '@/components/SiteFooter';

const SLIDES = [
  '/images/001.jpg',
  '/images/002.jpg',
  '/images/003.jpg',
  '/images/004.jpg',
  '/images/005.jpg',
  '/images/006.jpg',
  '/images/007.jpg',
  '/images/008.jpg',
  '/images/009.jpg',
  '/images/010.jpg',
  '/images/011.jpg',
  '/images/012.jpg',
  '/images/013.jpg',
];

export default function Home() {
  const [lang, setLang] = useState('EN');
  const [genre, setGenre] = useState('Death Metal');
  const [contentType, setContentType] = useState('Lyrics');
  const [lyricsResult, setLyricsResult] = useState('');
  const [musicPrompt, setMusicPrompt] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [cur, setCur] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCur(c => (c + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>

      {/* Fullscreen carousel background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        {SLIDES.map((src, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: i === cur ? 1 : 0,
            transition: 'opacity 1.5s ease',
          }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <SiteHeader language={lang} onLanguageChange={setLang} />

        <div style={{ display: 'flex', flex: 1, width: '100%' }}>

          {/* Left 10% */}
          <div style={{
            width: '10%',
            flexShrink: 0,
            background: 'transparent',
            backdropFilter: 'none',
          }}>
            <LeftSidebar result={lyricsResult} genre={genre} contentType={contentType} lang={lang} />
          </div>

          {/* Center 80% */}
          <div style={{
            width: '80%',
            flexShrink: 0,
            overflow: 'hidden',
            background: 'transparent',
            backdropFilter: 'none',
          }}>
            <Generator
              lang={lang}
              onResult={(lyrics, prompt, t) => { setLyricsResult(lyrics); setMusicPrompt(prompt); setTags(t); }}
              onGenreChange={setGenre}
              onContentTypeChange={setContentType}
            />
          </div>

          {/* Right 10% */}
          <div style={{
            width: '10%',
            flexShrink: 0,
            background: 'transparent',
            backdropFilter: 'none',
          }}>
            <RightSidebar musicPrompt={musicPrompt} tags={tags} />
          </div>

        </div>

        <SiteFooter />
      </div>
    </div>
  );
}
