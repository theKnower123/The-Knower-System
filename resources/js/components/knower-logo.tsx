import React from "react";

interface KnowerLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function KnowerLogo({ className = "", showText = true, size = "md" }: KnowerLogoProps) {
  const iconSizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-lg",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Dynamic Glowing Logo Emblem */}
      <div
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 text-white font-black shadow-md shadow-blue-500/20 ring-1 ring-white/20 shrink-0 ${iconSizes[size]}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 drop-shadow-sm text-white"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-display font-extrabold tracking-tight text-foreground ${textSizes[size]}`}>
            Knower <span className="text-primary font-black">OS</span>
          </span>
          <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">
            Enterprise System
          </span>
        </div>
      )}
    </div>
  );
}
