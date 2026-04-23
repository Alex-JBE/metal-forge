const RESOURCES = [
  {
    tag: "Database",
    name: "Encyclopaedia Metallum",
    url: "https://www.metal-archives.com",
    desc: "The ultimate metal band archive",
  },
  {
    tag: "Reviews",
    name: "Metal Storm",
    url: "https://www.metalstorm.net",
    desc: "Reviews & ratings",
  },
  {
    tag: "Magazine",
    name: "Decibel Magazine",
    url: "https://www.decibelmagazine.com",
    desc: "Metal journalism",
  },
  {
    tag: "Underground",
    name: "No Clean Singing",
    url: "https://www.nocleansinging.com",
    desc: "Extreme metal blog",
  },
  {
    tag: "News",
    name: "Metal Injection",
    url: "https://www.metalinjection.net",
    desc: "News & interviews",
  },
  {
    tag: "Community",
    name: "r/Deathmetal",
    url: "https://reddit.com/r/Deathmetal",
    desc: "Reddit community",
  },
  {
    tag: "Shop",
    name: "Bandcamp",
    url: "https://bandcamp.com/tag/death-metal",
    desc: "Death metal releases",
  },
  {
    tag: "Blog",
    name: "Angry Metal Guy",
    url: "https://www.angrymetalguy.com",
    desc: "Critical metal reviews",
  },
];

export default function LeftSidebar() {
  return (
    <aside
      style={{
        background: "#0d0d0d",
        borderRight: "1px solid rgba(204,0,0,0.15)",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Section title */}
      <p
        style={{
          fontFamily: "var(--font-cinzel), serif",
          fontSize: "7px",
          letterSpacing: "0.2em",
          color: "#888888",
          textTransform: "uppercase",
          paddingBottom: "8px",
          marginBottom: "10px",
          borderBottom: "1px solid rgba(204,0,0,0.2)",
        }}
      >
        Metal Resources
      </p>

      <div style={{ flex: 1 }}>
        {RESOURCES.map((r) => (
          <a
            key={r.url}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", marginBottom: "10px", textDecoration: "none" }}
          >
            <span
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "9px",
                letterSpacing: "0.12em",
                color: "#cc0000",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "2px",
              }}
            >
              [{r.tag}]
            </span>
            <span
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "11px",
                fontWeight: "600",
                color: "#ffffff",
                display: "block",
                marginBottom: "1px",
                letterSpacing: "0.03em",
              }}
            >
              {r.name}
            </span>
            <span
              style={{
                fontFamily: "var(--font-crimson-text), Georgia, serif",
                fontSize: "9px",
                color: "#888888",
                display: "block",
              }}
            >
              {r.desc}
            </span>
          </a>
        ))}
      </div>

      {/* Lemmy quote */}
      <div style={{ borderTop: "1px solid rgba(204,0,0,0.15)", paddingTop: "10px", marginTop: "10px" }}>
        <p
          style={{
            fontFamily: "var(--font-crimson-text), Georgia, serif",
            fontStyle: "italic",
            fontSize: "10px",
            color: "rgba(255,255,255,0.5)",
            lineHeight: "1.6",
          }}
        >
          "Everything louder than everything else."
        </p>
        <p
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "7px",
            color: "#cc0000",
            letterSpacing: "0.15em",
            marginTop: "4px",
            textTransform: "uppercase",
          }}
        >
          Lemmy Kilmister
        </p>
      </div>
    </aside>
  );
}
