import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import GithubIcon from "../assets/icons/GITHUB.svg";

interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  deploy: string;
}

const PROJECTS_DATA: Project[] = [
  {
    id: 1,
    title: "E-commerce",
    subtitle: "Plataforma de Vendas",
    description:
      "Aplicação de e-commerce desenvolvida em React e TypeScript com integração com Firebase, autenticação de usuários e gerenciamento de produtos e categorias.",
    image: "/project_ecommerce.png",
    tags: [
      "React",
      "TypeScript",
      "Tailwind",
      "Firebase",
      "React Router",
      "Styled Components",
      "React Hook",
    ],
    github: "https://github.com/Diasszx/ecommerce",
    deploy: "https://ecommerce-ochre-three-75.vercel.app/",
  },
  {
    id: 2,
    title: "Task Manager",
    subtitle: "Gerenciador de Tarefas",
    description:
      "Aplicação web para gerenciamento de tarefas(CRUD. O projeto foi desenvolvido com foco em boas práticas do React, componentização, gerenciamento de estado e navegação entre páginas.",
    image: "/project_dashboard.png",
    tags: [
      "React",
      "Vite",
      "JavaScript",
      "Tailwind",
      "React Router",
      "React Hook",
      "JSON Server",
    ],
    github: "https://github.com/Diasszx/task-manager",
    deploy: "https://task-manager-kohl-seven-97.vercel.app/tasks",
  },
  {
    id: 3,
    title: "Finance Track",
    subtitle: "Dashboard Financeiro",
    description:
      "Dashboard financeiro responsivo para controle de receitas, despesas e investimentos(CRUD), com autenticação de usuários, visualização de saldo, filtros por período e integração com API REST utilizando autenticação baseada em JWT.",
    image: "/project_ai.png",
    tags: [
      "React",
      "JavaScript",
      "Tailwind",
      "shadcn/ui",
      "React Query",
      "React Router",
      "React Hooks",
      "Zod",
      "Axios",
    ],
    github: "https://github.com/Diasszx/finance-track",
    deploy: "https://finance-track-eta-five.vercel.app/login",
  },
];

