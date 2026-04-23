"use client";

import { useEffect, useState } from "react";

const PHOTOS = [
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1920&q=80",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&q=80",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1920&q=80",
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1920&q=80",
  "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?w=1920&q=80",
  "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=1920&q=80",
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
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.82)", zIndex: 1 }}
      />
    </div>
  );
}
