"use client";

import { useState } from "react";
import Generator from "@/components/Generator";
import BackgroundSlideshow from "@/components/BackgroundSlideshow";
import ParticleCanvas from "@/components/ParticleCanvas";
import SiteHeader from "@/components/SiteHeader";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import SiteFooter from "@/components/SiteFooter";
import { Language } from "@/components/LanguageSelector";

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");

  return (
    <>
      {/* ── Fixed background layers ─────────────────── */}
      <BackgroundSlideshow />

      {/* Fog layer 1 */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: "radial-gradient(ellipse 80% 60% at 25% 35%, rgba(40,0,0,0.15), transparent)",
          animation: "drift1 60s ease-in-out infinite alternate",
        }}
      />
      {/* Fog layer 2 */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: "radial-gradient(ellipse 70% 50% at 75% 65%, rgba(40,0,0,0.15), transparent)",
          animation: "drift2 90s ease-in-out infinite alternate",
        }}
      />

      <ParticleCanvas />

      {/* ── Page structure ──────────────────────────── */}
      <div className="relative flex flex-col min-h-screen" style={{ zIndex: 10 }}>
        <SiteHeader language={language} onLanguageChange={setLanguage} />

        <main style={{ display: "flex", width: "100%", minHeight: "600px", borderTop: "1px solid #181818" }}>
          <div style={{ width: "25%", borderRight: "1px solid #181818" }}>
            <LeftSidebar />
          </div>
          <div style={{ width: "50%", borderRight: "1px solid #181818" }}>
            <Generator language={language} />
          </div>
          <div style={{ width: "25%" }}>
            <RightSidebar />
          </div>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
