"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface MagneticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  magnetic?: boolean;
}

export function MagneticButton({ 
  children, 
  variant = "primary", 
  magnetic = true,
  className, 
  ...props 
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!magnetic || !buttonRef.current || !textRef.current) return;

    const btn = buttonRef.current;
    const text = textRef.current;

    const onMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = btn.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) * 0.3;
      const y = (e.clientY - top - height / 2) * 0.3;

      gsap.to(btn, { x, y, duration: 0.6, ease: "power3.out" });
      gsap.to(text, { x: x * 0.5, y: y * 0.5, duration: 0.6, ease: "power3.out" });
    };

    const onMouseLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
      gsap.to(text, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
    };

    btn.addEventListener("mousemove", onMouseMove);
    btn.addEventListener("mouseleave", onMouseLeave);

    return () => {
      btn.removeEventListener("mousemove", onMouseMove);
      btn.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [magnetic]);

  const baseClasses = "relative inline-flex items-center justify-center overflow-hidden rounded-full font-sans font-semibold text-sm transition-all duration-300 ease-[var(--ease-premium)] px-8 py-4 will-change-transform";
  
  const variants = {
    primary: "bg-[var(--color-primary)] text-black hover:bg-white hover:scale-105",
    secondary: "bg-white text-black hover:bg-[var(--color-primary)] hover:scale-105",
    outline: "border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black",
  };

  return (
    <button 
      ref={buttonRef} 
      className={cn(baseClasses, variants[variant], className)}
      {...props}
    >
      <span ref={textRef} className="relative z-10 pointer-events-none tracking-wide uppercase">
        {children}
      </span>
    </button>
  );
}
