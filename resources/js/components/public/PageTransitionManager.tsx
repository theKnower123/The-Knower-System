import { useTranslation } from "react-i18next";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Shield, Cpu, Zap, ArrowRight, Activity, Command, CheckCircle2 } from "lucide-react";

interface TransitionContextType {
  transitionTo: (to: string, label?: string) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<TransitionContextType>({
  transitionTo: () => {},
  isTransitioning: false,
});

export const usePageTransition = () => useContext(PageTransitionContext);

interface PageTransitionProviderProps {
  children: React.ReactNode;
}

export function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const [targetLabel, setTargetLabel] = useState<string>("SYSTEM MODULE");
  const [popups, setPopups] = useState<Array<{ id: number; text: string; subtext: string; icon: any; delay: number; x: number; y: number; scale: number }>>([]);

  // Trigger page transition with zoom-out, exploding pop-ups, and zoom-in
  const transitionTo = useCallback(
    (to: string, label?: string) => {
      if (to === location.pathname) return;

      const formattedLabel = label || to.replace("/", "").toUpperCase() || "HOME PROTOCOL";
      setTargetPath(to);
      setTargetLabel(formattedLabel);
      setIsTransitioning(true);

      // Generate randomized flying popups for transition
      const popupIcons = [Sparkles, Shield, Cpu, Zap, Activity, Command, CheckCircle2];
      const newPopups = [
        {
          id: 1,
          text: `LOADING MODULE`,
          subtext: `${formattedLabel} // PORTAL ACTIVE`,
          icon: popupIcons[0],
          delay: 0.05,
          x: -180,
          y: -120,
          scale: 1.1,
        },
        {
          id: 2,
          text: `SYSTEM CORE v4.8`,
          subtext: `SYNCHRONIZING ENGINE STATE`,
          icon: popupIcons[1],
          delay: 0.12,
          x: 200,
          y: -90,
          scale: 0.95,
        },
        {
          id: 3,
          text: `AI COPILOT READY`,
          subtext: `OPTIMIZING HYPER-NEURAL FLOW`,
          icon: popupIcons[2],
          delay: 0.18,
          x: -160,
          y: 130,
          scale: 1.05,
        },
        {
          id: 4,
          text: `ENTERPRISE SECURE`,
          subtext: `END-TO-END QUANTUM ENCRYPTION`,
          icon: popupIcons[3],
          delay: 0.22,
          x: 190,
          y: 140,
          scale: 1.0,
        },
      ];
      setPopups(newPopups);

      // Execute actual router navigation midway through transition
      setTimeout(() => {
        void navigate({ to: to as never });
      }, 420);

      // Finish transition after zoom-in sequence completes
      setTimeout(() => {
        setIsTransitioning(false);
        setTargetPath(null);
      }, 950);
    },
    [location.pathname, navigate]
  );

  return (
    <PageTransitionContext.Provider value={{ transitionTo, isTransitioning }}>
      <div className="relative overflow-x-hidden min-h-screen">
        {/* Main Content Page Container with 3D Zoom Camera FX */}
        <motion.div
          animate={
            isTransitioning
              ? {
                  scale: [1, 0.72, 0.72, 1.08, 1],
                  rotateX: [0, 10, -6, 0],
                  rotateY: [0, -12, 8, 0],
                  opacity: [1, 0.25, 0.25, 0.9, 1],
                  filter: ["blur(0px)", "blur(14px)", "blur(14px)", "blur(2px)", "blur(0px)"],
                }
              : {
                  scale: 1,
                  rotateX: 0,
                  rotateY: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                }
          }
          transition={{
            duration: 0.95,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={isTransitioning ? { transformPerspective: 1200, transformStyle: "preserve-3d" } : undefined}
          className="w-full origin-center"
        >
          {children}
        </motion.div>

        {/* Dynamic Transition Overlay & Flying Zoom Pop-ups Layer */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden backdrop-blur-md bg-background/60"
            >
              {/* Expanding Cyber Energy Shockwave Rings */}
              <motion.div
                initial={{ scale: 0, opacity: 0.9 }}
                animate={{ scale: [0, 2.5, 4], opacity: [0.9, 0.4, 0] }}
                transition={{ duration: 0.85, ease: "easeOut" }}
                className="absolute h-96 w-96 rounded-full border-2 border-primary/60 bg-gradient-to-r from-primary/30 via-accent/20 to-transparent blur-sm"
              />
              <motion.div
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: [0, 1.8, 3.2], opacity: [0.8, 0.3, 0] }}
                transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
                className="absolute h-[500px] w-[500px] rounded-full border border-accent/40 bg-accent/10 blur-md"
              />

              {/* Speed Lines Background FX */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,var(--color-primary)_1px,transparent_1px)] [background-size:24px_24px]" />

              {/* Flying Glass Pop-up Cards Exploding Zoom-Out & Zoom-In */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                {popups.map((popup) => {
                  const IconComponent = popup.icon;
                  return (
                    <motion.div
                      key={popup.id}
                      initial={{
                        scale: 0.1,
                        opacity: 0,
                        x: 0,
                        y: 0,
                        rotate: -15 + popup.id * 10,
                      }}
                      animate={{
                        scale: [0.1, popup.scale * 1.25, popup.scale],
                        opacity: [0, 1, 0.85, 0],
                        x: popup.x,
                        y: popup.y,
                        rotate: 0,
                      }}
                      transition={{
                        duration: 0.75,
                        delay: popup.delay,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="absolute flex items-center gap-3 rounded-2xl border border-primary/40 bg-card/90 px-4 py-3 shadow-2xl backdrop-blur-2xl text-foreground ring-1 ring-primary/20"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary shadow-inner">
                        <IconComponent className="h-5 w-5 animate-pulse" />
                      </div>
                      <div className="text-start">
                        <p className="text-xs font-bold uppercase tracking-wider text-primary">{popup.text}</p>
                        <p className="text-[10px] font-medium text-muted-foreground">{popup.subtext}</p>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Central Futuristic Destination Core Badge */}
                <motion.div
                  initial={{ scale: 0.3, opacity: 0, y: 30 }}
                  animate={{
                    scale: [0.3, 1.15, 1],
                    opacity: [0, 1, 1, 0],
                    y: [30, -10, 0],
                  }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center rounded-3xl border border-primary/50 bg-gradient-to-b from-card/95 via-card/85 to-background/95 p-8 shadow-[0_0_60px_rgba(120,80,255,0.4)] backdrop-blur-2xl text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary via-primary-glow to-accent p-0.5 shadow-lg"
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-background">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                  </motion.div>

                  <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">{t("auto.portal_transition", "PORTAL TRANSITION")}</span>

                  <h3 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    {targetLabel}
                  </h3>

                  <p className="mt-1 text-xs font-medium text-muted-foreground">{t("auto.initializing_spatial_canvas_dy", "Initializing spatial canvas & dynamic modules...")}</p>

                  <div className="mt-5 flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 0.75, ease: "easeInOut", repeat: Infinity }}
                        className="h-full w-full bg-gradient-to-r from-primary via-accent to-primary"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransitionContext.Provider>
  );
}

/** Specialized Transition Link Component to replace standard Link for public navbar & buttons */
export function TransitionLink({
  to,
  label,
  children,
  className,
  activeClassName,
  style,
  onClick,
}: {
  to: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const { transitionTo } = usePageTransition();
  const location = useLocation();
  const isActive = location.pathname === to;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) onClick(e);
    transitionTo(to, label);
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      style={style}
      className={`${className || ""} ${isActive && activeClassName ? activeClassName : ""}`}
    >
      {children}
    </a>
  );
}
