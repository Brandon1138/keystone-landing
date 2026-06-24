"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

type StickyScrollItem = {
  title: string;
  description: string;
};

export type EvidenceStage = {
  index: string;
  eyebrow: string;
  caption: string;
  status: string;
  rows: readonly (readonly [string, string])[];
};

export function StickyScroll({
  content,
  stages,
  fingerprint,
}: {
  content: StickyScrollItem[];
  stages: readonly EvidenceStage[];
  fingerprint: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const entryRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeCard, setActiveCard] = useState(0);
  const { scrollY } = useScroll();

  const updateActiveCard = useCallback(() => {
    if (typeof window === "undefined") return;

    const anchor = window.innerHeight / 2;
    const proofRect = ref.current?.getBoundingClientRect();
    if (proofRect && proofRect.bottom < anchor) {
      setActiveCard(content.length - 1);
      return;
    }

    if (proofRect && proofRect.top > anchor) {
      setActiveCard(0);
      return;
    }

    let nextCard = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    entryRefs.current.forEach((entry, index) => {
      if (!entry) return;
      const rect = entry.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - anchor);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nextCard = index;
      }
    });

    setActiveCard(nextCard);
  }, [content.length]);

  useEffect(() => {
    updateActiveCard();
  }, [updateActiveCard]);

  useMotionValueEvent(scrollY, "change", updateActiveCard);

  return (
    <div className="sticky-proof" ref={ref} data-testid="sticky-proof">
      <div className="sticky-proof-copy">
        {content.map((item, index) => (
          <motion.article
            key={item.title}
            ref={(node) => {
              entryRefs.current[index] = node;
            }}
            data-testid="proof-card"
            data-active={activeCard === index}
            className="proof-entry"
            animate={{ opacity: activeCard === index ? 1 : 0.34 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="proof-index" aria-hidden>
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="sticky-proof-visual">
        <EvidenceTerminal activeStep={activeCard} stages={stages} fingerprint={fingerprint} />
      </div>
    </div>
  );
}

function EvidenceTerminal({
  activeStep,
  stages,
  fingerprint,
}: {
  activeStep: number;
  stages: readonly EvidenceStage[];
  fingerprint: string;
}) {
  const lastIndex = stages.length - 1;
  const clampedStep = Math.min(Math.max(activeStep, 0), lastIndex);
  const sealed = clampedStep >= lastIndex;
  const current = stages[clampedStep];
  const transcript = buildTranscript(stages, clampedStep, sealed, fingerprint);

  return (
    <figure
      className="keystone-terminal"
      data-step={clampedStep}
      data-sealed={sealed}
      data-testid="evidence-terminal"
    >
      <div className="terminal-chrome" aria-hidden>
        <span />
        <span />
        <span />
      </div>

      <figcaption className="terminal-header">
        <span>KS / Local terminal</span>
        <span data-testid="evidence-terminal-counter">
          {current.index} / {String(stages.length).padStart(2, "0")}
        </span>
      </figcaption>

      <div className="terminal-screen" aria-live="polite">
        <ol className="terminal-transcript">
          {transcript.map((line, index) => (
            <motion.li
              key={`${clampedStep}-${index}-${line.text}`}
              className={`terminal-line terminal-line-${line.kind}`}
              data-active={line.active ? "true" : "false"}
              data-testid={line.stage ? `terminal-stage-${line.stage}` : undefined}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: Math.min(index * 0.035, 0.22), ease: [0.16, 1, 0.3, 1] }}
            >
              {line.prompt ? <span className="terminal-prompt">{line.prompt}</span> : null}
              <span
                className="terminal-type"
                style={
                  {
                    "--terminal-steps": Math.max(line.text.length, 1),
                  } as CSSProperties & Record<"--terminal-steps", number>
                }
              >
                {line.text}
              </span>
            </motion.li>
          ))}
        </ol>
      </div>

      <div className="terminal-footer">
        <span className="terminal-status">
          <span className="terminal-run-dot" aria-hidden />
          {current.status}
        </span>
        <span className="terminal-seal" aria-label="Evidence fingerprint">
          {sealed ? fingerprint : "Fingerprint pending"}
        </span>
      </div>
    </figure>
  );
}

type TerminalLine = {
  kind: "command" | "output" | "success";
  text: string;
  prompt?: string;
  stage?: string;
  active?: boolean;
};

const STAGE_COMMANDS = [
  "keystone bench --scheme ML-KEM-768 --iterations 10000",
  "keystone inspect latest --include parameters",
  "keystone report export --format json --seal",
] as const;

function buildTranscript(
  stages: readonly EvidenceStage[],
  activeStep: number,
  sealed: boolean,
  fingerprint: string,
): TerminalLine[] {
  const lines: TerminalLine[] = [];

  stages.slice(0, activeStep + 1).forEach((stage, index) => {
    const active = index === activeStep;
    lines.push({
      kind: "command",
      prompt: "ks@local %",
      text: STAGE_COMMANDS[index] ?? "keystone verify latest",
      stage: stage.index,
      active,
    });
    lines.push({
      kind: "output",
      text: `${stage.index} ${stage.eyebrow.toLowerCase()}: ${stage.caption}`,
      stage: stage.index,
      active,
    });
    stage.rows.forEach(([label, value]) => {
      lines.push({
        kind: "output",
        text: `${label.toLowerCase().padEnd(16, ".")} ${value}`,
        stage: stage.index,
        active,
      });
    });
  });

  if (sealed) {
    lines.push({
      kind: "success",
      text: `fingerprint....... ${fingerprint}`,
      active: true,
    });
  }

  return lines;
}
