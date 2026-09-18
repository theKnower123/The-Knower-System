import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  fadeDir: number;
}

interface ParticleCanvasProps {
  count?: number;
  color?: string;
  className?: string;
}

export function ParticleCanvas({ count = 28, color = "180,160,255", className }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let rafId: number;
    let particles: Particle[] = [];
    let isVisible = true;
    let isFastScrolling = false;
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const isMobile = window.innerWidth < 768;
    const effectiveCount = Math.min(count, isMobile ? 14 : 32);
    const maxDistSq = 75 * 75; // 5625 (squared distance, avoiding Math.sqrt)

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const initParticles = () => {
      particles = Array.from({ length: effectiveCount }, () => ({
        x: Math.random() * (canvas.width || window.innerWidth),
        y: Math.random() * (canvas.height || window.innerHeight),
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.2 + 0.6,
        opacity: Math.random() * 0.4 + 0.15,
        fadeDir: Math.random() > 0.5 ? 1 : -1,
      }));
    };

    const draw = () => {
      if (!isVisible) return;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // 1. Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.opacity += p.fadeDir * 0.002;
        if (p.opacity > 0.55 || p.opacity < 0.1) p.fadeDir *= -1;

        if (p.x < 0) p.x = w;
        else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        else if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.opacity})`;
        ctx.fill();
      }

      // 2. Draw connecting lines (batched into a single draw call, skipped during fast scroll)
      if (!isFastScrolling && particles.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${color},0.05)`;
        ctx.lineWidth = 0.6;

        for (let i = 0; i < particles.length; i++) {
          const pi = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const pj = particles[j];
            const dx = pi.x - pj.x;
            const dy = pi.y - pj.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < maxDistSq) {
              ctx.moveTo(pi.x, pi.y);
              ctx.lineTo(pj.x, pj.y);
            }
          }
        }
        ctx.stroke();
      }

      rafId = requestAnimationFrame(draw);
    };

    // Handle scroll performance optimization
    const onScroll = () => {
      isFastScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isFastScrolling = false;
      }, 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Handle tab visibility
    const onVisibilityChange = () => {
      if (document.hidden) {
        isVisible = false;
        cancelAnimationFrame(rafId);
      } else {
        isVisible = true;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Observe canvas visibility
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          isVisible = true;
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(draw);
        } else {
          isVisible = false;
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const ro = new ResizeObserver(() => {
      resize();
      initParticles();
    });
    ro.observe(canvas);

    resize();
    initParticles();
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observer.disconnect();
      ro.disconnect();
    };
  }, [count, color]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
