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
            fontSize: 'clamp(68px, 7.2vw, 118px)',
            lineHeight: 0.9,
            letterSpacing: '0.035em',
            fontWeight: 800,
            textTransform: 'uppercase',
            textAlign: 'center',
            background: 'linear-gradient(180deg, #f3f5f7 0%, #d7dbe0 30%, #8e949c 52%, #eef2f5 76%, #aeb4bc 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 10px rgba(0,0,0,0.35)',
          }}>
          METAL FORGE
        </motion.div>
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{duration:0.8, delay:0.2}}
          style={{fontSize:'12px', letterSpacing:'0.22em', marginTop:'8px', opacity:0.9, color:'rgba(255,255,255,0.65)', fontFamily:'Cinzel,serif'}}>
          AI-POWERED METAL CONTENT GENERATOR
        </motion.div>
      </div>
    </header>
  );
}
