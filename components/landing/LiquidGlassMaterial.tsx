"use client";

import dynamic from "next/dynamic";
import type { CSSProperties, ReactNode } from "react";

const LiquidGlass = dynamic(() => import("liquid-glass-react"), {
  ssr: false,
  loading: () => null,
});

type LiquidGlassMaterialProps = {
  children: ReactNode;
  className?: string;
  cornerRadius?: number;
  style?: CSSProperties;
};

export function LiquidGlassMaterial({
  children,
  className = "",
  cornerRadius = 28,
  style,
}: LiquidGlassMaterialProps) {
  return (
    <div className={`liquid-material ${className}`} style={{ borderRadius: cornerRadius, ...style }}>
      <LiquidGlass
        className="liquid-material-enhancement"
        cornerRadius={cornerRadius}
        displacementScale={36}
        blurAmount={0.055}
        saturation={122}
        aberrationIntensity={0.55}
        elasticity={0.08}
        overLight
        mode="standard"
        padding="0"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: cornerRadius,
          pointerEvents: "none",
          opacity: 0.32,
        }}
      >
        <span aria-hidden />
      </LiquidGlass>
      <div className="liquid-material-content">{children}</div>
    </div>
  );
}
