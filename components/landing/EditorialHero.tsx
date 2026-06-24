import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SCHEMES = ["ML-KEM", "ML-DSA", "Falcon", "SPHINCS+"] as const;

export function EditorialHero() {
  return (
    <div className="editorial-hero" data-contour-anchor="hero-title">
      <span className="hero-meta" aria-hidden>
        v1.0.0 / macOS / Apple Silicon
      </span>

      <h1 className="hero-statement" aria-label="Benchmark post-quantum cryptography">
        <span>Benchmark</span>
        <span>post&#8209;quantum</span>
        <span>cryptography</span>
      </h1>

      <div className="hero-readout" aria-hidden>
        <span className="hero-readout-value">
          <span className="hero-readout-tag">ML-KEM</span>
          0.0060
          <small>ms / op</small>
        </span>
        <span className="hero-readout-rule" />
        <span className="hero-readout-cap" />
      </div>

      <p className="hero-lede">Local. Signed + notarised. Reproducible.</p>

      <div className="hero-actions">
        <Link href="#benchmarks" className="hero-action-primary">
          View benchmarks
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link href="/docs/" className="hero-action-secondary">
          Read docs
        </Link>
      </div>

      <p className="hero-schemes">
        {SCHEMES.join("  ·  ")}
        <span className="hero-schemes-base">  ·  vs RSA / ECDSA / AES</span>
      </p>
    </div>
  );
}
