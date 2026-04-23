"use client";

import { useLayoutEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  type = "fade", // 'fade', 'clip', 'scale'
  ...props
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  type?: "fade" | "clip" | "scale";
} & HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    const ctx = gsap.context(() => {
      const fromState: gsap.TweenVars = {};
      const toState: gsap.TweenVars = {
        duration: 1.6,
        delay,
        ease: "power4.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      };

      const distance = 80;

      if (direction === "up") fromState.y = distance;
      if (direction === "down") fromState.y = -distance;
      if (direction === "left") fromState.x = distance;
      if (direction === "right") fromState.x = -distance;

      if (type === "fade") {
        fromState.opacity = 0;
        toState.opacity = 1;
        toState.x = 0;
        toState.y = 0;
      } else if (type === "clip") {
        fromState.clipPath = "inset(100% 0% 0% 0%)";
        toState.clipPath = "inset(0% 0% 0% 0%)";
        toState.y = 0;
      } else if (type === "scale") {
        fromState.scale = 0.8;
        fromState.opacity = 0;
        toState.scale = 1;
        toState.opacity = 1;
        toState.y = 0;
        toState.ease = "back.out(1.2)";
      }

      gsap.set(el, { clearProps: "all" });
      gsap.fromTo(el, fromState, toState);
    }, ref);

    const refreshId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(refreshId);
      ctx.revert();
      gsap.set(el, { clearProps: "all" });
    };
  }, [children, delay, direction, type]);

  return (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  );
}
