"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

export const ContainerScroll = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const [isMobile, setIsMobile] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const rotate = useTransform(
    scrollYProgress,
    [0.12, 0.58],
    reduceMotion ? [0, 0] : [isMobile ? 4 : 8, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    [0.12, 0.58],
    reduceMotion ? [1, 1] : [isMobile ? 0.94 : 0.96, 1],
  );
  const translate = useTransform(
    scrollYProgress,
    [0.12, 0.58],
    reduceMotion ? [0, 0] : [isMobile ? 12 : 24, -20],
  );

  return (
    <div
      className="container-scroll"
      ref={containerRef}
      data-testid="app-preview"
      data-contour-anchor="hero-panel"
      aria-label="Keystone macOS app preview"
    >
      <div className="container-scroll-perspective">
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Card = ({
  rotate,
  scale,
  translate,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        translateY: translate,
        boxShadow:
          "0 10px 24px color-mix(in oklab, var(--color-foreground) 12%, transparent), 0 44px 90px color-mix(in oklab, var(--color-foreground) 18%, transparent)",
      }}
      className="container-scroll-card"
    >
      <div className="container-scroll-content">
        {children}
      </div>
    </motion.div>
  );
};
