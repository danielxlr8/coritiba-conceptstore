/**
 * useHeroCTAAudio
 *  -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -� -�
 * Manages the "brilhar.mp3" audio triggered by the Hero CTA button click.
 *
 * Contract:
 *  - Single Audio object, created once, reused forever.
 *  - play() stops any running instance, resets currentTime, then plays.
 *  - Returned `triggerWithDelay` fires the original callback after 100�150 ms
 *    so the audio is always heard before any scroll/transition begins.
 *  - Visibility API: pause when tab is hidden (no reset).
 *  - No gain / volume manipulation  - respects the pre-mastered file.
 */

import { useEffect, useRef, useCallback } from "react";

const AUDIO_SRC = "/media/audio/hero-cta.mp3";
const ACTION_DELAY_MS = 120; // sweet spot between 100-150 ms

export function useHeroCtaAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create the Audio object once on mount (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio(AUDIO_SRC);
    audio.preload = "auto";
    audioRef.current = audio;

    // Pause (not reset) when user switches tabs
    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current) {
        audioRef.current.pause();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  /**
   * triggerWithDelay
   * Call this instead of the raw onClick handler on the CTA button.
   * It plays the audio immediately, then fires `callback` after ACTION_DELAY_MS.
   */
  const triggerWithDelay = useCallback((callback?: () => void) => {
    const audio = audioRef.current;

    if (audio) {
      // Stop any ongoing playback and reset to start
      audio.pause();
      audio.currentTime = 0;

      // Play  - browsers allow this because we are inside a user-gesture handler
      audio.play().catch(() => {
        // Autoplay blocked (very unlikely inside click): fail silently
      });
    }

    // Defer the original action so the sound is audibly "first"
    if (callback) {
      setTimeout(callback, ACTION_DELAY_MS);
    }
  }, []);

  return { triggerWithDelay };
}

