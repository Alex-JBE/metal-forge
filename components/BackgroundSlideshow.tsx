"use client";

import { useEffect, useState } from "react";

const PHOTOS = [
  "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?w=1920",
  "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?w=1920",
  "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?w=1920",
  "https://images.pexels.com/photos/460537/pexels-photo-460537.jpeg?w=1920",
  "https://images.pexels.com/photos/1916820/pexels-photo-1916820.jpeg?w=1920",
  "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=1920",
  "https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg?w=1920",
  "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?w=1920",
];

export default function BackgroundSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % PHOTOS.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }} aria-hidden>
      {PHOTOS.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === current ? 1 : 0,
            transition: "opacity 2s ease-in-out",
          }}
        />
      ))}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.82)", zIndex: 1 }} />
    </div>
  );
}
