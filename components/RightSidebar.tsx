"use client";

const LINKS = [
  { name: "Encyclopaedia Metallum", url: "https://www.metal-archives.com", desc: "The ultimate metal band archive" },
  { name: "Metal Storm", url: "https://www.metalstorm.net", desc: "Reviews & ratings" },
  { name: "Decibel Magazine", url: "https://www.decibelmagazine.com", desc: "Metal journalism" },
  { name: "No Clean Singing", url: "https://www.nocleansinging.com", desc: "Extreme metal blog" },
  { name: "Bandcamp Death Metal", url: "https://bandcamp.com/tag/death-metal", desc: "Death metal releases" },
  { name: "Metal Injection", url: "https://www.metalinjection.net", desc: "News & interviews" },
  { name: "Angry Metal Guy", url: "https://www.angrymetalguy.com", desc: "Critical metal reviews" },
  { name: "r/Deathmetal", url: "https://reddit.com/r/Deathmetal", desc: "Reddit community" },
];

export default function RightSidebar() {
  return (
    <aside style={{ padding: "12px" }}>
      <p
        style={{
          fontFamily: "var(--font-cinzel), serif",
          fontSize: "7px",
          letterSpacing: "0.2em",
          color: "#cc0000",
          textTransform: "uppercase",
          paddingBottom: "8px",
          marginBottom: "10px",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        Metal Resources
      </p>

      {LINKS.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "10px", textDecoration: "none" }}
          onMouseEnter={(e) => {
            (e.currentTarget.querySelector(".link-name") as HTMLElement).style.color = "#cc0000";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget.querySelector(".link-name") as HTMLElement).style.color = "#888888";
          }}
        >
          <span style={{ color: "#cc0000", fontSize: "8px", marginTop: "2px", flexShrink: 0 }}>●</span>
          <div>
            <span
              className="link-name"
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "9px",
                letterSpacing: "0.08em",
                color: "#888888",
                display: "block",
                marginBottom: "2px",
                transition: "color 0.2s",
              }}
            >
              {link.name}
            </span>
            <span
              style={{
                fontFamily: "var(--font-crimson-text), Georgia, serif",
                fontSize: "9px",
                color: "#333333",
                display: "block",
              }}
            >
              {link.desc}
            </span>
          </div>
        </a>
      ))}
    </aside>
  );
}
