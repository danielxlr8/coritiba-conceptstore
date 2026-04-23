import { RefObject, useCallback, useEffect, useRef } from "react";

const AUDIO_SRC = "/media/audio/brand-story-scrub.mp3";
const VELOCITY_THRESHOLD = 2;
const INERTIA_WINDOW_MS = 220;
const FADE_IN_STEP = 0.08;
const FADE_OUT_STEP = 0.04;

const SCROLL_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "End",
  "Home",
  " ",
]);

function isTouchOnlyDevice(): boolean {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(pointer: coarse)").matches &&
    !window.matchMedia("(pointer: fine)").matches
  );
}

export function useScrubAudio(sectionRef: RefObject<HTMLElement | null>) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastScrollTimeRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const isPlayingRef = useRef(false);
  const isPlayPendingRef = useRef(false);
  const isUnlockedRef = useRef(false);
  const inSectionRef = useRef(false);
  const disabledRef = useRef(false);

  const startLoop = useCallback((tick: FrameRequestCallback) => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(tick);
  }, []);

  const stopLoop = useCallback(() => {
    if (rafIdRef.current === null) return;
    cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = null;
  }, []);

  const stampScroll = useCallback(() => {
    if (disabledRef.current || !inSectionRef.current) return;
    lastScrollTimeRef.current = Date.now();
  }, []);

  const attemptPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || isPlayingRef.current || isPlayPendingRef.current) return;

    const playResult = audio.play();

    if (!playResult || typeof playResult.then !== "function") {
      isPlayingRef.current = true;
      isPlayPendingRef.current = false;
      return;
    }

    isPlayPendingRef.current = true;

    playResult
      .then(() => {
        isPlayingRef.current = true;
      })
      .catch(() => {
        isPlayingRef.current = false;
      })
      .finally(() => {
        isPlayPendingRef.current = false;
      });
  }, []);

  const unlockAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || isUnlockedRef.current) return;

    const playResult = audio.play();

    if (!playResult || typeof playResult.then !== "function") {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0;
      isUnlockedRef.current = true;
      isPlayingRef.current = false;
      return;
    }

    playResult
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
        isUnlockedRef.current = true;
        isPlayingRef.current = false;
      })
      .catch(() => {
        isUnlockedRef.current = false;
        isPlayingRef.current = false;
      });
  }, []);

  const tick = useCallback(() => {
    const audio = audioRef.current;

    if (audio && inSectionRef.current) {
      const scrollActive =
        Date.now() - lastScrollTimeRef.current < INERTIA_WINDOW_MS;

      if (scrollActive) {
        attemptPlay();

        if (isPlayingRef.current && audio.volume < 1) {
          audio.volume = Math.min(1, audio.volume + FADE_IN_STEP);
        }
      } else if (isPlayingRef.current) {
        if (audio.volume > 0) {
          audio.volume = Math.max(0, audio.volume - FADE_OUT_STEP);
        } else {
          audio.pause();
          isPlayingRef.current = false;
        }
      }
    }

    if (rafIdRef.current !== null) {
      rafIdRef.current = requestAnimationFrame(tick);
    }
  }, [attemptPlay]);

  const ensureLoop = useCallback(() => {
    startLoop(tick);
  }, [startLoop, tick]);

  const resetAudio = useCallback(() => {
    const audio = audioRef.current;

    stopLoop();

    if (audio) {
      audio.pause();
      audio.volume = 0;
      audio.currentTime = 0;
    }

    isPlayingRef.current = false;
    isPlayPendingRef.current = false;
    lastScrollTimeRef.current = 0;
  }, [stopLoop]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isTouchOnlyDevice()) {
      disabledRef.current = true;
      return;
    }

    const audio = new Audio(AUDIO_SRC);
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;
    lastScrollYRef.current = window.scrollY;

    return () => {
      stopLoop();
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [stopLoop]);

  useEffect(() => {
    if (typeof window === "undefined" || disabledRef.current) return;

    const handleFirstGesture = () => {
      unlockAudio();
    };

    window.addEventListener("pointerdown", handleFirstGesture, { passive: true });
    window.addEventListener("keydown", handleFirstGesture, { passive: true });
    window.addEventListener("wheel", handleFirstGesture, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      window.removeEventListener("wheel", handleFirstGesture);
    };
  }, [unlockAudio]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onVisibility = () => {
      const audio = audioRef.current;

      if (document.hidden) {
        if (audio) {
          audio.pause();
          audio.volume = 0;
        }

        isPlayingRef.current = false;
        isPlayPendingRef.current = false;
        stopLoop();
        return;
      }

      if (inSectionRef.current) {
        lastScrollYRef.current = window.scrollY;
        ensureLoop();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [ensureLoop, stopLoop]);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (disabledRef.current || !inSectionRef.current) return;
      if (Math.abs(event.deltaY) < VELOCITY_THRESHOLD) return;

      attemptPlay();
      stampScroll();
      ensureLoop();
    },
    [attemptPlay, ensureLoop, stampScroll],
  );

  const handleScroll = useCallback(() => {
    if (disabledRef.current || !inSectionRef.current) return;

    const nextScrollY = window.scrollY;
    if (Math.abs(nextScrollY - lastScrollYRef.current) < 1) return;

    lastScrollYRef.current = nextScrollY;
    stampScroll();
    ensureLoop();
  }, [ensureLoop, stampScroll]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!SCROLL_KEYS.has(event.key)) return;

      attemptPlay();
      stampScroll();
      ensureLoop();
    },
    [attemptPlay, ensureLoop, stampScroll],
  );

  useEffect(() => {
    if (disabledRef.current) return;

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, handleScroll, handleWheel]);

  useEffect(() => {
    if (disabledRef.current) return;

    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasInSection = inSectionRef.current;
        inSectionRef.current = entry.isIntersecting;

        if (entry.isIntersecting && !wasInSection) {
          lastScrollYRef.current = window.scrollY;
          ensureLoop();
        } else if (!entry.isIntersecting && wasInSection) {
          resetAudio();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      stopLoop();
    };
  }, [ensureLoop, resetAudio, sectionRef, stopLoop]);
}
