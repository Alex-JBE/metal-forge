const ACCENT = "rgba(204,0,0,0.5)";
const QUOTE_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-crimson-text), Georgia, serif",
  fontStyle: "italic",
  fontSize: "11px",
  color: "rgba(255,255,255,0.7)",
  lineHeight: "1.65",
};
const AUTHOR_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-cinzel), serif",
  fontSize: "7px",
  color: ACCENT,
  letterSpacing: "0.15em",
  marginTop: "6px",
  textTransform: "uppercase",
};
const RED_LINE: React.CSSProperties = {
  width: "24px",
  height: "2px",
  background: "#cc0000",
  marginBottom: "8px",
};

export default function SiteHeader() {
  return (
    <header
      style={{
        height: "180px",
        background: "rgba(0,0,0,0.88)",
        display: "grid",
        gridTemplateColumns: "188px 1fr 188px",
        alignItems: "center",
        borderBottom: "1px solid rgba(204,0,0,0.2)",
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Left quote */}
      <div style={{ padding: "16px 14px" }}>
        <div style={RED_LINE} />
        <p style={QUOTE_STYLE}>
          "If it doesn't hurt to write, it won't heal to hear."
        </p>
        <p style={AUTHOR_STYLE}>Metal Lyric Philosophy</p>
      </div>

      {/* Centre logo */}
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "var(--font-metal-mania), serif",
            fontSize: "52px",
            color: "#ffffff",
            textShadow: "0 0 30px rgba(204,0,0,0.6), 0 0 60px rgba(204,0,0,0.2)",
            lineHeight: "1",
            letterSpacing: "0.02em",
          }}
        >
          Metal Forge
        </h1>
        <p
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "8px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.4)",
            marginTop: "10px",
            textTransform: "uppercase",
          }}
        >
          AI-Powered Metal Content Generator
        </p>
      </div>

      {/* Right quote */}
      <div style={{ padding: "16px 14px", textAlign: "right" }}>
        <div style={{ ...RED_LINE, marginLeft: "auto" }} />
        <p style={QUOTE_STYLE}>
          "Death metal is a confrontation with mortality — raw, honest, uncompromising."
        </p>
        <p style={AUTHOR_STYLE}>Chuck Schuldiner</p>
      </div>
    </header>
  );
}
