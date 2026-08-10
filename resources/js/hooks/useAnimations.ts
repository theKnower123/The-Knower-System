import { useEffect, useRef, useState } from "react";

// ─── useCountUp ────────────────────────────────────────────────────────────
// Animates a number from 0 to the target value when element enters viewport.
export function useCountUp(target: number, duration = 1600, prefix = "", suffix = "") {
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
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = isFloat
            ? (eased * target).toFixed(1)
            : String(Math.round(eased * target));
          setDisplayed(value);
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, text: `${prefix}${displayed}${suffix}` };
}

// ─── useMagneticEffect ────────────────────────────────────────────────────
// Pulls an element slightly towards the cursor on hover.
export function useMagneticEffect<T extends HTMLElement>(strength = 0.2) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let isHovered = false;
    let boundRect: DOMRect | null = null;

    const onEnter = () => {
      isHovered = true;
      boundRect = el.getBoundingClientRect();
    };

    const onMove = (e: MouseEvent) => {
      if (!isHovered || !boundRect) return;
      const cx = boundRect.left + boundRect.width / 2;
      const cy = boundRect.top + boundRect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      el.style.transition = "transform 0.1s ease-out";
    };

    const onLeave = () => {
      isHovered = false;
      boundRect = null;
      el.style.transform = "translate3d(0, 0, 0)";
      el.style.transition = "transform 0.3s cubic-bezier(0.22,1,0.36,1)";
    };

    el.addEventListener("mouseenter", onEnter, { passive: true });
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave, { passive: true });

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return ref;
}

// ─── useParallax ─────────────────────────────────────────────────────────
// Layout-read-free, hardware-accelerated parallax translation on scroll.
export function useParallax<T extends HTMLElement>(factor = 0.12) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let ticking = false;

    const update = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const offset = scrollY * factor;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [factor]);

  return ref;
}

// ─── useTextScramble ──────────────────────────────────────────────────────
// Scrambles characters then resolves to the real text when element enters view.
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export function useTextScramble(text: string, duration = 800) {
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
          if (progress < 1.1) requestAnimationFrame(step);
          else setOutput(text);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, duration]);

  return { ref, output };
}
