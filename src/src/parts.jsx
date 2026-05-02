const { useState } = React;

const LOGO_SRC = "design-mockups/keystone_logo.png";
const CHECKSUM = "4b1d8e9f0c2a7e6f5d3b9c8a7e6f5d4b3c2a1e0f9d8c7b6a5e4d3c2b1a0f9e8d";

const BrandMark = ({ size = 34 }) => (
  <span className="brand-mark" style={{ "--mark-size": `${size}px` }}>
    <img data-keystone-glyph="hidden-k" src={LOGO_SRC} alt="" />
  </span>
);

const LogoWordmark = ({ href = "#", size = 34 }) => (
  <a className="wordmark" href={href} aria-label="Keystone home">
    <BrandMark size={size} />
    <span className="wordmark-text">Keystone</span>
  </a>
);

const Btn = ({ children, href = "#", primary = false, icon }) => (
  <a className={`btn${primary ? " primary" : ""}`} href={href}>
    <span>{children}</span>
    {icon}
  </a>
);

const Eyebrow = ({ children }) => (
  <div className="eyebrow mono">{children}</div>
);

const Section = ({ id, children, dark = false, blueprint = false }) => (
  <section id={id} className={`section${dark ? " dark" : ""}${blueprint ? " blueprint" : ""}`}>
    <div className="container">{children}</div>
  </section>
);

const SectionHeader = ({ eyebrow, title, children, align = "center" }) => (
  <div className={`section-head${align === "left" ? " left" : ""}`}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2>{title}</h2>
    {children && <p className="lede">{children}</p>}
  </div>
);

const Nav = () => (
  <header className="site-nav">
    <div className="container nav-inner">
      <LogoWordmark />
      <nav className="nav-links" aria-label="Primary navigation">
        <a href="#platform">Platform</a>
        <a href="#benchmarks">Benchmarking</a>
        <a href="#security">Security</a>
        <a href="#docs">Documentation</a>
        <a href="#contact">Contact</a>
      </nav>
      <div className="nav-actions">
        <Btn href="#docs">Docs</Btn>
        <Btn primary href="#download">Download</Btn>
      </div>
    </div>
  </header>
);

const ProductChart = () => (
  <div className="dark-card chart" aria-label="Median latency comparison chart">
    <svg viewBox="0 0 720 230" role="img">
      <defs>
        <linearGradient id="chartFade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2E5E91" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#2E5E91" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[40, 80, 120, 160, 200].map((y) => (
        <line key={y} x1="54" x2="690" y1={y} y2={y} stroke="rgba(244,247,250,.12)" />
      ))}
      {[120, 245, 370, 495, 620].map((x) => (
        <line key={x} x1={x} x2={x} y1="24" y2="205" stroke="rgba(244,247,250,.08)" />
      ))}
      <path d="M58 178 C160 150 250 125 350 96 S560 58 680 42 L680 205 L58 205 Z" fill="url(#chartFade)" />
      <polyline points="58,178 180,146 310,108 450,78 680,43" fill="none" stroke="#6FA0D0" strokeWidth="3" />
      <polyline points="58,190 180,165 310,132 450,108 680,82" fill="none" stroke="#D28A15" strokeWidth="2" />
      <polyline points="58,204 180,196 310,184 450,170 680,154" fill="none" stroke="#7ABCA3" strokeWidth="2" />
      <text x="54" y="22" fill="#AEB9C4" fontSize="14">Median latency (ms) - key encapsulation</text>
      <text x="612" y="222" fill="#AEB9C4" fontSize="11">4096</text>
      <text x="52" y="222" fill="#AEB9C4" fontSize="11">256</text>
    </svg>
  </div>
);

const CopyChecksum = () => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CHECKSUM);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <div className="copy-panel" aria-label="Download checksum">
      <div className="caption mono">KEYSTONE-1.0.0-WIN-X64.EXE - 142 MB</div>
      <div className="copy-row mono">
        <span>sha256</span>
        <span className="hash">{CHECKSUM}</span>
        <button className="icon-button" type="button" aria-label="Copy SHA256" onClick={copy}>
          <IconCopy size={15} />
        </button>
      </div>
      {copied && <span className="copied mono">Copied</span>}
    </div>
  );
};

const Footer = () => (
  <footer className="footer" id="contact">
    <div className="container footer-grid">
      <div>
        <LogoWordmark size={32} />
        <p style={{ marginTop: 16 }}>
          Post-quantum cryptography & benchmarking platform.
        </p>
        <p className="mono" style={{ marginTop: 28 }}>© 2026 Keystone Labs, Inc.</p>
      </div>
      <div>
        <h3>Platform</h3>
        <nav>
          <a href="#platform">Overview</a>
          <a href="#benchmarks">Benchmarks</a>
          <a href="#schemes">Schemes</a>
          <a href="#download">Reports</a>
        </nav>
      </div>
      <div>
        <h3>Resources</h3>
        <nav>
          <a id="docs" href="#">Documentation</a>
          <a href="#">Blog</a>
          <a href="#">Security</a>
          <a href="#">Releases</a>
        </nav>
      </div>
      <div>
        <h3>Company</h3>
        <nav>
          <a href="#">About</a>
          <a href="#contact">Contact</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </nav>
      </div>
      <div>
        <h3>Stay In The Loop</h3>
        <p>Research, benchmarks, and platform updates.</p>
        <form className="signup">
          <input type="email" aria-label="Email address" placeholder="Email address" />
          <button className="btn primary" type="submit">Subscribe</button>
        </form>
      </div>
    </div>
  </footer>
);

Object.assign(window, {
  BrandMark,
  LogoWordmark,
  Btn,
  Eyebrow,
  Section,
  SectionHeader,
  Nav,
  ProductChart,
  CopyChecksum,
  Footer,
});
