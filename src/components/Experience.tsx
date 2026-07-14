import React from "react";
import { Cpu, Code2, Briefcase } from "lucide-react";

interface ExperienceItem {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  isCurrent: boolean;
  type: "robotics" | "software";
}

const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: 1,
    role: "Técnico de Robótica",
    company: "SESI",
    period: "11/2025 até o momento",
    description: "Orientação de estudantes em programação, eletrônica, Arduino, prototipagem e robótica educacional.",
    isCurrent: true,
    type: "robotics"
  },
  {
    id: 2,
    role: "Desenvolvedor de Software",
    company: "Inteligence Gestão Empresarial",
    period: "11/2024 até 11/2025",
    description: "Desenvolvimento de novas funcionalidades para sistema ERP utilizando PHP e Adianti Framework. Correção de bugs e manutenção evolutiva. Implementação de regras de negócio, formulários, relatórios e integrações entre módulos. Manipulação de dados utilizando MySQL e SQLite. Versionamento de código utilizando Git e colaboração com equipe.",
    isCurrent: false,
    type: "software"
  }
];

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="w-full bg-black py-20 md:py-28 text-white relative z-10 overflow-hidden flex flex-col justify-center">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mb-16 select-none">
        <div className="flex items-center gap-4">
          <h2 className="font-display text-xl md:text-2xl tracking-widest text-zinc-400 font-bold uppercase">
            EXPERIÊNCIA
          </h2>
          <div className="h-[2px] w-12 bg-blue-400 rounded" />
        </div>
      </div>

      {/* Timeline Field */}
      <div className="max-w-4xl mx-auto px-6 w-full relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-zinc-800 md:-translate-x-1/2" />

        {/* Experience Items List */}
        <div className="flex flex-col gap-12 md:gap-16">
          {EXPERIENCE_DATA.map((exp, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={exp.id}
                className={`relative flex flex-col md:flex-row items-start md:items-center ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Icon Node */}
                <div
                  className={`absolute left-6 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full border bg-zinc-950 transition-all duration-500 ${
                    exp.isCurrent
                      ? "border-blue-400 text-blue-400 shadow-[0_0_15px_rgba(74,158,255,0.4)]"
                      : "border-zinc-800 text-zinc-500"
                  }`}
                >
                  {exp.type === "robotics" ? (
                    <Cpu className="w-4 h-4" />
                  ) : (
                    <Code2 className="w-4 h-4" />
                  )}

                  {/* Pulsing indicator for active role */}
                  {exp.isCurrent && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-blue-400 animate-ping opacity-60" />
                  )}
                </div>

                {/* Card Container */}
                <div
                  className={`w-full md:w-[calc(50%-2.5rem)] ml-12 md:ml-0 ${
                    isEven ? "md:mr-auto md:text-right" : "md:ml-auto md:text-left"
                  }`}
                >
                  <div className="bg-zinc-950/40 border border-zinc-900/80 rounded-2xl p-6 md:p-8 hover:border-blue-400/40 hover:shadow-[0_0_20px_rgba(74,158,255,0.06)] transition-all duration-300 pointer-events-auto select-none">
                    {/* Period Badge */}
                    <span className="inline-block font-mono text-[10px] md:text-xs font-bold tracking-wider text-blue-400 uppercase mb-3 bg-blue-950/50 border border-blue-900/30 px-3 py-1 rounded-full">
                      {exp.period}
                    </span>

                    {/* Role Title */}
                    <h3 className="text-lg md:text-xl font-display uppercase tracking-wider text-white mb-1">
                      {exp.role}
                    </h3>

                    {/* Company */}
                    <div
                      className={`flex items-center gap-1.5 text-zinc-400 font-bold tracking-wider text-[11px] md:text-xs mb-4 ${
                        isEven ? "md:justify-end" : "md:justify-start"
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{exp.company}</span>
                    </div>

                    {/* Job description */}
                    <p className="text-zinc-500 font-mono text-xs md:text-sm leading-relaxed tracking-wide">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
