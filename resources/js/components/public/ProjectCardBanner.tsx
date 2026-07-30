import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectCardBannerProps {
  title: string;
  images?: string[];
}

export function ProjectCardBanner({ title, images = [] }: ProjectCardBannerProps) {
  const validImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (validImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [validImages.length]);

  const initials = title
    ? title
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 3)
    : "PRJ";

  if (validImages.length === 0) {
    return (
      <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border-b border-border">
        <span className="font-display text-4xl font-extrabold text-primary/40 tracking-wider">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-48 w-full overflow-hidden bg-black/90 group border-b border-border">
      <img
        src={validImages[currentIndex]}
        alt={`${title} screenshot ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-all duration-500 ease-in-out"
      />
      {validImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev + 1) % validImages.length);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {validImages.map((_, idx) => (
              <span
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full cursor-pointer transition-all ${
                  idx === currentIndex ? "w-5 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
