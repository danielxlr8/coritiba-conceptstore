"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function FadeUp({
  children,
  className,
  delay = 0,
  yOffset = 50,
  duration = 1
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      { y: yOffset, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: duration,
        delay: delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, [delay, yOffset, duration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
