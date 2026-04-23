"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export function ParallaxImage({
  src,
  alt,
  className,
  speed = 1
}: {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current) return;

    gsap.to(imageRef.current, {
      y: () => window.innerHeight * speed * 0.1,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }, [speed]);

  return (
    <div ref={containerRef} className={`overflow-hidden relative ${className || ""}`}>
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        fill
        className="object-cover scale-[1.2] origin-center will-change-transform"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />
    </div>
  );
}
