import React, { useEffect, useRef } from "react";

interface ParticleFieldProps {
  scrollProgress: number; // 0 to 1
  scrollVelocity: number;
  isDark: boolean;
  activeStage: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  pz: number;
  size: number;
  colorType: number;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export function CinematicParticleField({
  scrollProgress,
  scrollVelocity,
  isDark,
  activeStage,
  className = "",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Initialize 3D Warp Field Particles
    const PARTICLE_COUNT = Math.min(180, Math.floor(window.innerWidth / 10));
    const particles: Particle[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * 1000 + 1,
        pz: 1000,
        size: Math.random() * 2.2 + 0.6,
        colorType: Math.floor(Math.random() * 4),
        alpha: Math.random() * 0.7 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current.targetX = (e.clientX - width / 2) * 0.08;
      mousePosRef.current.targetY = (e.clientY - height / 2) * 0.08;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth mouse lerp
      mousePosRef.current.x += (mousePosRef.current.targetX - mousePosRef.current.x) * 0.05;
      mousePosRef.current.y += (mousePosRef.current.targetY - mousePosRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2 + mousePosRef.current.x;
      const cy = height / 2 + mousePosRef.current.y;

      // Base speed plus scroll velocity boost for warp-drive effect
      const speed = 120 + Math.abs(scrollVelocity) * 1400 + (activeStage === 2 ? 260 : 0);

      // Color paletting based on current active stage & theme
      const palette = isDark
        ? [
            "rgba(147, 112, 219, ", // Purple/Violet
            "rgba(99, 179, 237, ",  // Cyber Blue
            "rgba(246, 173, 85, ",  // Gold Accent
            "rgba(129, 230, 217, ", // Neon Cyan
          ]
        : [
            "rgba(107, 70, 193, ",
            "rgba(49, 130, 206, ",
            "rgba(221, 107, 32, ",
            "rgba(49, 151, 149, ",
          ];

      const parts = particlesRef.current;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];

        p.pz = p.z;
        p.z -= speed * delta;
        p.pulsePhase += p.pulseSpeed;

        // Reset particle if it flies past the camera
        if (p.z <= 1) {
          p.z = 1000;
          p.pz = 1000;
          p.x = (Math.random() - 0.5) * width * 2;
          p.y = (Math.random() - 0.5) * height * 2;
        }

        // 3D Perspective Projection
        const fov = 450;
        const sx = (p.x / p.z) * fov + cx;
        const sy = (p.y / p.z) * fov + cy;

        const psx = (p.x / p.pz) * fov + cx;
        const psy = (p.y / p.pz) * fov + cy;

        // Ensure inside bounds
        if (sx < -100 || sx > width + 100 || sy < -100 || sy > height + 100) {
          continue;
        }

        const depthRatio = 1 - p.z / 1000;
        const pulsate = Math.sin(p.pulsePhase) * 0.25 + 0.75;
        const currentAlpha = Math.min(1, p.alpha * depthRatio * pulsate * (isDark ? 0.9 : 0.6));
        const currentSize = Math.max(0.5, p.size * (1 + depthRatio * 1.5));

        const baseColor = palette[p.colorType];

        // Draw light streak when scrolling fast
        if (Math.abs(scrollVelocity) > 0.05 || activeStage === 2) {
          ctx.beginPath();
          ctx.moveTo(psx, psy);
          ctx.lineTo(sx, sy);
          ctx.strokeStyle = `${baseColor}${currentAlpha * 0.8})`;
          ctx.lineWidth = currentSize;
          ctx.stroke();
        } else {
          // Standard luminous particle point with glow halo
          ctx.beginPath();
          ctx.arc(sx, sy, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = `${baseColor}${currentAlpha})`;
          ctx.fill();

          if (depthRatio > 0.6) {
            ctx.beginPath();
            ctx.arc(sx, sy, currentSize * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = `${baseColor}${currentAlpha * 0.25})`;
            ctx.fill();
          }
        }
      }

      // Draw subtle horizon grid lines for depth
      const gridAlpha = (isDark ? 0.06 : 0.03) * (1 - scrollProgress * 0.5);
      if (gridAlpha > 0.005) {
        ctx.strokeStyle = isDark ? `rgba(160, 140, 255, ${gridAlpha})` : `rgba(80, 60, 180, ${gridAlpha})`;
        ctx.lineWidth = 1;

        const horizonY = height * 0.78;
        const lineCount = 14;

        for (let i = 0; i < lineCount; i++) {
          const y = horizonY + Math.pow(i / lineCount, 2) * (height - horizonY);
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Perspective vanishing lines converging to center horizon
        const vCount = 18;
        for (let i = 0; i <= vCount; i++) {
          const x = (width / vCount) * i;
          ctx.beginPath();
          ctx.moveTo(cx, horizonY);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDark, activeStage, scrollProgress, scrollVelocity]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full ${className}`}
    />
  );
}
