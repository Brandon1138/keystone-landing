const Hero = () => (
  <section className="hero" id="platform">
    <div className="container hero-grid">
      <div className="hero-copy">
        <Eyebrow>Post-quantum ready</Eyebrow>
        <h1>
          Post-Quantum Cryptography, Benchmarked for <span className="accent-word">Reality.</span>
        </h1>
        <p className="lede">
          Keystone is the infrastructure for evaluating and benchmarking next-generation
          cryptography. Exact. Compressed. Resilient.
        </p>
        <div className="hero-actions">
          <Btn primary href="#benchmarks" icon={<IconArrow size={16} />}>Explore the Platform</Btn>
          <Btn href="#benchmarks" icon={<IconBenchmark size={16} />}>View Benchmarks</Btn>
        </div>
        <div className="trusted">
          <span className="trusted-label mono">Trusted by researchers and engineers at</span>
          <div className="trusted-list">
            <span>NIST</span>
            <span>MITRE</span>
            <span>Johns Hopkins</span>
            <span>Cloudflare</span>
          </div>
        </div>
      </div>

      <div className="product-card" aria-label="Keystone benchmark overview mock interface">
        <div className="product-header">
          <LogoWordmark size={28} />
          <span className="mono" style={{ color: "var(--dark-muted)", fontSize: 12 }}>Latency (ms)</span>
        </div>
        <div className="product-body">
          <aside className="product-side" aria-hidden="true">
            {["Overview", "Benchmarks", "Schemes", "Runs", "Systems", "Reports", "API Keys", "Settings"].map((item) => (
              <div key={item}>{item}</div>
            ))}
          </aside>
          <div className="dashboard">
            <h2 style={{ margin: 0, fontSize: 22 }}>Benchmark Overview</h2>
            <div className="stat-grid">
              {[
                ["Schemes", "18"],
                ["Benchmarks", "1,248"],
                ["Systems", "32"],
                ["Runs", "4,936"],
              ].map(([label, value]) => (
                <div className="stat-card" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <span>+4 this week</span>
                </div>
              ))}
            </div>
            <ProductChart />
            <div className="stat-grid">
              {[
                ["ML-KEM-768", "0.23 ms"],
                ["ML-KEM-1024", "0.41 ms"],
                ["ML-KEM-1536", "0.76 ms"],
                ["Hybrid", "0.31 ms"],
              ].map(([label, value]) => (
                <div className="dark-card" key={label}>
                  <span>{label}</span>
                  <strong className="mono" style={{ display: "block", marginTop: 7 }}>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const MetricsBand = () => (
  <section className="metrics-band" aria-label="Keystone platform metrics">
    <div className="container metrics-grid">
      {[
        [<IconTarget />, "100%", "Reproducible Benchmarks", "Deterministic. Verifiable. Repeatable."],
        [<IconLayers />, "18+", "Post-Quantum Schemes", "Continuously added and validated."],
        [<IconTimer />, "ns-s", "Latency Precision", "From nanoseconds to seconds."],
        [<IconShield />, "32+", "Platforms Validated", "Hardware, OS, and toolchains."],
      ].map(([icon, value, label, detail]) => (
        <div className="metric" key={label}>
          {icon}
          <strong>{value}</strong>
          <span>{label}</span>
          <span>{detail}</span>
        </div>
      ))}
    </div>
  </section>
);

const Capabilities = () => (
  <Section id="benchmarks">
    <SectionHeader eyebrow="Built for what's next" title="Core Capabilities" />
    <div className="cards-4">
      {[
        [<IconBenchmark />, "Benchmarking Infrastructure", "High-fidelity measurements with precise timing, memory, and throughput analysis across platforms."],
        [<IconBlocks />, "Hybrid Cryptography Evaluation", "Compare hybrid constructions and quantify security-performance trade-offs with clarity."],
        [<IconTarget />, "Reproducible Results", "Containerized environments, versioned runs, and signed reports you can trust and share."],
        [<IconCode />, "Developer and Research Workflows", "APIs, SDKs, and exportable data designed for integration and automation."],
      ].map(([icon, title, body]) => (
        <article className="card" key={title}>
          <span style={{ color: "var(--accent)" }}>{icon}</span>
          <h3>{title}</h3>
          <p>{body}</p>
          <a href="#download">Learn more -&gt;</a>
        </article>
      ))}
    </div>
  </Section>
);

const Evidence = () => (
  <Section id="security">
    <div className="evidence-panel">
      <div className="evidence-grid">
        <div>
          <Eyebrow>See it in action</Eyebrow>
          <h2 style={{ margin: "18px 0 14px", fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.04 }}>
            Compare. Measure. Decide with Confidence.
          </h2>
          <p style={{ color: "var(--dark-muted)" }}>
            Keystone delivers precise, apples-to-apples benchmarking so you can choose the
            right algorithms for your systems.
          </p>
          <ul className="check-list">
            {[
              "Latency, throughput, and memory metrics",
              "Key sizes, signature sizes, and CPU cycles",
              "Multiple parameter sets and variants",
              "Export results, charts, and raw data",
            ].map((item) => (
              <li key={item}><IconCheck size={15} /> <span>{item}</span></li>
            ))}
          </ul>
          <Btn primary href="#download">Explore Live Benchmarks</Btn>
        </div>
        <div className="screenshot-frame">
          <img
            src="public/public/screenshots/benchmark-complete.png"
            alt="Completed Keystone benchmark output with key generation, encapsulation, and decapsulation metrics"
          />
        </div>
      </div>
    </div>
  </Section>
);

const TrustProcess = () => (
  <Section>
    <div className="process-grid">
      <div className="process-copy">
        <Eyebrow>Engineered for trust</Eyebrow>
        <h2 style={{ margin: 0, fontSize: "clamp(30px, 3.8vw, 46px)", lineHeight: 1.05 }}>
          Why Keystone Exists
        </h2>
        <p>
          Post-quantum security demands more than theory. It demands measurement.
          Keystone provides the neutral, reproducible infrastructure to evaluate
          cryptography under real-world conditions.
        </p>
        <a href="#security" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>
          Read our security principles -&gt;
        </a>
      </div>
      <div className="process-flow" aria-label="Keystone evaluation process">
        {[
          ["Algorithms", "PQ and classical implementations"],
          ["Benchmark Engine", "Controlled runs and precise timing"],
          ["Analysis", "Metrics, charts, and comparisons"],
          ["Exports and APIs", "Data, reports, and integrations"],
          ["Deployment", "Real-world confidence"],
        ].map(([title, body]) => (
          <article className="flow-step" key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </div>
  </Section>
);

const Schemes = () => (
  <Section id="schemes" dark>
    <div className="section-head left">
      <Eyebrow>Supported and growing</Eyebrow>
      <h2>Schemes and Modes</h2>
    </div>
    <div className="schemes-grid">
      {[
        [<IconCube />, "ML-KEM", "Key encapsulation"],
        [<IconShield />, "ML-DSA", "Digital signatures"],
        [<IconCube />, "FALCON", "Digital signatures"],
        [<IconLayers />, "SPHINCS+", "Hash-based signatures"],
        [<IconTimer />, "Classic", "Baselines"],
        [<IconBlocks />, "Hybrid", "Compositions"],
        [<IconPlus />, "More", "Coming soon"],
      ].map(([icon, title, body]) => (
        <article className="scheme" key={title}>
          {icon}
          <strong>{title}</strong>
          <span>{body}</span>
        </article>
      ))}
    </div>
  </Section>
);

const FinalCta = () => (
  <section className="section blueprint cta" id="download">
    <div className="container cta-grid">
      <div>
        <Eyebrow>Ready to build securely</Eyebrow>
        <h2 style={{ marginTop: 18 }}>Measure today. Build tomorrow-secure.</h2>
        <p style={{ maxWidth: 560, marginTop: 14 }}>
          Join researchers and engineers who rely on Keystone for trustworthy
          post-quantum decisions.
        </p>
      </div>
      <div style={{ display: "grid", gap: 16, minWidth: 0 }}>
        <div className="button-row">
          <Btn primary href="#">Download for Windows</Btn>
          <Btn href="#contact">Contact Sales</Btn>
        </div>
        <CopyChecksum />
      </div>
    </div>
  </section>
);

Object.assign(window, {
  Hero,
  MetricsBand,
  Capabilities,
  Evidence,
  TrustProcess,
  Schemes,
  FinalCta,
});
