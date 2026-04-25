'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  language?: string;
  onLanguageChange?: (lang: string) => void;
}

export default function SiteHeader({ onLanguageChange }: Props) {
  const [lang, setLang] = useState('EN');

  return (
    <header style={{
      position: 'relative',
      height: '280px',
      overflow: 'hidden',
      textAlign: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      background: 'transparent',
    }}>

      {/* Lang selector */}
      <div style={{position:'absolute', top:16, right:20, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:5, zIndex:10}}>
        <div style={{fontSize:7, letterSpacing:'0.15em', color:'rgba(255,255,255,0.5)', textTransform:'uppercase'}}>Lyrics Language</div>
        <div style={{display:'flex', gap:4}}>
          {['EN','DE','RU'].map(l => (
            <button key={l} onClick={() => { setLang(l); onLanguageChange?.(l); }}
              style={{padding:'5px 11px', border: l===lang ? '1px solid #cc0000' : '1px solid rgba(255,255,255,0.15)', background: l===lang ? 'rgba(204,0,0,0.2)' : 'rgba(0,0,0,0.5)', color: l===lang ? '#fff' : 'rgba(255,255,255,0.5)', fontFamily:'Cinzel,serif', fontSize:9, cursor:'pointer', borderRadius:100}}>
              {l==='EN'?'🇬🇧':l==='DE'?'🇩🇪':'🇷🇺'} {l}
            </button>
          ))}
        </div>
      </div>

      {/* Logo + tagline + dots */}
      <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, zIndex:5}}>
        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:0.8}}
          style={{
            fontFamily: 'MonumentExtended, sans-serif',
            fontSize: 'clamp(64px, 6.8vw, 112px)',
            lineHeight: 0.88,
            letterSpacing: '0.028em',
            fontWeight: 800,
            textTransform: 'uppercase',
            textAlign: 'center',
            background: 'linear-gradient(180deg, #f8fafc 0%, #dde2e7 28%, #9ba3ac 52%, #eef2f5 76%, #8f979f 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 1px 0 rgba(255,255,255,0.35), 0 3px 10px rgba(0,0,0,0.28), 0 0 12px rgba(255,255,255,0.06)',
          }}>
          METAL FORGE
        </motion.div>
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{duration:0.8, delay:0.2}}
          style={{fontSize:'11px', letterSpacing:'0.24em', marginTop:'6px', opacity:0.72, color:'rgba(255,255,255,0.65)', fontFamily:'Cinzel,serif'}}>
          AI-POWERED METAL CONTENT GENERATOR
        </motion.div>
      </div>
    </header>
  );
}
