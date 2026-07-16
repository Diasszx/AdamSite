import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

// Zod Schema for semantic form validation
const contactSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Insira um endereço de e-mail válido"),
  message: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres"),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Custom SVG Icons for brands
const GithubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Spline = lazy(() => import("@splinetool/react-spline"));

export const Contact: React.FC = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSplineVisible, setIsSplineVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const splineContainerRef = useRef<HTMLDivElement>(null);

  // Detectar se é mobile (menor que breakpoint lg do Tailwind: 1024px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // IntersectionObserver para lazy loading do Spline 3D (apenas desktop)
  useEffect(() => {
    // Não executa em mobile
    if (isMobile) return;

    const container = splineContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Delay de 500ms para evitar carregamento durante scroll rápido
            const timer = setTimeout(() => {
              setIsSplineVisible(true);
            }, 500);
            return () => clearTimeout(timer);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Começa a carregar quando estiver a 100px de distância
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [isMobile]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setSubmitError(null);
      const response = await fetch("https://formsubmit.co/ajax/adamrpdiass@hotmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          Nome: data.name,
          Email: data.email,
          Mensagem: data.message
        })
      });

      if (response.ok) {
        setSubmitSuccess(true);
      } else {
        throw new Error("Erro no envio");
      }
    } catch (err) {
      setSubmitError("Ocorreu um erro ao enviar a mensagem. Tente novamente.");
    }
  };

  const handleSendAnother = () => {
    setSubmitSuccess(false);
    reset();
  };

  return (
    <section
      id="contact"
      className="w-full bg-black py-20 md:py-28 text-white relative z-10 overflow-hidden flex flex-col justify-center"
    >
      {/* Title Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full text-center mb-16 select-none flex flex-col items-center justify-center">
        <h2 className="font-display text-3xl md:text-5xl uppercase tracking-wider text-white mb-3">
          TEM UM PROJETO EM MENTE?
        </h2>
        <span className="text-blue-400 font-mono tracking-widest text-xs md:text-sm font-bold uppercase">
          Entre em contato
        </span>
        <div className="h-[2px] w-16 bg-blue-400 rounded mt-4" />
      </div>

      <div className={`max-w-7xl mx-auto px-6 md:px-12 w-full grid gap-12 items-center ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2 lg:gap-20'}`}>
        {/* Left Side: Spline 3D Waving Robot - Apenas Desktop */}
        {!isMobile && (
          <div 
            ref={splineContainerRef}
            className="w-full h-[350px] md:h-[500px] relative pointer-events-auto rounded-2xl overflow-hidden flex items-center justify-center bg-zinc-950/30 border border-zinc-900"
          >
            {isSplineVisible ? (
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 font-mono text-xs">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-400 mr-2" />
                    Carregando Robô 3D...
                  </div>
                }
              >
                <Spline scene="https://prod.spline.design/N5l9YaPPaFFzzbEr/scene.splinecode" />
              </Suspense>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono text-xs">
                <span>3D Robô (carregará ao rolar)</span>
              </div>
            )}
          </div>
        )}

        {/* Right Side: Form & Contact Info - Centralizado em mobile */}
        <div className={`flex flex-col gap-8 w-full ${isMobile ? 'max-w-lg mx-auto' : ''}`}>
          {/* Contact Form Card */}
          <div className="w-full bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 md:p-8 hover:border-zinc-800/80 transition-all duration-300 shadow-2xl relative min-h-[420px] flex flex-col justify-center">
            {submitSuccess ? (
              /* Success Frame */
              <div className="flex flex-col items-center justify-center text-center p-6 select-none animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-blue-950 border border-blue-900/50 text-blue-400 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(74,158,255,0.2)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-display text-xl uppercase tracking-wider text-white mb-2">
                  Mensagem Enviada!
                </h4>
                <p className="font-mono text-zinc-500 text-xs md:text-sm leading-relaxed mb-8 max-w-xs">
                  Obrigado pelo contato, Adam. Responderei a sua mensagem o mais
                  rápido possível!
                </p>
                <button
                  onClick={handleSendAnother}
                  className="bg-blue-950 text-blue-400 border border-blue-900/50 hover:bg-blue-400 hover:text-black font-extrabold text-[10px] md:text-xs tracking-widest uppercase px-6 py-2.5 rounded-full transition-all duration-300 pointer-events-auto cursor-pointer"
                >
                  ENVIAR OUTRA MENSAGEM
                </button>
              </div>
            ) : (
              /* Contact Form */
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5 text-left pointer-events-auto"
              >
                {submitError && (
                  <div className="bg-red-950/50 border border-red-900/40 text-red-400 font-mono text-xs p-3 rounded-lg">
                    {submitError}
                  </div>
                )}

                {/* Name Input */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="name"
                    className="font-mono text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest"
                  >
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    placeholder="Seu nome"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs md:text-sm font-mono text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-200"
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <span className="text-red-400 text-[10px] font-mono mt-0.5">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                {/* Email Input */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="font-mono text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest"
                  >
                    E-mail de Contato
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    placeholder="voce@exemplo.com"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs md:text-sm font-mono text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-200"
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <span className="text-red-400 text-[10px] font-mono mt-0.5">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                {/* Message Input */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="message"
                    className="font-mono text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest"
                  >
                    Sua Mensagem
                  </label>
                  <textarea
                    id="message"
                    {...register("message")}
                    rows={4}
                    placeholder="Escreva sobre o seu projeto ou ideia..."
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs md:text-sm font-mono text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none transition-all duration-200"
                    disabled={isSubmitting}
                  />
                  {errors.message && (
                    <span className="text-red-400 text-[10px] font-mono mt-0.5">
                      {errors.message.message}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-950 text-blue-400 border border-blue-900/50 hover:bg-blue-400 hover:text-black font-extrabold text-[10px] md:text-xs tracking-widest uppercase py-3 rounded-full flex items-center justify-center gap-2 group transition-all duration-300 active:scale-95 cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>ENVIANDO...</span>
                    </>
                  ) : (
                    <>
                      <span>ENVIAR MENSAGEM</span>
                      <Send className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Social Links & Info footer */}
          <div className="flex items-center justify-between border-t border-zinc-900 pt-6">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
              Redes Sociais
            </span>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Diasszx"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-blue-400 hover:text-black hover:border-blue-400 text-zinc-400 transition-all duration-300 flex items-center justify-center pointer-events-auto cursor-pointer"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/adam-diass/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-blue-400 hover:text-black hover:border-blue-400 text-zinc-400 transition-all duration-300 flex items-center justify-center pointer-events-auto cursor-pointer"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
