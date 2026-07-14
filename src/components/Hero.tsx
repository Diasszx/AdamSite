import React, { useState, useEffect } from "react";
import { ArrowRight, Globe } from "lucide-react";

const WORDS = ["SOLUÇÕES", "VALOR", "EXPERIÊNCIAS", "RESULTADOS", "INOVAÇÃO"];
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZÃÕÇÉÊÁ";
const DESCRIPTION_TEXT =
  "Sou Adam, desenvolvedor Full Stack que cria aplicações modernas, eficientes e intuitivas, transformando ideias em soluções digitais de alto impacto.";

export const Hero: React.FC = () => {
  const [currentWord, setCurrentWord] = useState(WORDS[0]);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    if (textIndex < DESCRIPTION_TEXT.length) {
      const timer = setTimeout(() => {
        setTextIndex((prev) => prev + 1);
      }, 3); // 8ms typing speed - faster
      return () => clearTimeout(timer);
    }
  }, [textIndex]);

  useEffect(() => {
    let wordIndex = 0;

    const interval = setInterval(() => {
      wordIndex = (wordIndex + 1) % WORDS.length;
      const targetWord = WORDS[wordIndex];

      let iteration = 0;
      let intervalId: any = null;

      intervalId = setInterval(() => {
        const scrambled = targetWord
          .split("")
          .map((_, index) => {
            if (index < Math.floor(iteration)) {
              return targetWord[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("");

        setCurrentWord(scrambled);

        if (iteration >= targetWord.length) {
          clearInterval(intervalId);
        }

        iteration += 0.35; // Controls the speed of letter locking (reveal speed)
      }, 30);
    }, 3200); // Rotate word every 3.2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex-1 w-full relative flex flex-col justify-between px-6 md:px-12 py-8 md:py-16 overflow-hidden">
      {/* Central Portrait of the young man */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-full h-full sm:w-[70%] md:w-[55%] lg:w-[45%] max-w-none md:max-w-[580px] sm:h-[80%] md:h-[90%] z-0 flex items-end justify-center select-none overflow-hidden group/portrait pointer-events-auto opacity-30 md:opacity-95 transition-opacity duration-500">
        <img
          src="/young_man_portrait.png"
          alt="ADAM Portrait"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.06] cursor-pointer grayscale filter contrast-[1.10] brightness-[0.95]"
        />
        {/* Subtle overlay gradient to blend bottom edge */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
      </div>

      {/* Main Content Layout (Flex Grid) */}
      <div className="w-full flex-1 grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-0 relative z-10 pointer-events-none">
        {/* Left Side Content */}
        <div className="flex flex-col justify-center items-start text-left pointer-events-none select-none mt-10 md:mt-0">
          {/* Header Title */}
          <div className="flex flex-col leading-none">
            <h1 className="font-display text-[8vw] md:text-[4.5rem] lg:text-[5.4rem] text-stroke tracking-normal uppercase leading-none">
              CONSTRUINDO
            </h1>
            <h1 className="font-display text-[10vw] md:text-[5.8rem] lg:text-[7.2rem] text-blue-400 tracking-tighter uppercase leading-none mt-2 md:mt-4 min-h-[1.1em]">
              {currentWord}
            </h1>
          </div>

          {/* Subtitle & Action */}
          <div className="mt-8 md:mt-16 flex flex-col items-start gap-4">
            <div className="flex items-center gap-2 text-blue-400 font-bold tracking-widest text-[10px] md:text-xs">
              {/* Custom diamond star */}
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 fill-current animate-pulse"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
              </svg>
              <span>DESENVOLVEDOR FRONT-END</span>
            </div>

            <button
              onClick={() => {
                const element = document.getElementById("projects");
                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }
              }}
              className="bg-white text-black font-extrabold text-xs md:text-sm tracking-wider px-6 py-3 rounded-full flex items-center gap-2 group transition-all duration-300 hover:bg-blue-400 hover:shadow-[0_0_15px_rgba(204,255,0,0.5)] active:scale-95 pointer-events-auto cursor-pointer"
            >
              <span>CONHECER PROJETOS</span>
              <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center text-white transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight
                  className="w-2.5 h-2.5 group-hover:text-blue-400 transition-colors duration-300"
                  strokeWidth={3}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="flex flex-col justify-center items-start text-left md:justify-end md:items-end md:text-right pointer-events-none md:h-full md:pb-24 mt-6 md:mt-0">
          <div className="max-w-xs md:max-w-sm flex flex-col items-start md:items-end gap-4 md:gap-6 mt-0 md:mt-auto">
            <p className="font-mono text-zinc-300 md:text-zinc-400 text-xs md:text-sm leading-relaxed tracking-wider min-h-[5.5rem] md:min-h-[4.5rem]">
              {DESCRIPTION_TEXT.slice(0, textIndex)}
              <span className="text-blue-400 font-bold animate-blink ml-0.5">
                |
              </span>
            </p>

            <div className="flex items-center gap-2 text-blue-400 font-bold tracking-widest text-[10px] md:text-xs hover:text-white transition-colors duration-300 cursor-pointer group pointer-events-auto">
              <span className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400 group-hover:bg-blue-400 group-hover:text-black transition-colors duration-300">
                <Globe className="w-3 h-3" />
              </span>
              <span>JOÃO PESSOA • BRASIL</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
