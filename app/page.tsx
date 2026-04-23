import Generator from "@/components/Generator";
import BackgroundSlideshow from "@/components/BackgroundSlideshow";
import ParticleCanvas from "@/components/ParticleCanvas";
import SiteHeader from "@/components/SiteHeader";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
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
        <SiteHeader />

        <main
          style={{
            display: "grid",
            gridTemplateColumns: "188px 1fr 188px",
            flex: 1,
            minHeight: "600px",
          }}
        >
          <LeftSidebar />

          {/* Centre column */}
          <div
            style={{
              padding: "14px",
              borderLeft: "1px solid rgba(204,0,0,0.08)",
              borderRight: "1px solid rgba(204,0,0,0.08)",
              overflowY: "auto",
            }}
          >
            <Generator />
          </div>

          <RightSidebar />
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
