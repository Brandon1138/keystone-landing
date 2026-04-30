// Page sections — each composed from parts.jsx primitives.

const Hero = () => {
  return (
    <section style={{ position: "relative", overflow: "hidden" }}>
      <div className="grid-bg" style={{
        position: "absolute", inset: 0,
        maskImage: "radial-gradient(ellipse at 50% 30%, black 35%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 35%, transparent 80%)",
        pointerEvents: "none",
      }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 96px", position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 26, maxWidth: 880 }}>
          <Eyebrow>POST-QUANTUM CRYPTOGRAPHY · WORKBENCH</Eyebrow>
          <h1
            style={{
              fontSize: "clamp(44px, 6.4vw, 72px)",
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
              fontWeight: 500,
              margin: 0,
              textWrap: "balance",
            }}
          >
            Measure the cryptography{" "}
            <span style={{ color: "var(--accent)" }}>before</span> the quantum era arrives.
          </h1>
          <p
            style={{
              fontSize: 19,
              lineHeight: 1.55,
              color: "var(--fg-muted)",
              margin: 0,
              maxWidth: 640,
              textWrap: "pretty",
            }}
          >
            Keystone benchmarks NIST PQC algorithms, runs hybrid encryption, and executes
            quantum workloads against IBM Quantum Cloud or local Qiskit simulators.
            A desktop instrument for cryptographers and security engineers.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 6 }}>
            <Btn primary icon={<IconWindows size={15} />}>Download for Windows</Btn>
            <Btn icon={<IconGithub size={15} />}>View on GitHub</Btn>
          </div>

          <div className="mono" style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--fg-subtle)", flexWrap: "wrap", marginTop: 4 }}>
            <span>v1.0.0</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>Windows · macOS · Linux</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>MIT</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>142 MB</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)" }} />
              build passing
            </span>
          </div>
        </div>

        <div style={{ marginTop: 64, position: "relative" }}>
          <WindowChrome title="keystone — dashboard">
            <img
              src="public/public/screenshots/dashboard.png"
              alt="Keystone dashboard showing Run Benchmarks, Run Encryption, and Quantum Workloads quick actions"
              style={{ width: "100%", display: "block" }}
            />
          </WindowChrome>

          {/* corner mono callouts */}
          <div className="mono" style={{
            position: "absolute", top: -10, right: 0,
            fontSize: 10, color: "var(--fg-subtle)", letterSpacing: "0.08em",
          }}>
            FIG.01 — DASHBOARD
          </div>
        </div>
      </div>
    </section>
  );
};

