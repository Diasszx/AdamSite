import React, { useEffect, useState } from "react";

const BRANDS = [
  "REACT",
  "TypeScript",
  "JavaScript",
  "NODE.JS",
  "TAILWIND",
  "GITHUB",
  "GIT",
  "REACT",
  "TypeScript",
  "JavaScript",
  "NODE.JS",
  "TAILWIND",
  "GITHUB",
  "GIT",
];

export const FooterTicker: React.FC = () => {
  const [utcTime, setUtcTime] = useState<string>("JOÃO PESSOA 00:00:00");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("pt-BR", {
        timeZone: "America/Fortaleza",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setUtcTime(`JOÃO PESSOA ${timeString}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="w-full bg-black/80 border-t border-zinc-900 py-4 px-6 md:px-12 flex items-center justify-between text-[10px] md:text-xs font-mono tracking-widest text-zinc-500 select-none relative z-10">
      {/* UTC Clock */}
      <div className="flex-shrink-0 text-left text-zinc-400 font-medium text-[10px] sm:text-xs">
        {utcTime}
      </div>

      {/* Marquee Center */}
      <div className="hidden sm:block flex-1 overflow-hidden mx-4 md:mx-10 relative mask-gradient">
        {/* Fading borders for ticker overlay */}
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <div className="flex gap-12 md:gap-16 whitespace-nowrap animate-marquee hover:[animation-play-state:paused] cursor-pointer">
          {BRANDS.map((brand, idx) => (
            <span
              key={idx}
              className="font-display text-sm md:text-base text-zinc-600 hover:text-white transition-colors duration-300"
            >
              {brand}
            </span>
          ))}
          {/* Duplicate loop for continuous seamless scroll */}
          {BRANDS.map((brand, idx) => (
            <span
              key={`dup-${idx}`}
              className="font-display text-sm md:text-base text-zinc-600 hover:text-white transition-colors duration-300"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* Studio Active Status */}
      <div className="flex-shrink-0 flex items-center gap-2 text-right">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#CCFF00]" />
        <span className="text-[10px] md:text-xs text-zinc-400 font-bold tracking-wider">
          DISPONÍVEL
        </span>
      </div>
    </footer>
  );
};
