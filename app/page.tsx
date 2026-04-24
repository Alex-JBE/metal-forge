"use client";

import { useState } from "react";
import Generator from "@/components/Generator";
import SiteHeader from "@/components/SiteHeader";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import SiteFooter from "@/components/SiteFooter";
import { Language } from "@/components/LanguageSelector";

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#000" }}>
      <SiteHeader language={language} onLanguageChange={setLanguage} />

      <div style={{ display: "flex", width: "100%", flex: 1, background: "#000" }}>
        <div style={{ width: "25%", flexShrink: 0, borderRight: "1px solid #181818" }}>
          <LeftSidebar />
        </div>
        <div style={{ width: "50%", flexShrink: 0, borderRight: "1px solid #181818" }}>
          <Generator language={language} />
        </div>
        <div style={{ width: "25%", flexShrink: 0 }}>
          <RightSidebar />
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
