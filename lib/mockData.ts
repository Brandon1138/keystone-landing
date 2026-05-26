export const TOP_METRICS = [
  { label: "Total Benchmarks", value: "1,248", delta: "+18%" },
  { label: "Avg. Operations / s", value: "2.34M", delta: "+27%" },
  { label: "Median Latency", value: "0.42 ms", delta: "-12%" },
  { label: "Success Rate", value: "99.8%", delta: "+0.3%" },
] as const;

export const OPS_BARS = [
  { label: "ML-KEM",     value: "3.21M", width: 86 },
  { label: "ML-DSA",     value: "2.14M", width: 62 },
  { label: "Falcon",     value: "1.28M", width: 38 },
  { label: "SPHINCS+",   value: "0.73M", width: 22 },
  { label: "RSA (3072)", value: "0.31M", width: 9 },
  { label: "ECC (P-256)",value: "1.95M", width: 56 },
  { label: "AES-GCM",    value: "6.72M", width: 100 },
];

export const LATENCY_GAUGE = {
  value: "0.42",
  unit: "ms",
  p50: "0.42 ms",
  p95: "1.37 ms",
  p99: "2.81 ms",
};

export const LATENCY_SERIES = [
  { name: "ML-KEM",    color: "var(--color-primary)",         points: [60, 58, 62, 55, 50, 48, 52, 45, 48, 43, 41, 38] },
  { name: "ML-DSA",    color: "var(--color-primary-light)",   points: [72, 70, 68, 73, 65, 62, 60, 58, 55, 53, 50, 48] },
  { name: "Falcon",    color: "var(--color-secondary)",       points: [80, 78, 82, 76, 73, 70, 72, 68, 65, 62, 60, 58] },
  { name: "SPHINCS+",  color: "var(--color-secondary-light)", points: [88, 86, 90, 84, 82, 80, 82, 78, 75, 72, 70, 68] },
];

export const HISTOGRAM_BINS = [
  4, 7, 11, 18, 26, 35, 48, 62, 78, 88, 95, 100, 92, 78, 60, 44, 30, 20, 12, 7, 4,
];

export const SCHEME_TABLE = [
  { scheme: "ML-KEM (768)",      category: "PQC (KEM)",         level: "Lvl 1",   keyGen: "0.36", sign: "0.58", verify: "0.61", ops: "3.21M", size: "1.2",  ok: true },
  { scheme: "ML-DSA (87)",       category: "PQC (Signature)",   level: "Lvl 1",   keyGen: "0.41", sign: "0.93", verify: "0.71", ops: "2.14M", size: "1.6",  ok: true },
  { scheme: "Falcon (512)",      category: "PQC (Signature)",   level: "Lvl 1",   keyGen: "1.22", sign: "1.48", verify: "1.31", ops: "1.28M", size: "0.9",  ok: true },
  { scheme: "SPHINCS+ (SHA256)", category: "PQC (Signature)",   level: "Lvl 1",   keyGen: "8.77", sign: "8.28", verify: "9.11", ops: "0.73M", size: "17.3", ok: true },
  { scheme: "RSA (3072)",        category: "Classical (Sig.)",  level: "128-bit", keyGen: "2.14", sign: "4.73", verify: "0.26", ops: "0.38M", size: "0.6",  ok: true },
  { scheme: "ECC (P-256)",       category: "Classical (Sig.)",  level: "128-bit", keyGen: "0.19", sign: "0.51", verify: "0.18", ops: "1.95M", size: "0.1",  ok: true },
  { scheme: "AES-GCM (256)",     category: "Symmetric (AEAD)",  level: "256-bit", keyGen: "0.06", sign: "0.06", verify: "0.06", ops: "6.72M", size: "—",    ok: true },
];

export const COMPARISON = {
  legend: { pqc: "Post-Quantum", classical: "Classical" },
  metrics: [
    { label: "Security Level",  unit: "(Estimated security bits)", better: "Higher is better", pqc: { value: "128+",   height: 88 }, classical: { value: "~128",  height: 88 } },
    { label: "Throughput",      unit: "(Operations per second)",   better: "Higher is better", pqc: { value: "1.95M",  height: 95 }, classical: { value: "1.11M", height: 56 } },
    { label: "Median Latency",  unit: "(Lower is better)",         better: "Lower is better",  pqc: { value: "0.72 ms",height: 78 }, classical: { value: "0.38 ms",height: 42 } },
    { label: "Artifact Size",   unit: "(Average size in KB)",      better: "Lower is better",  pqc: { value: "5.8 KB", height: 96 }, classical: { value: "0.9 KB", height: 18 } },
  ],
};
