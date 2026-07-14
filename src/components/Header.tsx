import React from "react";
import { ArrowUpRight } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="w-full flex items-center justify-between px-6 md:px-12 py-6 relative z-10 select-none">
      {/* Logo */}
      <div className="flex items-center gap-3 group cursor-pointer">
        {/* Customized Logo Icon (Lime circle with 4-pointed star) */}
        <div className="w-9 h-9 rounded-full bg-blue-400 flex items-center justify-center transition-transform duration-500 group-hover:rotate-180">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-black fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
          </svg>
        </div>
        <span className="font-display text-2xl tracking-wider text-white transition-colors duration-300 group-hover:text-blue-400">
          ADAM
        </span>
      </div>

      {/* Navigation Menu */}
      <nav className="hidden md:flex items-center gap-10 font-bold text-sm tracking-widest text-zinc-400">
        <a
          href="#projects"
          className="transition-all duration-300 hover:text-white relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full"
        >
          PROJETOS
        </a>
        <a
          href="#experience"
          className="transition-all duration-300 hover:text-white relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full"
        >
          EXPERIÊNCIA
        </a>
        <a
          href="#contact"
          className="transition-all duration-300 hover:text-white relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full"
        >
          CONTATO
        </a>
      </nav>

      {/* LET'S WORK Button */}
      <button className="bg-blue-400 text-black font-extrabold text-xs md:text-sm tracking-wider px-5 py-2 md:px-6 md:py-2.5 rounded-full flex items-center gap-2 group transition-all duration-300 hover:bg-white hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] active:scale-95">
        <span>VAMOS COMEÇAR</span>
        <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-blue-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
          <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={3} />
        </div>
      </button>
    </header>
  );
};
