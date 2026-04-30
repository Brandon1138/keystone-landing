// Shared building blocks: nav, footer, primitives.

const { useState, useEffect, useRef } = React;

const Eyebrow = ({ children, num }) => (
  <div
    className="mono"
    style={{
      fontSize: 11,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--fg-muted)",
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}
  >
    {num ? <span style={{ color: "var(--accent)" }}>[{num}]</span> : <span style={{ color: "var(--accent)" }}>//</span>}
    <span>{children}</span>
  </div>
);

const Btn = ({ children, primary, href = "#", icon, onClick }) => {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "11px 18px",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: "-0.005em",
    textDecoration: "none",
    cursor: "pointer",
    border: "1px solid",
    transition: "background 120ms, border-color 120ms, color 120ms",
    lineHeight: 1,
  };
  const styles = primary
    ? {
        ...base,
        background: "var(--accent)",
        borderColor: "var(--accent)",
        color: "#FFFFFF",
      }
    : {
        ...base,
        background: "transparent",
        borderColor: "var(--border)",
        color: "var(--fg)",
      };
  return (
    <a
      href={href}
      onClick={onClick}
      style={styles}
      onMouseEnter={(e) => {
        if (primary) {
          e.currentTarget.style.background = "var(--accent-hover)";
          e.currentTarget.style.borderColor = "var(--accent-hover)";
        } else {
          e.currentTarget.style.borderColor = "var(--fg)";
        }
      }}
      onMouseLeave={(e) => {
        if (primary) {
          e.currentTarget.style.background = "var(--accent)";
          e.currentTarget.style.borderColor = "var(--accent)";
        } else {
          e.currentTarget.style.borderColor = "var(--border)";
        }
      }}
    >
      {icon}
      <span>{children}</span>
    </a>
  );
};

const Nav = ({ theme, setTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkStyle = {
    fontSize: 13,
    color: "var(--fg-muted)",
    textDecoration: "none",
    padding: "6px 4px",
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: scrolled ? "color-mix(in oklab, var(--bg) 85%, transparent)" : "var(--bg)",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
        transition: "border-color 200ms, background 200ms",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 32,
        }}
      >
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", color: "var(--fg)" }}>
          <span style={{ color: "var(--accent)" }}><IconKeystone size={18} /></span>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>keystone</span>
          <span className="mono" style={{ fontSize: 10, color: "var(--fg-subtle)", marginLeft: 4, paddingLeft: 10, borderLeft: "1px solid var(--border-subtle)" }}>
            v1.0.0
          </span>
        </a>

        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <a href="#capabilities" style={linkStyle}>Workbench</a>
          <a href="#matrix" style={linkStyle}>Algorithms</a>
          <a href="#quantum" style={linkStyle}>Quantum</a>
          <a href="#" style={linkStyle}>Docs</a>
          <a href="#" style={linkStyle}>Codex</a>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{
              background: "transparent",
              border: "1px solid var(--border-subtle)",
              color: "var(--fg-muted)",
              cursor: "pointer",
              width: 34,
              height: 34,
              borderRadius: 6,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {theme === "dark" ? <IconSun size={15} /> : <IconMoon size={15} />}
          </button>
          <a
            href="#"
            style={{
              ...linkStyle,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <IconGithub size={15} />
            <span>GitHub</span>
          </a>
          <Btn primary icon={<IconDownload size={15} />}>Download</Btn>
        </div>
      </div>
    </header>
  );
};

// ============================================================
// Window chrome that frames product screenshots
const WindowChrome = ({ children, title = "keystone", trafficStyle = "linear" }) => {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 8,
        overflow: "hidden",
        background: "var(--surface)",
        boxShadow: "0 1px 0 0 rgba(0,0,0,0.02)",
      }}
    >
      <div
        style={{
          height: 34,
          background: "var(--surface-raised)",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--border)" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--border)" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--border)" }} />
        </div>
        <div className="mono" style={{ fontSize: 11, color: "var(--fg-subtle)", marginLeft: 6 }}>
          {title}
        </div>
        <div style={{ flex: 1 }} />
        <div className="mono" style={{ fontSize: 11, color: "var(--fg-subtle)" }}>
          {trafficStyle}
        </div>
      </div>
      <div style={{ background: "#0F1114" }}>{children}</div>
    </div>
  );
};

// Plain mono pill, used for chips and capability tags
const Tag = ({ children, dim, accent }) => (
  <span
    className="mono"
    style={{
      fontSize: 11,
      letterSpacing: "0.04em",
      padding: "4px 8px",
      border: "1px solid var(--border-subtle)",
      borderRadius: 4,
      color: accent ? "var(--accent)" : dim ? "var(--fg-subtle)" : "var(--fg-muted)",
      background: "var(--surface)",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

const SectionHeader = ({ num, eyebrow, title, lede }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 720 }}>
    <Eyebrow num={num}>{eyebrow}</Eyebrow>
    <h2
      style={{
        fontSize: 38,
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        fontWeight: 500,
        margin: 0,
        textWrap: "pretty",
      }}
    >
      {title}
    </h2>
    {lede && (
      <p style={{ fontSize: 17, lineHeight: 1.55, color: "var(--fg-muted)", margin: 0, maxWidth: 600, textWrap: "pretty" }}>
        {lede}
      </p>
    )}
  </div>
);

const Section = ({ id, children, dense, panel }) => (
  <section
    id={id}
    style={{
      borderTop: "1px solid var(--border-subtle)",
      background: panel ? "var(--surface)" : "transparent",
    }}
  >
    <div
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: dense ? "56px 32px" : "104px 32px",
      }}
    >
      {children}
    </div>
  </section>
);

Object.assign(window, { Eyebrow, Btn, Nav, WindowChrome, Tag, SectionHeader, Section });
