"use client";

import { useCallback, useRef, useState } from "react";

/* Resource projections mirror Keystone's in-app Resource Scaling Predictor,
   which extrapolates from a measured Shor/Grover run using published estimates:
   Gidney 2025 (Shor / RSA-ECC), NIST CSRC 2024 and Grassl et al. 2016
   (Grover / AES oracle), NCSC 2024 (practical Grover cost). The figures are
   projections, not Keystone runs. The 127 figure is the qubit count of the
   ibm_brisbane processor the demonstration above executed on. */

type Status = "vulnerable" | "at-risk" | "deferred" | "secure";

type Target = {
  id: string;
  name: string;
  family: string;
  attack: string;
  attackKind: "Shor" | "Grover";
  logical: string;
  physical: string;
  runtime: string;
  cost: string;
  costLabel: string;
  status: Status;
  statusLabel: string;
  horizon: string;
  gap: string;
  note: string;
};

const STATUS_COPY: Record<Status, string> = {
  vulnerable: "Vulnerable",
  "at-risk": "At risk",
  deferred: "Deferred",
  secure: "Holds",
};

const TARGETS: readonly Target[] = [
  {
    id: "ecc-256",
    name: "ECC P-256",
    family: "Elliptic curve · asymmetric",
    attack: "Shor's algorithm",
    attackKind: "Shor",
    logical: "2,560",
    physical: "10.0M",
    runtime: "~2 days",
    cost: "35.0M",
    costLabel: "T-gates",
    status: "vulnerable",
    statusLabel: STATUS_COPY.vulnerable,
    horizon: "Estimated break: 2030",
    gap: "≈ 79,000×",
    note: "Fewer logical qubits than RSA of equivalent strength. Elliptic curve keys fall first.",
  },
  {
    id: "rsa-2048",
    name: "RSA-2048",
    family: "Integer factoring · asymmetric",
    attack: "Shor's algorithm",
    attackKind: "Shor",
    logical: "6,157",
    physical: "8.6M",
    runtime: "~4.5 days",
    cost: "4.0B",
    costLabel: "T-gates",
    status: "at-risk",
    statusLabel: STATUS_COPY["at-risk"],
    horizon: "Estimated break: 2030",
    gap: "≈ 68,000×",
    note: "112-bit security and the workhorse of TLS and code signing. The first high-value asymmetric target.",
  },
  {
    id: "rsa-4096",
    name: "RSA-4096",
    family: "Integer factoring · asymmetric",
    attack: "Shor's algorithm",
    attackKind: "Shor",
    logical: "11,200",
    physical: "22.9M",
    runtime: "~1 month",
    cost: "27.9B",
    costLabel: "T-gates",
    status: "deferred",
    statusLabel: STATUS_COPY.deferred,
    horizon: "T-gate cost grows n^2.8",
    gap: "≈ 180,000×",
    note: "More headroom, same eventual fate. Doubling the key barely shifts the curve.",
  },
  {
    id: "aes-256",
    name: "AES-256",
    family: "Symmetric cipher",
    attack: "Grover's search",
    attackKind: "Grover",
    logical: "6,681",
    physical: "34–42M",
    runtime: "30–40+ yrs",
    cost: "2^128",
    costLabel: "oracle calls",
    status: "secure",
    statusLabel: STATUS_COPY.secure,
    horizon: "Secure for decades",
    gap: "> 270,000×",
    note: "Grover only square-roots the search. Doubling the key length restores full strength, so symmetric crypto holds.",
  },
];

export function QuantumScalingPredictor() {
  const [activeId, setActiveId] = useState<string>("rsa-2048");
  const railRef = useRef<HTMLDivElement>(null);

  const active = TARGETS.find((t) => t.id === activeId) ?? TARGETS[1];

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const index = TARGETS.findIndex((t) => t.id === activeId);
      let next = index;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % TARGETS.length;
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index - 1 + TARGETS.length) % TARGETS.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = TARGETS.length - 1;
      const nextTarget = TARGETS[next];
      setActiveId(nextTarget.id);
      const node = railRef.current?.querySelector<HTMLButtonElement>(
        `[data-target-id="${nextTarget.id}"]`,
      );
      node?.focus();
    },
    [activeId],
  );

  return (
    <div className="quantum-scale">
      <div className="quantum-scale-head">
        <h3>The same algorithm, pointed at production cryptography.</h3>
        <p>
          Keystone scales a measured run into a resource estimate for real targets: the
          logical and physical qubits, the runtime, and the calendar it would take to break each one.
        </p>
      </div>

      <div className="scale-shell">
        <div className="scale-rail-col">
          <div
            className="scale-rail"
            role="radiogroup"
            aria-label="Cryptographic target"
            ref={railRef}
            onKeyDown={onKeyDown}
          >
            {TARGETS.map((target) => {
              const selected = target.id === active.id;
              return (
                <button
                  type="button"
                  key={target.id}
                  data-target-id={target.id}
                  role="radio"
                  aria-checked={selected}
                  tabIndex={selected ? 0 : -1}
                  className="scale-target"
                  data-status={target.status}
                  data-selected={selected}
                  onClick={() => setActiveId(target.id)}
                >
                  <span className="scale-target-dot" data-status={target.status} aria-hidden />
                  <span className="scale-target-name">{target.name}</span>
                  <span className="scale-target-attack">{target.attackKind}</span>
                </button>
              );
            })}
          </div>
          <div className="scale-today">
            <span className="scale-today-label">Largest processor accessible today</span>
            <span className="scale-today-value mono-data">127 qubits</span>
            <span className="scale-today-sub">ibm_brisbane, the processor the run above used</span>
          </div>
        </div>

        <div className="scale-readout" key={active.id} aria-live="polite">
          <div className="scale-readout-head">
            <div>
              <span className="scale-readout-name">{active.name}</span>
              <span className="scale-readout-family">{active.family}</span>
            </div>
            <span className="scale-status" data-status={active.status}>
              <span className="scale-status-dot" data-status={active.status} aria-hidden />
              {active.statusLabel}
            </span>
          </div>

          <dl className="scale-metrics">
            <div>
              <dt>Attack</dt>
              <dd>{active.attack}</dd>
            </div>
            <div>
              <dt>Logical qubits</dt>
              <dd className="mono-data">{active.logical}</dd>
            </div>
            <div>
              <dt>Physical qubits</dt>
              <dd className="mono-data">{active.physical}</dd>
            </div>
            <div>
              <dt>Projected runtime</dt>
              <dd className="mono-data">{active.runtime}</dd>
            </div>
            <div>
              <dt>Circuit cost</dt>
              <dd className="mono-data">
                {active.cost} <small>{active.costLabel}</small>
              </dd>
            </div>
            <div>
              <dt>Horizon</dt>
              <dd>{active.horizon}</dd>
            </div>
          </dl>

          <div className="scale-gap">
            <span className="scale-gap-value mono-data">{active.gap}</span>
            <span className="scale-gap-label">
              the physical qubits of ibm_brisbane, today&rsquo;s 127-qubit demonstration processor
            </span>
          </div>

          <p className="scale-note">{active.note}</p>
        </div>
      </div>

      <p className="scale-sources">
        Projections, not Keystone runs. Sources: Gidney 2025 · NIST CSRC 2024 · Grassl et&nbsp;al. 2016 · NCSC 2024.
      </p>
    </div>
  );
}
