import React, { useState, useEffect, useRef } from "react";
import { Stage } from "../Stage/Stage";
import "./ParticleBox.css";

export type MatterState = "solid" | "liquid" | "gas";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originX: number;
  originY: number;
}

export interface ParticleBoxProps {
  onHint?: () => void;
}

export const ParticleBox: React.FC<ParticleBoxProps> = ({ onHint }) => {
  const [matterState, setMatterState] = useState<MatterState>("solid");
  const [tempLevel, setTempLevel] = useState<number>(1); // 1 = Solid, 2 = Liquid, 3 = Gas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Initialize particles in a regular crystal grid
  useEffect(() => {
    const list: Particle[] = [];
    const rows = 4;
    const cols = 6;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ox = 40 + c * 40;
        const oy = 40 + r * 35;
        list.push({
          x: ox,
          y: oy,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          originX: ox,
          originY: oy,
        });
      }
    }
    particlesRef.current = list;
  }, []);

  // Animation loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (tempLevel === 1) {
          // Solid: shiver near origin
          p.x = p.originX + (Math.random() - 0.5) * 3;
          p.y = p.originY + (Math.random() - 0.5) * 3;
        } else if (tempLevel === 2) {
          // Liquid: roll around bottom half
          p.x += p.vx * 1.5;
          p.y += p.vy * 1.5;
          if (p.x < 15 || p.x > width - 15) p.vx *= -1;
          if (p.y < 80 || p.y > height - 15) p.vy *= -1;
        } else {
          // Gas: bounce rapidly throughout entire box
          p.x += p.vx * 4.5;
          p.y += p.vy * 4.5;
          if (p.x < 15 || p.x > width - 15) p.vx *= -1;
          if (p.y < 15 || p.y > height - 15) p.vy *= -1;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#3b82f6"; // sky
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#1f2a44"; // ink
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [tempLevel]);

  const handleTempChange = (lvl: number) => {
    setTempLevel(lvl);
    if (lvl === 1) setMatterState("solid");
    else if (lvl === 2) setMatterState("liquid");
    else setMatterState("gas");
  };

  const readoutText =
    matterState === "solid"
      ? "Solid: the particles hold their places and shiver."
      : matterState === "liquid"
      ? "Liquid: the particles roll around each other."
      : "Gas: the particles fly fast and bounce far apart.";

  return (
    <Stage
      title="Warm it up. What changes?"
      readout={readoutText}
      onHintClick={onHint}
      actionLabel="Show me"
      onActionClick={() => handleTempChange(tempLevel === 3 ? 1 : tempLevel + 1)}
    >
      <div className="particle-box-stage">
        <div className="particle-canvas-frame">
          <canvas ref={canvasRef} width={280} height={180} className="particle-canvas" />
        </div>

        {/* Heat Stepper / Temperature Control */}
        <div className="particle-heat-controls">
          <span className="heat-label">Temperature:</span>
          <div className="heat-buttons">
            <button
              type="button"
              className={`btn btn-outline heat-btn ${tempLevel === 1 ? "active" : ""}`}
              onClick={() => handleTempChange(1)}
            >
              Cold (Solid)
            </button>
            <button
              type="button"
              className={`btn btn-outline heat-btn ${tempLevel === 2 ? "active" : ""}`}
              onClick={() => handleTempChange(2)}
            >
              Warm (Liquid)
            </button>
            <button
              type="button"
              className={`btn btn-outline heat-btn ${tempLevel === 3 ? "active" : ""}`}
              onClick={() => handleTempChange(3)}
            >
              Hot (Gas)
            </button>
          </div>
        </div>
      </div>
    </Stage>
  );
};
