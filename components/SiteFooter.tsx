const NOTES = ["♩", "♪", "♫", "♬"];

const NOTE_LABEL_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-cinzel), serif",
  fontSize: "7px",
  letterSpacing: "0.2em",
  color: "rgba(204,0,0,0.4)",
  textTransform: "uppercase",
};

const NOTE_CHAR_STYLE: React.CSSProperties = {
  fontSize: "18px",
  color: "rgba(204,0,0,0.35)",
  lineHeight: "1",
};

export default function SiteFooter() {
  return (
    <footer
      style={{
        height: "90px",
        background: "rgba(0,0,0,0.90)",
        borderTop: "1px solid rgba(204,0,0,0.2)",
        display: "grid",
        gridTemplateColumns: "188px 1fr 188px",
        alignItems: "center",
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Left notes */}
      <div
        style={{
          padding: "0 14px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={NOTE_CHAR_STYLE}>{NOTES[0]}</div>
          <div style={NOTE_LABEL_STYLE}>Riff</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={NOTE_CHAR_STYLE}>{NOTES[1]}</div>
          <div style={NOTE_LABEL_STYLE}>Blast</div>
        </div>
      </div>

      {/* Centre */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--font-metal-mania), serif",
            fontSize: "16px",
            color: "#ffffff",
            textShadow: "0 0 20px rgba(204,0,0,0.5)",
            letterSpacing: "0.05em",
          }}
        >
          Metal Forge
        </div>
        <div
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "7px",
            letterSpacing: "0.25em",
            color: "rgba(255,255,255,0.25)",
            marginTop: "4px",
            textTransform: "uppercase",
          }}
        >
          Powered by Claude AI · 2024
        </div>
      </div>

      {/* Right notes */}
      <div
        style={{
          padding: "0 14px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={NOTE_CHAR_STYLE}>{NOTES[2]}</div>
          <div style={NOTE_LABEL_STYLE}>Growl</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={NOTE_CHAR_STYLE}>{NOTES[3]}</div>
          <div style={NOTE_LABEL_STYLE}>Death</div>
        </div>
      </div>
    </footer>
  );
}
