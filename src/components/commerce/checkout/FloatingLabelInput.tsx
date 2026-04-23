"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isValid?: boolean;
}

export function FloatingLabelInput({ 
  label, 
  error, 
  isValid, 
  className,
  value,
  onChange,
  ...props 
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || "");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Use uncontrolled internal value if there is no controlled 'value' prop
  const currentValue = value !== undefined ? value : internalValue;
  const hasValue = currentValue != null && currentValue !== "";

  useEffect(() => {
    if (value !== undefined) return;

    const syncAutofillValue = () => {
      const autofilledValue = inputRef.current?.value ?? "";
      if (autofilledValue) {
        setInternalValue(autofilledValue);
      }
    };

    syncAutofillValue();
    const frameId = requestAnimationFrame(syncAutofillValue);
    const timeoutId = window.setTimeout(syncAutofillValue, 250);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [value]);

  return (
    <div className={cn("relative w-full", className)}>
      <div 
        className={cn(
          "relative border rounded-[4px] bg-[#111] transition-all duration-300 flex items-center pr-4",
          focused 
            ? "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/20" 
            : error 
              ? "border-red-500" 
              : "border-white/10 hover:border-white/20"
        )}
      >
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            {...props}
            value={value}
            onChange={(e) => {
              setInternalValue(e.target.value);
              onChange?.(e);
            }}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            onAnimationStart={(e) => {
              if (value !== undefined) return;
              if (e.animationName === "checkout-autofill-start") {
                setInternalValue(inputRef.current?.value ?? "");
              }
            }}
            className="checkout-input w-full bg-transparent h-14 px-4 pt-4 pb-1 text-white outline-none placeholder-transparent"
            placeholder={label} // Required for sibling pseudo-class tricks if we used CSS-only, but here we do React state
          />
          <div className="absolute inset-y-0 left-4 flex flex-col justify-center pointer-events-none">
            <div className="flex">
              {label.split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={false}
                  animate={{
                    y: focused || hasValue ? -14 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    delay: index * 0.02,
                  }}
                  className={cn(
                    "inline-block transition-all duration-300",
                    focused || hasValue
                      ? "text-[10px] sm:text-xs uppercase tracking-wider font-bold"
                      : "text-sm font-medium"
                  )}
                  style={{
                    color:
                      focused && !error
                        ? "var(--color-primary)"
                        : error
                        ? "#ef4444"
                        : "rgba(255,255,255,0.4)",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
        
        {/* VALIDATION INDICATOR */}
        {isValid && !focused && !error && (
          <Check size={18} className="text-[var(--color-primary)] shrink-0" />
        )}
      </div>
      
      {/* ERROR MESSAGE */}
      {error && (
        <p className="absolute -bottom-5 left-0 text-[10px] text-red-500 font-medium tracking-wide uppercase">
          {error}
        </p>
      )}
    </div>
  );
}

