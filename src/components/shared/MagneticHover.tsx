"use client";

import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";

interface MagneticHoverProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticHover({
  children,
  strength = 0.25,
  className,
}: MagneticHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch devices  prevent battery drain on mobile
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

    const el = containerRef.current;
    if (!el) return;

    const onMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) * strength;
      const y = (e.clientY - top - height / 2) * strength;
      gsap.to(el, { x, y, duration: 0.5, ease: "power3.out" });
    };

    const onMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [strength]);

  return (
    <div ref={containerRef} className={className} style={{ display: "inline-block" }}>
      {children}
    </div>
  );
}
