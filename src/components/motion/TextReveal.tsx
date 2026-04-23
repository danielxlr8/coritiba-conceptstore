"use client";

import { type ElementType, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function TextReveal({ 
  children, 
  as: Component = "h2", 
  className, 
  delay = 0 
}: { 
  children: React.ReactNode; 
  as?: ElementType; 
  className?: string;
  delay?: number;
}) {
  const textRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!textRef.current) return;

    const element = textRef.current;

    const ctx = gsap.context(() => {
      const text = new SplitType(element, { types: "lines,words" });

      gsap.fromTo(
        text.words,
        {
          yPercent: 110,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.4,
          stagger: 0.04,
          ease: "power4.out",
          delay,
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        },
      );

      return () => {
        text.revert();
      };
    }, textRef);

    const refreshId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(refreshId);
      ctx.revert();
    };
  }, [delay, children]);

  // Use overflow-hidden to clip the words as they animate up
  return (
    <Component ref={textRef} className={cn("overflow-hidden", className)}>
      {children}
    </Component>
  );
}
