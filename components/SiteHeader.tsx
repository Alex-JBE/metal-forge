'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SLIDES = [
  'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?w=1920',
  'https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?w=1920',
  'https://images.pexels.com/photos/460537/pexels-photo-460537.jpeg?w=1920',
  'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=1920',
  'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?w=1920',
];

interface Props {
  language?: string;
  onLanguageChange?: (lang: string) => void;
}

export default function SiteHeader({ onLanguageChange }: Props) {
  const [cur, setCur] = useState(0);
  const [lang, setLang] = useState('EN');

  useEffect(() => {
    const id = setInterval(() => setCur(c => (c + 1) % 5), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <header style={{position:'relative', height:'280px', overflow:'hidden', textAlign:'center', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(0,0,0,0.3)', backdropFilter:'blur(4px)'}}>

      {/* Slides */}
      {SLIDES.map((src, i) => (
        <div key={i} style={{position:'absolute', inset:0, backgroundImage:`url(${src})`, backgroundSize:'cover', backgroundPosition:'center', opacity: i===cur ? 1 : 0, transition:'opacity 1.5s ease'}} />
      ))}
      <div style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.65)'}} />

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

      {/* Logo + tagline */}
      <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, zIndex:5}}>
        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:0.8}}
          style={{fontFamily:'MetalLord,Cinzel,serif', fontSize:88, color:'#fff', lineHeight:1, letterSpacing:'0.05em', textShadow:'0 0 50px rgba(255,80,0,0.7), 3px 3px 0 #550000'}}>
          METAL FORGE
        </motion.div>
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{duration:0.8, delay:0.2}}
          style={{fontSize:10, letterSpacing:'0.35em', color:'rgba(255,255,255,0.65)', fontFamily:'Cinzel,serif'}}>
          AI-POWERED METAL CONTENT GENERATOR
        </motion.div>
        <div style={{display:'flex', gap:6, marginTop:8}}>
          {SLIDES.map((_,i) => (
            <div key={i} onClick={()=>setCur(i)} style={{width:5, height:5, borderRadius:'50%', background: i===cur ? '#cc0000' : 'rgba(255,255,255,0.2)', cursor:'pointer', transition:'background 0.3s'}} />
          ))}
        </div>
      </div>
    </header>
  );
}