export const Projects: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor screen size for responsive 3D offset calculations
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Soft slide-in transition for the active card's sidebar panel
  useEffect(() => {
    setShowPanel(false);
    const timer = setTimeout(() => {
      setShowPanel(true);
    }, 450); // triggers after active card positioning transition settles
    return () => clearTimeout(timer);
  }, [activeIndex]);

  // Handles mouse horizontal and vertical movements to tilt the ENTIRE carousel block
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;

    // Apenas rotaciona lateralmente (Y-axis tilt) quando o mouse se move para as laterais
    const tiltY = (x / rect.width) * 28; // rotateY limit
    setTilt({ x: 0, y: tiltY });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleCardClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex(
      (prev) => (prev - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length,
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % PROJECTS_DATA.length);
  };

  const getCardTransform = (index: number) => {
    const diff = index - activeIndex;

    // Handle wrapping for 3 projects
    let relativePosition = diff;
    if (diff < -1) relativePosition = diff + PROJECTS_DATA.length;
    if (diff > 1) relativePosition = diff - PROJECTS_DATA.length;

    const lateralDistance = isMobile ? 180 : 420;
    const depthDistance = 0; // Keep side cards at standard Z=0 to prevent click hit-test clipping
    const activeDepth = isMobile ? 80 : 180; // Push active card forward in Z space
    const rotateYAngle = isMobile ? 22 : 35;

    if (relativePosition === 0) {
      // Active project in center — tilt agora vem do wrapper, não daqui
      return {
        transform: `translate(-50%, -50%) translateX(0px) translateZ(${activeDepth}px)`,
        zIndex: 30,
        opacity: 1,
        filter: "grayscale(0%)",
        cursor: "default",
      };
    } else if (
      relativePosition === -1 ||
      (relativePosition === PROJECTS_DATA.length - 1 && activeIndex === 0)
    ) {
      // Left side project
      return {
        transform: `translate(-50%, -50%) translateX(-${lateralDistance}px) translateZ(${depthDistance}px) rotateY(${rotateYAngle}deg)`,
        zIndex: 20,
        opacity: 0.35,
        filter: "grayscale(100%)",
        cursor: "pointer",
      };
    } else if (
      relativePosition === 1 ||
      (relativePosition === -(PROJECTS_DATA.length - 1) &&
        activeIndex === PROJECTS_DATA.length - 1)
    ) {
      // Right side project
      return {
        transform: `translate(-50%, -50%) translateX(${lateralDistance}px) translateZ(${depthDistance}px) rotateY(-${rotateYAngle}deg)`,
        zIndex: 20,
        opacity: 0.35,
        filter: "grayscale(100%)",
        cursor: "pointer",
      };
    } else {
      // Out of view
      return {
        transform: `translate(-50%, -50%) translateX(${relativePosition > 0 ? 800 : -800}px) translateZ(-150px)`,
        zIndex: 0,
        opacity: 0,
        pointerEvents: "none" as const,
      };
    }
  };

  return (
    <section
      id="projects"
      className="w-full bg-black py-20 md:py-28 text-white relative z-10 overflow-hidden flex flex-col justify-center"
    >
      {/* Title Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mb-12 select-none">
        <div className="flex items-center gap-4">
          <h2 className="font-display text-xl md:text-2xl tracking-widest text-zinc-400 font-bold uppercase">
            PRINCIPAIS PROJETOS
          </h2>
          <div className="h-[2px] w-12 bg-blue-400 rounded" />
        </div>
      </div>

      {/* Outer Wrapper for Carousel and Arrows */}
      <div className="w-full relative max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between pointer-events-none">
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="absolute left-2 md:left-6 z-40 bg-zinc-900/60 hover:bg-blue-400 hover:text-black text-blue-400 p-2 md:p-3 rounded-full border border-zinc-800/80 transition-all duration-300 pointer-events-auto active:scale-90 cursor-pointer flex items-center justify-center"
          aria-label="Projeto anterior"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
        </button>

        {/* 3D Carousel Field Container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full flex items-center justify-center relative min-h-[500px] md:min-h-[580px] select-none pointer-events-auto"
          style={{ perspective: "1500px" }}
        >
          {/* Wrapper único que recebe o tilt — todo o carrossel inclina como um bloco rígido */}
          <div
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transformOrigin: "center 30%",
              transition: isHovered
                ? "none"
                : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            {PROJECTS_DATA.map((project, index) => {
              const style = getCardTransform(index);
              const isActive = index === activeIndex;

              return (
                <div
                  key={project.id}
                  onClick={() => handleCardClick(index)}
                  style={style}
                  className={`absolute left-1/2 top-1/2 flex flex-col md:flex-row items-stretch transition-all duration-700 ease-out select-none pointer-events-auto ${
                    isActive ? "cursor-default" : "cursor-pointer"
                  }`}
                >
                  {/* Image Card Display */}
                  <div className="w-[280px] h-[340px] md:w-[320px] md:h-[440px] rounded-2xl md:rounded-l-2xl md:rounded-r-none overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl relative flex-shrink-0">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                    {/* Visual linear vignette fade on card bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Collapsible Sidebar Details Panel */}
                  <div
                    className={`transition-all duration-500 ease-out flex flex-col justify-between bg-zinc-950/95 border border-zinc-800/80 p-5 md:p-6 rounded-b-2xl md:rounded-r-2xl md:rounded-b-none border-t-0 md:border-t md:border-l-0 overflow-hidden ${
                      isActive && showPanel
                        ? "w-[280px] h-[220px] md:w-[300px] md:h-[440px] opacity-100 translate-y-0 md:translate-x-0"
                        : "w-[280px] h-0 md:w-0 md:h-[440px] opacity-0 -translate-y-4 md:translate-y-0 md:-translate-x-4 pointer-events-none"
                    }`}
                  >
                    {/* Title & Info */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] md:text-xs uppercase font-mono tracking-widest text-zinc-500 font-bold">
                        {project.subtitle}
                      </span>
                      <h3 className="text-lg md:text-xl font-display uppercase tracking-wider text-white">
                        {project.title}
                      </h3>
                      <p className="text-zinc-400 font-mono text-[10px] md:text-xs leading-relaxed tracking-wide mt-2 md:mt-4 line-clamp-3 md:line-clamp-none">
                        {project.description}
                      </p>
                    </div>

                    {/* Tags & Action Button */}
                    <div className="mt-4 flex flex-col gap-4">
                      {/* Technology Tags */}
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {project.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[8px] md:text-[9px] uppercase font-mono tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons: GitHub & Live Demo */}
                      <div className="flex items-center gap-2 mt-2 w-full">
                        {/* GitHub Button */}
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800/80 text-[10px] tracking-widest font-extrabold uppercase py-2 md:py-2.5 rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 cursor-pointer pointer-events-auto"
                        >
                          <img
                            src={GithubIcon}
                            className="w-3.5 h-3.5 brightness-0 invert opacity-80"
                            alt="GitHub"
                          />
                          <span>GITHUB</span>
                        </a>

                        {/* Live Demo Button */}
                        <a
                          href={project.deploy}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-blue-950 hover:bg-blue-400 text-blue-400 hover:text-black border border-blue-900/50 text-[10px] tracking-widest font-extrabold uppercase py-2 md:py-2.5 rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 cursor-pointer pointer-events-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>VER PROJETO</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className="absolute right-2 md:right-6 z-40 bg-zinc-900/60 hover:bg-blue-400 hover:text-black text-blue-400 p-2 md:p-3 rounded-full border border-zinc-800/80 transition-all duration-300 pointer-events-auto active:scale-90 cursor-pointer flex items-center justify-center"
          aria-label="Próximo projeto"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
        </button>
      </div>
    </section>
  );
};
