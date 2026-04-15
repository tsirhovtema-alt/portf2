"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  phase: number;
  size: number;
  /** 0 = квадрат, 1–3 = ориентации треугольника */
  shape: number;
}

function drawSquare(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  const half = size * 0.85;
  ctx.fillRect(x - half, y - half, half * 2, half * 2);
}

function drawTriangle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  variant: number
) {
  ctx.beginPath();
  if (variant === 1) {
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size * 0.87, y + size * 0.5);
    ctx.lineTo(x - size * 0.87, y + size * 0.5);
  } else if (variant === 2) {
    ctx.moveTo(x, y + size);
    ctx.lineTo(x + size * 0.87, y - size * 0.5);
    ctx.lineTo(x - size * 0.87, y - size * 0.5);
  } else {
    ctx.moveTo(x - size, y - size * 0.6);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x - size, y + size * 0.6);
  }
  ctx.closePath();
  ctx.fill();
}

function drawParticle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  shape: number
) {
  if (shape === 0) {
    drawSquare(ctx, x, y, size);
  } else {
    drawTriangle(ctx, x, y, size, shape);
  }
}

export default function HeroText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animFrame: number;
    let running = true;

    function buildParticles() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      if (w < 2 || h < 2) return;

      const dpr = window.devicePixelRatio || 1;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = [];

      const narrow = w < 640;
      /* На мобильных меньше коэффициент — буквы не «ломаются» по ширине и пропорциям */
      const fontSize = Math.min(
        Math.floor(w * (narrow ? 0.15 : 0.21)),
        narrow ? 88 : 180
      );
      /* Расстояние между центрами строк (textBaseline = middle) */
      const lineOffset = fontSize * 0.64;

      /* Узкий экран: реже сетка = меньше частиц; шире — плотнее */
      const gap = narrow
        ? Math.max(4, Math.floor(fontSize / 22))
        : Math.max(3, Math.floor(fontSize / 28));

      const sizeMin = narrow ? 0.45 : 0.85;
      const sizeSpread = narrow ? 0.55 : 1.15;

      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const offCtx = off.getContext("2d")!;
      const fontFamily =
        typeof document !== "undefined"
          ? getComputedStyle(document.documentElement)
              .getPropertyValue("--font-geist-sans")
              .trim() || "ui-sans-serif, system-ui, sans-serif"
          : "ui-sans-serif, system-ui, sans-serif";
      offCtx.fillStyle = "#ffffff";
      offCtx.font = `900 ${fontSize}px ${fontFamily}`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      const cy = h / 2;
      offCtx.fillText("WEB", w / 2, cy - lineOffset);
      offCtx.fillText("TERA", w / 2, cy + lineOffset);

      const data = offCtx.getImageData(0, 0, w, h).data;

      for (let py = 0; py < h; py += gap) {
        for (let px = 0; px < w; px += gap) {
          const idx = (py * w + px) * 4;
          if (data[idx + 3] > 100) {
            const jitter = gap * 0.22;
            const ox = px + (Math.random() - 0.5) * jitter;
            const oy = py + (Math.random() - 0.5) * jitter;
            const isSquare = Math.random() < 0.5;
            particles.push({
              x: ox,
              y: oy,
              originX: ox,
              originY: oy,
              vx: 0,
              vy: 0,
              phase: Math.random() * Math.PI * 2,
              size: Math.random() * sizeSpread + sizeMin,
              shape: isSquare ? 0 : 1 + Math.floor(Math.random() * 3),
            });
          }
        }
      }
    }

    function animate(time: number) {
      if (!running) return;

      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;

      ctx!.clearRect(0, 0, w, h);

      const { x: mx, y: my } = mouseRef.current;
      const repelR = Math.min(w * 0.12, 110);
      const repelStr = 6;
      const spring = 0.085;
      const friction = 0.83;

      for (const p of particles) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (dist < repelR && dist > 0) {
          const force = ((repelR - dist) / repelR) * repelStr;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx += (p.originX - p.x) * spring;
        p.vy += (p.originY - p.y) * spring;
        p.vx *= friction;
        p.vy *= friction;
        p.x += p.vx;
        p.y += p.vy;

        const pulse =
          0.25 +
          0.75 * (0.5 + 0.5 * Math.sin(time * 0.00115 + p.phase));
        const brightness = 140 + Math.floor(pulse * 110);
        const alpha = 0.35 + pulse * 0.65;

        const displaced = Math.sqrt(
          (p.x - p.originX) ** 2 + (p.y - p.originY) ** 2
        );

        if (displaced > 2) {
          ctx!.shadowBlur = 6;
          ctx!.shadowColor = `rgba(${brightness},${brightness},${brightness},0.5)`;
        } else {
          ctx!.shadowBlur = 0;
        }

        ctx!.fillStyle = `rgba(${brightness},${brightness},${brightness},${alpha.toFixed(3)})`;
        drawParticle(ctx!, p.x, p.y, p.size, p.shape);
      }

      ctx!.shadowBlur = 0;
      animFrame = requestAnimationFrame(animate);
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    };

    const onTouchEnd = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    const ro = new ResizeObserver(() => {
      buildParticles();
    });
    ro.observe(canvas);

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    buildParticles();
    animFrame = requestAnimationFrame(animate);

    return () => {
      running = false;
      cancelAnimationFrame(animFrame);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div className="h-[100dvh] min-h-[100dvh] w-full">
      <canvas
        ref={canvasRef}
        className="block h-full w-full max-w-full"
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
