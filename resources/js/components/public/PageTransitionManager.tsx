import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";

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
  const navigate = useNavigate();
  const location = useLocation();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  // Smooth, instant navigation with a high-performance top progress indicator
  const transitionTo = useCallback(
    (to: string, _label?: string) => {
      if (to === location.pathname) return;

      setIsTransitioning(true);
      setProgress(35);

      // Execute router navigation immediately
      void navigate({ to: to as never });

      // Animate progress bar completion smoothly
      const t1 = setTimeout(() => setProgress(85), 60);
      const t2 = setTimeout(() => {
        setProgress(100);
        const t3 = setTimeout(() => {
          setIsTransitioning(false);
          setProgress(0);
        }, 180);
        return () => clearTimeout(t3);
      }, 150);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    },
    [location.pathname, navigate]
  );

  // Complete progress bar whenever route changes
  useEffect(() => {
    if (isTransitioning) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setProgress(0);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <PageTransitionContext.Provider value={{ transitionTo, isTransitioning }}>
      {/* Sleek, high-performance top loading progress bar */}
      <div
        className="fixed top-0 left-0 right-0 z-[9999] h-[2.5px] pointer-events-none transition-opacity duration-200"
        style={{ opacity: isTransitioning ? 1 : 0 }}
      >
        <div
          className="h-full bg-gradient-to-r from-primary via-primary-glow to-accent shadow-[0_0_8px_var(--color-primary)] transition-all ease-out"
          style={{
            width: `${progress}%`,
            transitionDuration: progress === 100 ? "150ms" : "250ms",
          }}
        />
      </div>

      {/* Main Content Container with clean, hardware-accelerated rendering */}
      <div className="w-full relative min-h-screen">
        {children}
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
    // Only intercept regular left-clicks without modifier keys
    if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      if (onClick) onClick(e);
      transitionTo(to, label);
    }
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