const CapabilitiesBar = () => {
  const items = [
    "KYBER", "DILITHIUM", "FALCON", "SPHINCS+",
    "AES-256", "RSA-4096", "ECDSA",
    "SHOR", "GROVER",
    "NIST PQC", "IBM QUANTUM", "QISKIT",
  ];
  return (
    <section style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)", background: "var(--surface)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "22px 32px", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--fg-subtle)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          Supports →
        </span>
        <div className="mono" style={{ display: "flex", flexWrap: "wrap", gap: "10px 26px", fontSize: 12, color: "var(--fg-muted)", letterSpacing: "0.05em" }}>
          {items.map((it, i) => (
            <span key={it} style={{ display: "inline-flex", alignItems: "center", gap: 26 }}>
              {it}
              {i < items.length - 1 && <span style={{ color: "var(--border)" }}>·</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

const Primitives = () => {
  const items = [
    {
      label: "01 / BENCHMARK",
      icon: <IconBenchmark size={18} />,
      title: "Run rigorous PQC benchmarks.",
      body: "Time keygen, encapsulation, and decapsulation across Kyber, Dilithium, Falcon, and classical baselines. Configure security parameter and iteration count.",
      metric: "10,000 iterations · phase-by-phase metrics",
    },
    {
      label: "02 / ENCRYPT",
      icon: <IconLock size={18} />,
      title: "Hybrid encryption, side by side.",
      body: "Generate keys, encrypt and decrypt with hybrid schemes. Compare ML-KEM + AES-GCM against classical RSA in real time.",
      metric: "ML-KEM · ML-DSA · AES-256-GCM · HKDF",
    },
    {
      label: "03 / EXECUTE",
      icon: <IconAtom size={18} />,
      title: "Quantum workloads, on real hardware.",
      body: "Submit Shor's and Grover's algorithms to IBM Quantum Cloud, or run them locally against a Qiskit simulator. Inspect circuits and results.",
      metric: "IBM Quantum · Qiskit local simulator",
    },
  ];

  return (
    <Section id="capabilities">
      <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
        <SectionHeader
          num="01"
          eyebrow="THE WORKBENCH"
          title="Three primitives. One desktop application."
          lede="Keystone is built around three operations the cryptography migration depends on. Each is first-class. None of them are demos."
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, border: "1px solid var(--border-subtle)" }}>
          {items.map((it, i) => (
            <div
              key={it.label}
              style={{
                padding: "36px 32px 32px",
                borderRight: i < items.length - 1 ? "1px solid var(--border-subtle)" : "none",
                display: "flex",
                flexDirection: "column",
                gap: 18,
                background: "var(--surface)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: "var(--accent)" }}>{it.icon}</span>
                <span className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", color: "var(--fg-subtle)" }}>
                  {it.label}
                </span>
              </div>
              <h3 style={{ fontSize: 22, lineHeight: 1.2, margin: 0, fontWeight: 500, letterSpacing: "-0.015em", textWrap: "balance" }}>
                {it.title}
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--fg-muted)", margin: 0, textWrap: "pretty" }}>
                {it.body}
              </p>
              <div style={{ flex: 1 }} />
              <div className="mono" style={{ fontSize: 11, color: "var(--fg-subtle)", paddingTop: 16, borderTop: "1px dashed var(--border-subtle)" }}>
                {it.metric}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const LiveByDesign = () => {
  return (
    <Section id="live" panel>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 380px) 1fr", gap: 64, alignItems: "start" }}>
        <div style={{ position: "sticky", top: 96, display: "flex", flexDirection: "column", gap: 22 }}>
          <Eyebrow num="02">LIVE BY DESIGN</Eyebrow>
          <h2 style={{ fontSize: 36, lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 500, margin: 0, textWrap: "balance" }}>
            An instrument, not a dashboard.
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--fg-muted)", margin: 0, textWrap: "pretty" }}>
            Every benchmark surfaces phase-by-phase timing, throughput, and resident memory.
            Numbers stream as the run progresses. No hidden aggregation, no rounded marketing figures.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 12, paddingTop: 22, borderTop: "1px solid var(--border-subtle)" }}>
            {[
              ["AVG TIME", "0.018811 ms", "key generation"],
              ["THROUGHPUT", "53,159 ops/s", "kyber-1024"],
              ["DECAPSULATION", "0.01953 ms", "10,000 iterations"],
              ["MAX TIME", "1.49938 ms", "outlier"],
            ].map(([k, v, sub]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <span className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", color: "var(--fg-subtle)" }}>{k}</span>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                  <span className="mono" style={{ fontSize: 14, color: "var(--fg)", fontFeatureSettings: '"tnum"' }}>{v}</span>
                  <span className="mono" style={{ fontSize: 10, color: "var(--fg-subtle)" }}>{sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <WindowChrome title="keystone — benchmarks · kyber (kem)">
            <img
              src="public/public/screenshots/benchmark-complete.png"
              alt="Completed benchmark output for Kyber KEM with key generation, encapsulation, and decapsulation phase metrics"
              style={{ width: "100%", display: "block" }}
            />
          </WindowChrome>
          <div className="mono" style={{ marginTop: 14, fontSize: 11, color: "var(--fg-subtle)", display: "flex", gap: 16, flexWrap: "wrap" }}>
            <span>FIG.02 — KYBER-1024 KEM · n=10,000</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>captured from a single workstation run</span>
          </div>
        </div>
      </div>
    </Section>
  );
};

const AlgorithmMatrix = () => {
  const rows = [
    { name: "ML-KEM (Kyber)", kind: "PQC · KEM", param: "1024", keysize: "1,568 B", status: "FIPS 203", level: "5", accent: true },
    { name: "ML-DSA (Dilithium)", kind: "PQC · Signature", param: "5", keysize: "2,592 B", status: "FIPS 204", level: "5", accent: true },
    { name: "FN-DSA (Falcon)", kind: "PQC · Signature", param: "1024", keysize: "1,793 B", status: "Draft", level: "5", accent: true },
    { name: "SLH-DSA (SPHINCS+)", kind: "PQC · Signature", param: "256s", keysize: "64 B", status: "FIPS 205", level: "5", accent: true },
    { name: "AES-256-GCM", kind: "Classical · AEAD", param: "256", keysize: "32 B", status: "FIPS 197", level: "—" },
    { name: "RSA-4096", kind: "Classical · Sig/KEX", param: "4096", keysize: "512 B", status: "RFC 8017", level: "—" },
    { name: "ECDSA P-384", kind: "Classical · Signature", param: "384", keysize: "48 B", status: "FIPS 186-5", level: "—" },
  ];

  return (
    <Section id="matrix">
      <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        <SectionHeader
          num="03"
          eyebrow="ALGORITHM MATRIX"
          title="Every algorithm Keystone ships with."
          lede="Post-quantum and classical, side by side. Parameters and standards listed verbatim from NIST and IETF references."
        />

        <div style={{ border: "1px solid var(--border-subtle)", borderRadius: 4, overflow: "hidden", background: "var(--surface)" }}>
          <div
            className="mono"
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.4fr 0.8fr 1fr 1.2fr 0.6fr",
              fontSize: 10,
              letterSpacing: "0.12em",
              padding: "12px 18px",
              color: "var(--fg-subtle)",
              borderBottom: "1px solid var(--border-subtle)",
              background: "var(--surface-raised)",
            }}
          >
            <div>ALGORITHM</div>
            <div>FAMILY</div>
            <div>PARAM</div>
            <div>PUB KEY</div>
            <div>STANDARD</div>
            <div>NIST L</div>
          </div>
          {rows.map((r, i) => (
            <div
              key={r.name}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.4fr 0.8fr 1fr 1.2fr 0.6fr",
                padding: "16px 18px",
                fontSize: 13,
                alignItems: "center",
                borderBottom: i < rows.length - 1 ? "1px solid var(--border-subtle)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 500 }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: r.accent ? "var(--accent)" : "var(--border)"
                }} />
                {r.name}
              </div>
              <div className="mono" style={{ color: "var(--fg-muted)", fontSize: 12 }}>{r.kind}</div>
              <div className="mono" style={{ color: "var(--fg-muted)", fontSize: 12 }}>{r.param}</div>
              <div className="mono" style={{ color: "var(--fg-muted)", fontSize: 12 }}>{r.keysize}</div>
              <div className="mono" style={{ color: "var(--fg-muted)", fontSize: 12 }}>{r.status}</div>
              <div className="mono" style={{ color: r.accent ? "var(--accent)" : "var(--fg-subtle)", fontSize: 12 }}>{r.level}</div>
            </div>
          ))}
        </div>

        <div className="mono" style={{ fontSize: 11, color: "var(--fg-subtle)", display: "flex", gap: 12, flexWrap: "wrap" }}>
          <span>↳ TBL.01</span>
          <span>·</span>
          <span>Sources: NIST FIPS 203/204/205, IETF drafts, RFC 8017</span>
          <span>·</span>
          <span>Updated 2026-04</span>
        </div>
      </div>
    </Section>
  );
};

const Quantum = () => {
  return (
    <Section id="quantum" panel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
        <div>
          <WindowChrome title="keystone — encryption · ml-kem + aes-256-gcm + ml-dsa">
            <img
              src="public/public/screenshots/encryption.png"
              alt="Encryption operations panel with ML-KEM key exchange, AES-256-GCM encryption, and ML-DSA signing flow"
              style={{ width: "100%", display: "block" }}
            />
          </WindowChrome>
          <div className="mono" style={{ marginTop: 14, fontSize: 11, color: "var(--fg-subtle)" }}>
            FIG.03 — HYBRID ENCRYPT + SIGN PIPELINE
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <Eyebrow num="04">QUANTUM RUNTIME</Eyebrow>
          <h2 style={{ fontSize: 36, lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 500, margin: 0, textWrap: "balance" }}>
            Real circuits. Real hardware. <span style={{ color: "var(--accent)" }}>No mysticism.</span>
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--fg-muted)", margin: 0, textWrap: "pretty" }}>
            Submit Shor's factoring and Grover's search to IBM Quantum Cloud through your own
            account, or iterate locally on a Qiskit simulator. Keystone bundles the Python
            runtime — there's nothing to install, nothing to wire up.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 8, border: "1px solid var(--border-subtle)", borderRadius: 4 }}>
            {[
              ["IBM Quantum Cloud", "Authenticate with your IBM Quantum API token. Submit jobs, monitor queue, retrieve results."],
              ["Local Qiskit Simulator", "AerSimulator embedded. Iterate Shor's and Grover's without burning cloud credits."],
              ["Bundled Python Env", "~150 MB managed env. No system Python required, no version skew."],
            ].map(([t, d], i, a) => (
              <div key={t} style={{
                padding: "16px 18px",
                borderBottom: i < a.length - 1 ? "1px solid var(--border-subtle)" : "none",
                display: "flex", flexDirection: "column", gap: 6,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <IconCheck size={14} className="" />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{t}</span>
                </div>
                <p style={{ margin: 0, marginLeft: 22, fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.5 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

const OpenSource = () => {
  return (
    <Section id="open">
      <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
        <SectionHeader
          num="05"
          eyebrow="OPEN SOURCE · SPECS"
          title="Read the source. Build it yourself."
          lede="Keystone is MIT-licensed, end to end. The cryptographic primitives come from vetted, audited libraries — not bespoke implementations."
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: "1px solid var(--border-subtle)" }}>
          <div style={{ padding: 32, borderRight: "1px solid var(--border-subtle)", background: "var(--surface)" }}>
            <Eyebrow>LICENSE · CONTRIBUTION</Eyebrow>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 500, letterSpacing: "-0.01em" }}>MIT, no asterisks.</h3>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: "var(--fg-muted)" }}>
                Fork it. Audit it. Ship it inside your migration tooling. The repo holds the Electron shell, the
                Python engine, and the parameter definitions. PRs reviewed weekly.
              </p>
              <div className="mono" style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 6, columnGap: 16, fontSize: 12, color: "var(--fg-muted)", marginTop: 8 }}>
                <span style={{ color: "var(--fg-subtle)" }}>license</span><span>MIT</span>
                <span style={{ color: "var(--fg-subtle)" }}>repo</span><span>github.com/keystone-pqc/keystone</span>
                <span style={{ color: "var(--fg-subtle)" }}>contributors</span><span>14</span>
                <span style={{ color: "var(--fg-subtle)" }}>last release</span><span>v1.0.0 · 2026-04-22</span>
              </div>
            </div>
          </div>

          <div style={{ padding: 32, background: "var(--surface)" }}>
            <Eyebrow>BUILD · REQUIREMENTS</Eyebrow>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 500, letterSpacing: "-0.01em" }}>Runs on a laptop.</h3>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: "var(--fg-muted)" }}>
                Electron desktop application. The bundled Python environment is provisioned on first launch.
                Quantum hardware execution requires an IBM Quantum account.
              </p>
              <div className="mono" style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 6, columnGap: 16, fontSize: 12, color: "var(--fg-muted)", marginTop: 8 }}>
                <span style={{ color: "var(--fg-subtle)" }}>os</span><span>Windows 10+ · macOS 12+ · Linux (deb/rpm)</span>
                <span style={{ color: "var(--fg-subtle)" }}>cpu</span><span>x86_64 · arm64</span>
                <span style={{ color: "var(--fg-subtle)" }}>ram</span><span>8 GB (16 GB for large iteration sweeps)</span>
                <span style={{ color: "var(--fg-subtle)" }}>disk</span><span>~310 MB after first launch</span>
                <span style={{ color: "var(--fg-subtle)" }}>runtime</span><span>Python 3.11 (bundled)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

