import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "fade"
  | "scale"
  | "scale-x"
  | "blur-up";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  delay?: number; // ms
  duration?: number; // ms
  threshold?: number;
  once?: boolean;
}

const VARIANTS: Record<Variant, { from: CSSProperties; to: CSSProperties }> = {
  "fade-up": {
    from: { opacity: 0, transform: "translateY(32px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "fade-down": {
    from: { opacity: 0, transform: "translateY(-32px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "fade-left": {
    from: { opacity: 0, transform: "translateX(32px)" },
    to: { opacity: 1, transform: "translateX(0)" },
  },
  "fade-right": {
    from: { opacity: 0, transform: "translateX(-32px)" },
    to: { opacity: 1, transform: "translateX(0)" },
  },
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  scale: {
    from: { opacity: 0, transform: "scale(0.9)" },
    to: { opacity: 1, transform: "scale(1)" },
  },
  "scale-x": {
    from: { opacity: 0, transform: "scaleX(0.8)" },
    to: { opacity: 1, transform: "scaleX(1)" },
  },
  "blur-up": {
    from: { opacity: 0, transform: "translateY(24px)", filter: "blur(8px)" },
    to: { opacity: 1, transform: "translateY(0)", filter: "blur(0)" },
  },
};

export function ScrollReveal({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      Object.assign(el.style, VARIANTS[variant].to);
      return;
    }

    // Set initial state
    Object.assign(el.style, {
      ...VARIANTS[variant].from,
      transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, filter ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            Object.assign(el.style, VARIANTS[variant].to);
            if (once) observer.unobserve(el);
          } else if (!once) {
            Object.assign(el.style, VARIANTS[variant].from);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [variant, delay, duration, threshold, once]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}

/** Stagger a group of children using nth-child delays */
export function StaggerReveal({
  children,
  className,
  stagger = 80,
  variant = "fade-up",
  duration = 550,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  variant?: Variant;
  duration?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = Array.from(container.children) as HTMLElement[];

    if (prefersReduced) {
      items.forEach((item) => Object.assign(item.style, VARIANTS[variant].to));
      return;
    }

    items.forEach((item, i) => {
      Object.assign(item.style, {
        ...VARIANTS[variant].from,
        transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${i * stagger}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${i * stagger}ms, filter ${duration}ms cubic-bezier(0.22,1,0.36,1) ${i * stagger}ms`,
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          items.forEach((item) => Object.assign(item.style, VARIANTS[variant].to));
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [stagger, variant, duration]);

  return (
    <div ref={containerRef} className={cn(className)}>
      {children}
    </div>
  );
}
