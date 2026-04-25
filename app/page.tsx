'use client';

import { useState, useEffect } from 'react';
import SiteHeader from '@/components/SiteHeader';
import Generator from '@/components/Generator';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import SiteFooter from '@/components/SiteFooter';

const SLIDES = [
  'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?w=1920',
  'https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?w=1920',
  'https://images.pexels.com/photos/460537/pexels-photo-460537.jpeg?w=1920',
  'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=1920',
  'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?w=1920',
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

          {/* Left 25% */}
          <div style={{
            width: '25%',
            flexShrink: 0,
            backdropFilter: 'blur(14px)',
            background: 'rgba(0,0,0,0.62)',
            borderRight: '1px solid rgba(255,255,255,0.07)',
          }}>
            <LeftSidebar result={lyricsResult} genre={genre} contentType={contentType} lang={lang} />
          </div>

          {/* Center 50% */}
          <div style={{
            width: '50%',
            flexShrink: 0,
            backdropFilter: 'blur(10px)',
            background: 'rgba(0,0,0,0.45)',
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
          }}>
            <RightSidebar musicPrompt={musicPrompt} tags={tags} />
          </div>

        </div>

        <SiteFooter />
      </div>
    </div>
  );
}
