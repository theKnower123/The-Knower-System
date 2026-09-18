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
    from: { opacity: 0, transform: "translate3d(0, 24px, 0)" },
    to: { opacity: 1, transform: "translate3d(0, 0, 0)" },
  },
  "fade-down": {
    from: { opacity: 0, transform: "translate3d(0, -24px, 0)" },
    to: { opacity: 1, transform: "translate3d(0, 0, 0)" },
  },
  "fade-left": {
    from: { opacity: 0, transform: "translate3d(24px, 0, 0)" },
    to: { opacity: 1, transform: "translate3d(0, 0, 0)" },
  },
  "fade-right": {
    from: { opacity: 0, transform: "translate3d(-24px, 0, 0)" },
    to: { opacity: 1, transform: "translate3d(0, 0, 0)" },
  },
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  scale: {
    from: { opacity: 0, transform: "scale3d(0.94, 0.94, 1)" },
    to: { opacity: 1, transform: "scale3d(1, 1, 1)" },
  },
  "scale-x": {
    from: { opacity: 0, transform: "scaleX(0.85)" },
    to: { opacity: 1, transform: "scaleX(1)" },
  },
  "blur-up": {
    from: { opacity: 0, transform: "translate3d(0, 20px, 0)" },
    to: { opacity: 1, transform: "translate3d(0, 0, 0)" },
  },
};

export function ScrollReveal({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  duration = 500,
  threshold = 0.05,
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

    // Set initial hardware-accelerated style
    Object.assign(el.style, {
      ...VARIANTS[variant].from,
      transition: `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      willChange: "opacity, transform",
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            Object.assign(el.style, VARIANTS[variant].to);
            if (once) {
              observer.unobserve(el);
              // Clean up will-change after transition finishes
              setTimeout(() => {
                if (el) {
                  el.style.willChange = "auto";
                }
              }, duration + delay + 50);
            }
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
  stagger = 60,
  variant = "fade-up",
  duration = 450,
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
        transition: `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${i * stagger}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${i * stagger}ms`,
        willChange: "opacity, transform",
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          items.forEach((item, i) => {
            Object.assign(item.style, VARIANTS[variant].to);
            setTimeout(() => {
              if (item) item.style.willChange = "auto";
            }, duration + i * stagger + 50);
          });
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
