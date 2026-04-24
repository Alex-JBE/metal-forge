export default function SiteHeader() {
  return (
    <header style={{ height: "150px", position: "relative", overflow: "hidden" }}>
      {/* Background image */}
      <img
        src="https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?w=1920"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.3)",
        }}
      />

      {/* Left quote */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          maxWidth: "180px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-crimson-text), Georgia, serif",
            fontStyle: "italic",
            fontSize: "10px",
            color: "rgba(255,255,255,0.45)",
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          "If it doesn't hurt to write, it won't heal to hear."
        </p>
        <p
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "7px",
            letterSpacing: "0.1em",
            color: "rgba(204,0,0,0.55)",
            textTransform: "uppercase",
            marginTop: "4px",
          }}
        >
          Metal Lyric Philosophy
        </p>
      </div>

      {/* Right quote */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          maxWidth: "180px",
          textAlign: "right",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-crimson-text), Georgia, serif",
            fontStyle: "italic",
            fontSize: "10px",
            color: "rgba(255,255,255,0.45)",
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          "Death metal — a confrontation with mortality, raw and uncompromising."
        </p>
        <p
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "7px",
            letterSpacing: "0.1em",
            color: "rgba(204,0,0,0.55)",
            textTransform: "uppercase",
            marginTop: "4px",
          }}
        >
          Chuck Schuldiner
        </p>
      </div>

      {/* Centre logo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-metal-mania), serif",
            fontSize: "58px",
            color: "#fff",
            textShadow: "0 0 40px rgba(200,0,0,0.7), 3px 3px 0 #550000",
            lineHeight: "1",
            margin: 0,
          }}
        >
          Metal Forge
        </h1>
        <p
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "8px",
            letterSpacing: "0.28em",
            color: "rgba(255,255,255,0.35)",
            marginTop: "8px",
            textTransform: "uppercase",
          }}
        >
          AI-POWERED METAL CONTENT GENERATOR
        </p>
      </div>
    </header>
  );
}
