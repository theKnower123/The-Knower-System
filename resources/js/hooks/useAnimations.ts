import { useEffect, useRef, useState } from "react";

// ─── useCountUp ────────────────────────────────────────────────────────────
// Animates a number from 0 to the target value when element enters viewport.
export function useCountUp(target: number, duration = 1800, prefix = "", suffix = "") {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState("0");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        if (prefersReduced) {
          setDisplayed(String(target));
          return;
        }

        const start = performance.now();
        const isFloat = String(target).includes(".");
        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          const value = isFloat
            ? (eased * target).toFixed(1)
            : String(Math.round(eased * target));
          setDisplayed(value);
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, text: `${prefix}${displayed}${suffix}` };
}

// ─── useMagneticEffect ────────────────────────────────────────────────────
// Pulls an element slightly towards the cursor on hover.
export function useMagneticEffect<T extends HTMLElement>(strength = 0.25) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.transition = "transform 0.1s ease-out";
    };
    const onLeave = () => {
      el.style.transform = "translate(0,0)";
      el.style.transition = "transform 0.4s cubic-bezier(0.22,1,0.36,1)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return ref;
}

// ─── useParallax ─────────────────────────────────────────────────────────
// Translates an element at a fraction of the scroll offset.
export function useParallax<T extends HTMLElement>(factor = 0.15) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        el.style.transform = `translateY(${center * factor}px)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [factor]);

  return ref;
}

// ─── useTextScramble ──────────────────────────────────────────────────────
// Scrambles characters then resolves to the real text when element enters view.
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export function useTextScramble(text: string, duration = 900) {
  const [output, setOutput] = useState(text);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        if (prefersReduced) { setOutput(text); return; }

        const start = performance.now();
        const resolved = new Array(text.length).fill(false);
        const step = (now: number) => {
          const progress = (now - start) / duration;
          const chars = text.split("").map((ch, i) => {
            if (ch === " ") return " ";
            if (progress > i / text.length + 0.2) { resolved[i] = true; }
            if (resolved[i]) return ch;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          });
          setOutput(chars.join(""));
          if (progress < 1.2) requestAnimationFrame(step);
          else setOutput(text);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, duration]);

  return { ref, output };
}
