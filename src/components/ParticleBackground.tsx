import { useEffect, useRef } from "react";

type MousePosition = {
  x: number | null;
  y: number | null;
};

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mouseRef = useRef<MousePosition>({
    x: null,
    y: null,
  });

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const container = canvas.parentElement;

    if (!container) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let animationFrameId = 0;

    let width = 0;
    let height = 0;

    let sphereRadius = 0;
    let targetSphereRadius = 0;

    let sphereVisibility = 0;
    let targetSphereVisibility = 0;

    let sphereCenterX = 0;
    let sphereCenterY = 0;

    let rotationX = 0;
    let rotationY = 0;

    let previousMouseX: number | null = null;
    let previousMouseY: number | null = null;

    let backgroundParticles: BackgroundParticle[] = [];
    const sphereParticles: SphereParticle[] = [];

    class BackgroundParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      alpha: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;

        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;

        this.radius = Math.random() * 1.2 + 0.4;
        this.baseAlpha = Math.random() * 0.12 + 0.04;
        this.alpha = this.baseAlpha;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x <= 0 || this.x >= width) {
          this.vx *= -1;
        }

        if (this.y <= 0 || this.y >= height) {
          this.vy *= -1;
        }

        const mouseX = mouseRef.current.x;
        const mouseY = mouseRef.current.y;

        if (mouseX === null || mouseY === null) {
          this.alpha += (this.baseAlpha - this.alpha) * 0.04;

          return;
        }

        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.max(Math.hypot(dx, dy), 0.001);

        const interactionRadius = 240;

        if (distance < interactionRadius) {
          const force = 1 - distance / interactionRadius;

          this.alpha = Math.min(this.baseAlpha + force * 0.25, 0.4);
        } else {
          this.alpha += (this.baseAlpha - this.alpha) * 0.04;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();

        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(220, 220, 220, ${this.alpha})`;
        ctx.fill();
      }
    }

    class SphereParticle {
      theta: number;
      phi: number;
      baseRadius: number;

      x: number;
      y: number;
      z: number;

      screenX: number;
      screenY: number;

      size: number;
      alpha: number;
      isBlue: boolean;

      constructor() {
        this.theta = Math.random() * Math.PI * 2;

        this.phi = Math.acos(2 * Math.random() - 1);

        /*
         * Mantém as partículas próximas da superfície
         * da esfera, criando o efeito circular vazado.
         */
        this.baseRadius = Math.random() * 0.15 + 0.88;

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.screenX = 0;
        this.screenY = 0;

        this.size = 1;
        this.alpha = 0;

        this.isBlue = Math.random() < 0.22;
      }

      update(
        centerX: number,
        centerY: number,
        radius: number,
        currentRotationX: number,
        currentRotationY: number,
        visibility: number,
      ) {
        const particleRadius = radius * this.baseRadius;

        /*
         * Converte as coordenadas esféricas
         * para coordenadas cartesianas 3D.
         */
        let x = particleRadius * Math.sin(this.phi) * Math.cos(this.theta);

        let y = particleRadius * Math.cos(this.phi);

        let z = particleRadius * Math.sin(this.phi) * Math.sin(this.theta);

        /*
         * Rotação no eixo Y.
         */
        const cosY = Math.cos(currentRotationY);
        const sinY = Math.sin(currentRotationY);

        const rotatedX = x * cosY - z * sinY;

        const rotatedZ = x * sinY + z * cosY;

        x = rotatedX;
        z = rotatedZ;

        /*
         * Rotação no eixo X.
         */
        const cosX = Math.cos(currentRotationX);
        const sinX = Math.sin(currentRotationX);

        const rotatedY = y * cosX - z * sinX;

        const finalZ = y * sinX + z * cosX;

        y = rotatedY;
        z = finalZ;

        this.x = x;
        this.y = y;
        this.z = z;

        /*
         * Projeção em perspectiva.
         *
         * Valores menores criam um efeito 3D
         * mais evidente.
         */
        const perspective = 360;

        const safeDenominator = Math.max(perspective - z, 30);

        const scale = perspective / safeDenominator;

        this.screenX = centerX + x * scale;

        this.screenY = centerY + y * scale;

        const normalizedDepth = Math.min(
          Math.max((z / Math.max(radius, 1) + 1) / 2, 0),
          1,
        );

        /*
         * Partículas frontais ficam maiores.
         */
        this.size = (0.55 + normalizedDepth * 1.9) * scale;

        /*
         * Partículas frontais ficam mais visíveis.
         */
        this.alpha = (0.12 + normalizedDepth * 0.78) * visibility;
      }

      draw() {
        if (!ctx || this.alpha <= 0.01) return;

        const red = this.isBlue ? 74 : 225;
        const green = this.isBlue ? 158 : 235;
        const blue = 255;

        /*
         * Glow externo.
         */
        const glowRadius = Math.max(this.size * 3, 2);

        const gradient = ctx.createRadialGradient(
          this.screenX,
          this.screenY,
          0,
          this.screenX,
          this.screenY,
          glowRadius,
        );

        gradient.addColorStop(
          0,
          `rgba(${red}, ${green}, ${blue}, ${this.alpha * 0.4})`,
        );

        gradient.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);

        ctx.beginPath();

        ctx.arc(this.screenX, this.screenY, glowRadius, 0, Math.PI * 2);

        ctx.fillStyle = gradient;
        ctx.fill();

        /*
         * Núcleo da partícula.
         */
        ctx.beginPath();

        ctx.arc(
          this.screenX,
          this.screenY,
          Math.max(this.size, 0.4),
          0,
          Math.PI * 2,
        );

        ctx.fillStyle = `rgba(
          ${red},
          ${green},
          ${blue},
          ${this.alpha}
        )`;

        ctx.fill();
      }
    }

    const createBackgroundParticles = () => {
      backgroundParticles = [];

      const calculatedAmount = Math.floor((width * height) / 11000);

      const amount = Math.min(Math.max(calculatedAmount, 80), 220);

      for (let index = 0; index < amount; index++) {
        backgroundParticles.push(new BackgroundParticle());
      }
    };

    const createSphereParticles = () => {
      sphereParticles.length = 0;

      /*
       * Aumente esse valor para deixar
       * a esfera mais preenchida.
       */
      const particleAmount = window.innerWidth < 768 ? 280 : 520;

      for (let index = 0; index < particleAmount; index++) {
        sphereParticles.push(new SphereParticle());
      }
    };

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();

      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = width * devicePixelRatio;

      canvas.height = height * devicePixelRatio;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      sphereCenterX = width / 2;
      sphereCenterY = height / 2;

      createBackgroundParticles();
      createSphereParticles();
    };

    const handleMouseEnter = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();

      const mouseX = event.clientX - rect.left;

      const mouseY = event.clientY - rect.top;

      sphereCenterX = mouseX;
      sphereCenterY = mouseY;

      mouseRef.current = {
        x: mouseX,
        y: mouseY,
      };

      /*
       * Define o tamanho final da esfera.
       */
      targetSphereRadius = window.innerWidth < 768 ? 70 : 130;

      targetSphereVisibility = 1;
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();

      const mouseX = event.clientX - rect.left;

      const mouseY = event.clientY - rect.top;

      if (previousMouseX !== null && previousMouseY !== null) {
        const deltaX = mouseX - previousMouseX;

        const deltaY = mouseY - previousMouseY;

        rotationY += deltaX * 0.0025;
        rotationX += deltaY * 0.0025;
      }

      previousMouseX = mouseX;
      previousMouseY = mouseY;

      mouseRef.current = {
        x: mouseX,
        y: mouseY,
      };

      /*
       * Faz o centro da esfera acompanhar o mouse
       * com um pequeno atraso.
       */
      sphereCenterX += (mouseX - sphereCenterX) * 0.28;

      sphereCenterY += (mouseY - sphereCenterY) * 0.28;

      targetSphereRadius = window.innerWidth < 768 ? 70 : 130;

      targetSphereVisibility = 1;
    };

    const handleMouseLeave = () => {
      mouseRef.current = {
        x: null,
        y: null,
      };

      previousMouseX = null;
      previousMouseY = null;

      targetSphereRadius = 0;
      targetSphereVisibility = 0;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      backgroundParticles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      /*
       * Suaviza a expansão e o desaparecimento.
       */
      sphereRadius += (targetSphereRadius - sphereRadius) * 0.075;

      sphereVisibility += (targetSphereVisibility - sphereVisibility) * 0.09;

      /*
       * Rotação automática da esfera.
       */
      rotationY += 0.0035;
      rotationX += 0.0012;

      /*
       * Mantém o centro acompanhando o mouse,
       * mesmo quando ele se move rapidamente.
       */
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      if (mouseX !== null && mouseY !== null) {
        sphereCenterX += (mouseX - sphereCenterX) * 0.12;

        sphereCenterY += (mouseY - sphereCenterY) * 0.12;
      }

      if (sphereVisibility > 0.01 && sphereRadius > 0.5) {
        sphereParticles.forEach((particle) => {
          particle.update(
            sphereCenterX,
            sphereCenterY,
            sphereRadius,
            rotationX,
            rotationY,
            sphereVisibility,
          );
        });

        /*
         * Desenha primeiro as partículas
         * que estão atrás.
         */
        sphereParticles.sort(
          (particleA, particleB) => particleA.z - particleB.z,
        );

        sphereParticles.forEach((particle) => {
          particle.draw();
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (reducedMotionQuery.matches) {
      return;
    }

    resizeCanvas();

    container.addEventListener("mouseenter", handleMouseEnter);

    container.addEventListener("mousemove", handleMouseMove);

    container.addEventListener("mouseleave", handleMouseLeave);

    window.addEventListener("resize", resizeCanvas);

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);

      container.removeEventListener("mouseenter", handleMouseEnter);

      container.removeEventListener("mousemove", handleMouseMove);

      container.removeEventListener("mouseleave", handleMouseLeave);

      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10"
    />
  );
};
