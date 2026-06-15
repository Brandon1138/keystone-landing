"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type InterfaceContourFieldProps = {
  anchorSelector?: string;
  className?: string;
};

/**
 * Hero-scoped atmospheric contour field for the Keystone landing page.
 * The canvas stays decorative and low contrast; content hierarchy remains primary.
 */
export function InterfaceContourField({
  anchorSelector = "[data-contour-anchor='hero-title']",
  className,
}: InterfaceContourFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const worldRef = useRef<"light" | "dark">("light");

  useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const read = () => {
      // Mirror the CSS: an explicit data-theme wins; only "system"/unset
      // follows the OS preference. Otherwise a light override on a dark OS
      // would leave the canvas using the dark-mode stroke on a light page.
      const explicit = document.documentElement.getAttribute("data-theme");
      const isDark =
        explicit === "dark" || (explicit !== "light" && systemTheme.matches);
      worldRef.current = isDark ? "dark" : "light";
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });
    systemTheme.addEventListener("change", read);
    return () => {
      mo.disconnect();
      systemTheme.removeEventListener("change", read);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseMQ = window.matchMedia("(pointer: coarse)");
    const reduced = reducedMQ.matches;
    const coarse = coarseMQ.matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const T1 = 0.000022;
    const T2 = 0.000017;
    const T3 = 0.000013;
    const T4 = 0.000009;

    const ANGLE = -0.18;
    const COSA = Math.cos(ANGLE);
    const SINA = Math.sin(ANGLE);
    const GRAD = 0.0026;

    const CELL = 22;
    let cols = 0;
    let rows = 0;
    let scalars = new Float32Array(0);

    let markCx = 0;
    let markCy = 0;
    let markRx = 1;
    let markRy = 1;
    let markActive = false;

    let curX = -1e6;
    let curY = -1e6;

    const updateMarkZone = () => {
      const rect = canvas.getBoundingClientRect();
      const markEl = document.querySelector(anchorSelector) as HTMLElement | null;
      if (markEl) {
        const mr = markEl.getBoundingClientRect();
        const visible = mr.bottom > 0 && mr.top < window.innerHeight;
        if (visible) {
          markCx = mr.left + mr.width / 2 - rect.left;
          markCy = mr.top + mr.height / 2 - rect.top;
          markRx = Math.max(160, mr.width / 2 + 40);
          markRy = Math.max(48, mr.height / 2 + 36);
          markActive = true;
        } else {
          markActive = false;
        }
      } else {
        markActive = false;
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
      scalars = new Float32Array(cols * rows);
      updateMarkZone();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const settleTimers = [
      window.setTimeout(resize, 200),
      window.setTimeout(resize, 1600),
    ];

    let frameCounter = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      curX = e.clientX - rect.left;
      curY = e.clientY - rect.top;
    };
    const onPointerLeave = () => {
      curX = -1e6;
      curY = -1e6;
    };

    if (!coarse && !reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }

    const scalar = (x: number, y: number, t: number): number => {
      const u = x * COSA + y * SINA;
      let topology = u * GRAD;

      topology += 0.95 * Math.sin(x * 0.0034 + t * T1);
      topology += 0.70 * Math.sin(y * 0.0046 - t * T2 * 1.3);
      topology += 0.45 * Math.sin((x * 0.0021 + y * 0.0036) + t * T3);
      topology += 0.30 * Math.cos((x * 0.0017 - y * 0.0028) - t * T4);

      if (markActive) {
        const dx = (x - markCx) / markRx;
        const dy = (y - markCy) / markRy;
        const r2 = dx * dx + dy * dy;
        if (r2 < 6) {
          topology += 1.55 * Math.exp(-r2 * 0.85);
        }
      }

      let f = topology;
      if (curX > -1e5) {
        const dx = x - curX;
        const dy = y - curY;
        const d2 = dx * dx + dy * dy;
        const R = 120;
        const R2 = R * R;
        if (d2 < R2) {
          const k = 1 - d2 / R2;
          f += 0.32 * k * k;
        }
      }

      return f;
    };

    const computeScalars = (t: number) => {
      let i = 0;
      for (let r = 0; r < rows; r++) {
        const y = r * CELL;
        for (let c = 0; c < cols; c++) {
          scalars[i++] = scalar(c * CELL, y, t);
        }
      }
    };

    const LEVELS: number[] = [];
    for (let v = -3.2; v <= 4.6; v += 0.55) LEVELS.push(v);

    const drawContours = (level: number) => {
      ctx.beginPath();
      for (let r = 0; r < rows - 1; r++) {
        const rowOff = r * cols;
        for (let c = 0; c < cols - 1; c++) {
          const i00 = rowOff + c;
          const v00 = scalars[i00];
          const v10 = scalars[i00 + 1];
          const v11 = scalars[i00 + cols + 1];
          const v01 = scalars[i00 + cols];

          let idx = 0;
          if (v00 > level) idx |= 1;
          if (v10 > level) idx |= 2;
          if (v11 > level) idx |= 4;
          if (v01 > level) idx |= 8;
          if (idx === 0 || idx === 15) continue;

          const x0 = c * CELL;
          const y0 = r * CELL;
          const x1 = x0 + CELL;
          const y1 = y0 + CELL;

          const eT = () => x0 + CELL * ((level - v00) / (v10 - v00));
          const eR = () => y0 + CELL * ((level - v10) / (v11 - v10));
          const eB = () => x0 + CELL * ((level - v01) / (v11 - v01));
          const eL = () => y0 + CELL * ((level - v00) / (v01 - v00));

          switch (idx) {
            case 1:
            case 14:
              ctx.moveTo(x0, eL());
              ctx.lineTo(eT(), y0);
              break;
            case 2:
            case 13:
              ctx.moveTo(eT(), y0);
              ctx.lineTo(x1, eR());
              break;
            case 4:
            case 11:
              ctx.moveTo(x1, eR());
              ctx.lineTo(eB(), y1);
              break;
            case 8:
            case 7:
              ctx.moveTo(eB(), y1);
              ctx.lineTo(x0, eL());
              break;
            case 3:
            case 12:
              ctx.moveTo(x0, eL());
              ctx.lineTo(x1, eR());
              break;
            case 6:
            case 9:
              ctx.moveTo(eT(), y0);
              ctx.lineTo(eB(), y1);
              break;
            case 5:
              ctx.moveTo(x0, eL());
              ctx.lineTo(eT(), y0);
              ctx.moveTo(x1, eR());
              ctx.lineTo(eB(), y1);
              break;
            case 10:
              ctx.moveTo(eT(), y0);
              ctx.lineTo(x1, eR());
              ctx.moveTo(eB(), y1);
              ctx.lineTo(x0, eL());
              break;
          }
        }
      }
      ctx.stroke();
    };

    let raf = 0;
    let running = true;

    const draw = (t: number) => {
      frameCounter = (frameCounter + 1) % 4;
      if (frameCounter === 0) updateMarkZone();
      ctx.clearRect(0, 0, width, height);
      computeScalars(t);

      ctx.lineCap = "butt";
      ctx.lineJoin = "miter";
      ctx.lineWidth = 0.9;
      // Using Keystone-compatible cobalt tones
      ctx.strokeStyle =
        worldRef.current === "dark"
          ? "rgba(185, 202, 255, 0.15)"
          : "rgba(26, 52, 105, 0.30)";

      for (let i = 0; i < LEVELS.length; i++) {
        drawContours(LEVELS[i]);
      }

      if (running && !reduced) raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            if (!running && !reduced) {
              running = true;
              raf = requestAnimationFrame(draw);
            }
          } else if (running) {
            running = false;
            cancelAnimationFrame(raf);
          }
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      for (const id of settleTimers) window.clearTimeout(id);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [anchorSelector]);

  return (
    <div className={cn("keystone-contour-field", className)} aria-hidden>
      <canvas ref={canvasRef} className="keystone-contour-field__canvas" />
    </div>
  );
}