const DownloadBand = () => {
  return (
    <section style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--surface)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Eyebrow>READY · v1.0.0</Eyebrow>
          <h2 style={{ fontSize: 38, lineHeight: 1.08, letterSpacing: "-0.02em", fontWeight: 500, margin: 0, textWrap: "balance" }}>
            Download the workbench. Run a benchmark in under a minute.
          </h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 6 }}>
            <Btn primary icon={<IconWindows size={15} />}>Download for Windows</Btn>
            <Btn icon={<IconGithub size={15} />}>View on GitHub</Btn>
          </div>
        </div>

        <div style={{ border: "1px solid var(--border-subtle)", borderRadius: 6, padding: 22, background: "var(--bg)" }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", color: "var(--fg-subtle)", marginBottom: 12 }}>
            KEYSTONE-1.0.0-WIN-X64.EXE · 142 MB
          </div>
          <div className="mono" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", rowGap: 8, columnGap: 12, fontSize: 11.5, color: "var(--fg-muted)", alignItems: "center" }}>
            <span style={{ color: "var(--fg-subtle)" }}>sha256</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--fg)" }}>
              4b1d8e9f0c2a7e6f5d3b9c8a7e6f5d4b3c2a1e0f9d8c7b6a5e4d3c2b1a0f9e8d
            </span>
            <button aria-label="Copy SHA256" style={{ background: "transparent", border: "none", color: "var(--fg-subtle)", cursor: "pointer", padding: 0 }}>
              <IconCopy size={14} />
            </button>
            <span style={{ color: "var(--fg-subtle)" }}>signed</span>
            <span>EV cert · keystone-pqc</span>
            <span></span>
            <span style={{ color: "var(--fg-subtle)" }}>released</span>
            <span>2026-04-22</span>
            <span></span>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--bg)" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--fg-muted)" }}>
        <span style={{ color: "var(--accent)" }}><IconKeystone size={16} /></span>
        <span style={{ fontSize: 13 }}>keystone</span>
        <span className="mono" style={{ fontSize: 11, color: "var(--fg-subtle)", marginLeft: 6 }}>© 2026 · MIT</span>
      </div>
      <nav className="mono" style={{ display: "flex", gap: 22, fontSize: 11, color: "var(--fg-subtle)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        <a href="#" style={{ textDecoration: "none", color: "inherit" }}>repo</a>
        <a href="#" style={{ textDecoration: "none", color: "inherit" }}>docs</a>
        <a href="#" style={{ textDecoration: "none", color: "inherit" }}>codex</a>
        <a href="#" style={{ textDecoration: "none", color: "inherit" }}>license</a>
        <a href="#" style={{ textDecoration: "none", color: "inherit" }}>security</a>
      </nav>
    </div>
  </footer>
);

Object.assign(window, { Hero, CapabilitiesBar, Primitives, LiveByDesign, AlgorithmMatrix, Quantum, OpenSource, DownloadBand, Footer });
