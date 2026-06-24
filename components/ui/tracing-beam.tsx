"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

type TracePoint = { x: number; y: number };

export function TracingBeam({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [points, setPoints] = useState<TracePoint[]>([]);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 35%"],
  });

  useEffect(() => {
    if (!contentRef.current || !ref.current) return;

    const updateGeometry = () => {
      if (!contentRef.current || !ref.current) return;
      const frame = ref.current.getBoundingClientRect();
      const nodes = Array.from(
        contentRef.current.querySelectorAll<HTMLElement>("[data-trace-node]"),
      );
      const nextPoints = nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - frame.left,
          y: rect.top + rect.height / 2 - frame.top,
        };
      });

      setSize({
        width: contentRef.current.offsetWidth,
        height: contentRef.current.offsetHeight,
      });
      setPoints(nextPoints);
    };
    const observer = new ResizeObserver(updateGeometry);
    observer.observe(contentRef.current);
    updateGeometry();
    return () => observer.disconnect();
  }, []);

  const dashOffset = useSpring(
    useTransform(scrollYProgress, [0, 1], [1, -0.16]),
    { stiffness: 240, damping: 42 },
  );
  const path =
    points.length === 3
      ? [
          `M ${points[0].x} ${points[0].y}`,
          `V ${points[1].y}`,
          `H ${points[2].x}`,
          `V ${points[2].y}`,
          `V ${size.height}`,
        ].join(" ")
      : "";

  return (
    <div className="evidence-trace" ref={ref} data-testid="evidence-trace">
      <div className="evidence-trace-rail" aria-hidden>
        <svg
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
        >
          <path
            d={path}
            className="evidence-trace-track"
          />
          {!reduceMotion && (
            <motion.path
              d={path}
              pathLength={1}
              className="evidence-trace-beam"
              strokeDasharray="0.16 0.84"
              style={{ strokeDashoffset: dashOffset }}
            />
          )}
        </svg>
      </div>
      <div ref={contentRef} className="evidence-trace-content">
        {children}
      </div>
    </div>
  );
}

export function TraceStage({
  index,
  label,
  className = "",
  children,
}: {
  index: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`trace-stage ${className}`.trim()}>
      <div className="trace-stage-marker" aria-hidden>
        <span className="trace-stage-node" data-trace-node />
        <span>{index} · {label}</span>
      </div>
      {children}
    </div>
  );
}
