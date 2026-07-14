import React, { useEffect, useRef } from "react";

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // 1. Drifting background particles (2D)
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
        this.vx = (Math.random() - 0.5) * 0.25; // slow drift
        this.vy = (Math.random() - 0.5) * 0.25;
        this.radius = Math.random() * 1.2 + 0.4; // tiny: 0.4px to 1.6px
        this.baseAlpha = Math.random() * 0.15 + 0.05; // faint
        this.alpha = this.baseAlpha;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on borders
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Faint attraction to mouse
        if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
          const dx = mouseRef.current.x - this.x;
          const dy = mouseRef.current.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 200;

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            this.x += (dx / distance) * force * 0.3;
            this.y += (dy / distance) * force * 0.3;
            this.alpha = Math.min(this.baseAlpha + force * 0.25, 0.45);
          } else {
            if (this.alpha > this.baseAlpha) this.alpha -= 0.005;
          }
        } else {
          if (this.alpha > this.baseAlpha) this.alpha -= 0.005;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 200, 200, ${this.alpha})`;
        ctx.fill();
      }
    }

    // 2. Interactive mouse-spawned trail particles (2D)
    class TrailParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      decay: number;
      isBlue: boolean;

      constructor(startX: number, startY: number) {
        // Spawn offset from mouse center to form a cloud
        const angle = Math.random() * Math.PI * 2;
        const radiusOffset = Math.random() * 45; // cloud size
        this.x = startX + Math.cos(angle) * radiusOffset;
        this.y = startY + Math.sin(angle) * radiusOffset;

        // Slow outward drift
        this.vx = (Math.random() - 0.5) * 0.5 + Math.cos(angle) * 0.15;
        this.vy = (Math.random() - 0.5) * 0.5 + Math.sin(angle) * 0.15;
        
        this.radius = Math.random() * 1.5 + 0.5; // 0.5px to 2.0px
        this.alpha = Math.random() * 0.6 + 0.25; // higher initial opacity
        this.decay = Math.random() * 0.006 + 0.004; // lives ~60-150 frames
        this.isBlue = Math.random() < 0.25; // 25% chance of being blue
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const color = this.isBlue
          ? `rgba(74, 158, 255, ${Math.max(this.alpha, 0)})`
          : `rgba(220, 220, 220, ${Math.max(this.alpha, 0)})`;
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    // Initial background particles
    const bgParticles: BackgroundParticle[] = [];
    const bgCount = Math.floor((width * height) / 10000);
    for (let i = 0; i < Math.max(bgCount, 120); i++) {
      bgParticles.push(new BackgroundParticle());
    }

    // Interactive trail particles array
    let trailParticles: TrailParticle[] = [];

    // Track mouse events
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      // Spawn trail particles upon mouse movement
      if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
        for (let i = 0; i < 4; i++) {
          trailParticles.push(new TrailParticle(mouseRef.current.x, mouseRef.current.y));
        }
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      bgParticles.length = 0;
      const newBgCount = Math.floor((width * height) / 10000);
      for (let i = 0; i < Math.max(newBgCount, 120); i++) {
        bgParticles.push(new BackgroundParticle());
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw and update background particles
      bgParticles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Spawn some particles automatically even if mouse is still but on-screen
      if (mouseRef.current.x !== null && mouseRef.current.y !== null && Math.random() < 0.4) {
        trailParticles.push(new TrailParticle(mouseRef.current.x, mouseRef.current.y));
      }

      // Draw, update and filter trail particles
      trailParticles = trailParticles.filter((p) => {
        p.update();
        if (p.alpha <= 0) return false;
        p.draw();
        return true;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
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
