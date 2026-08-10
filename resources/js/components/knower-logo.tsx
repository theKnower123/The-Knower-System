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
      {/* Dynamic Brand Logo Emblem */}
      <div
        className={`relative flex items-center justify-center rounded-xl shrink-0 overflow-hidden ${iconSizes[size]}`}
      >
        <img
          src="/favicon.svg"
          alt="Knower OS Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-display font-extrabold tracking-tight text-foreground ${textSizes[size]}`}>
            Knower <span className="text-primary font-black">OS</span>
          </span>
          <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">
            ONE SYSTEM.ONE BUSSINESS
          </span>
        </div>
      )}
    </div>
  );
}
