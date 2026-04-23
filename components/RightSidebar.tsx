const ALBUMS = [
  { band: "Blood Incantation", title: "Luminescent Bridge", year: "2024", isNew: true },
  { band: "Gatecreeper", title: "Dark Superstition", year: "2024", isNew: true },
  { band: "Undeath", title: "More Insane", year: "2024", isNew: true },
  { band: "Mortiferum", title: "Preserve and Protect the Dead", year: "2024", isNew: true },
  { band: "Suffering Hour", title: "The Cyclopean Scape", year: "2024", isNew: false },
  { band: "Ingested", title: "Ashes Lie Still", year: "2024", isNew: false },
  { band: "Tomb Mold", title: "The Enduring Spirit", year: "2023", isNew: false },
  { band: "Frozen Soul", title: "Glacial Domination", year: "2023", isNew: false },
];

const SECTION_TITLE: React.CSSProperties = {
  fontFamily: "var(--font-cinzel), serif",
  fontSize: "7px",
  letterSpacing: "0.2em",
  color: "rgba(255,255,255,0.4)",
  textTransform: "uppercase",
  paddingBottom: "8px",
  marginBottom: "10px",
  borderBottom: "1px solid rgba(204,0,0,0.2)",
};

function AlbumThumb({ initial }: { initial: string }) {
  return (
    <div
      style={{
        width: "44px",
        height: "44px",
        flexShrink: 0,
        background: "linear-gradient(135deg, #1a0000 0%, #2a0000 100%)",
        border: "1px solid rgba(204,0,0,0.2)",
        borderRadius: "2px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-metal-mania), serif",
          fontSize: "16px",
          color: "rgba(204,0,0,0.5)",
        }}
      >
        {initial}
      </span>
    </div>
  );
}

export default function RightSidebar() {
  return (
    <aside
      style={{
        background: "rgba(6,6,6,0.98)",
        borderLeft: "1px solid rgba(204,0,0,0.15)",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: 10,
      }}
    >
      <p style={SECTION_TITLE}>New Releases · deathgrind.club</p>

      <div style={{ flex: 1 }}>
        {ALBUMS.map((album) => (
          <div
            key={`${album.band}-${album.title}`}
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "flex-start",
              marginBottom: "10px",
            }}
          >
            <AlbumThumb initial={album.band.charAt(0)} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-cinzel), serif",
                    fontSize: "8px",
                    color: "#888",
                    letterSpacing: "0.05em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                  }}
                >
                  {album.band}
                </span>
                {album.isNew && (
                  <span
                    style={{
                      fontFamily: "var(--font-cinzel), serif",
                      fontSize: "6px",
                      letterSpacing: "0.1em",
                      color: "#cc0000",
                      border: "1px solid rgba(204,0,0,0.4)",
                      padding: "1px 3px",
                      flexShrink: 0,
                    }}
                  >
                    NEW
                  </span>
                )}
              </div>
              <span
                style={{
                  fontFamily: "var(--font-crimson-text), Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.35)",
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {album.title}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-cinzel), serif",
                  fontSize: "6px",
                  color: "rgba(204,0,0,0.35)",
                  letterSpacing: "0.1em",
                }}
              >
                {album.year}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chuck Schuldiner quote */}
      <div style={{ borderTop: "1px solid rgba(204,0,0,0.15)", paddingTop: "10px", marginTop: "10px" }}>
        <p
          style={{
            fontFamily: "var(--font-crimson-text), Georgia, serif",
            fontStyle: "italic",
            fontSize: "10px",
            color: "rgba(255,255,255,0.3)",
            lineHeight: "1.6",
          }}
        >
          "Death metal is about reality. It's about what really happens."
        </p>
        <p
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "6px",
            color: "rgba(204,0,0,0.4)",
            letterSpacing: "0.15em",
            marginTop: "4px",
            textTransform: "uppercase",
          }}
        >
          Chuck Schuldiner
        </p>
      </div>
    </aside>
  );
}
