"use client";

import { useEffect, useRef } from "react";

type PetState = "idle" | "happy" | "excited" | "hungry" | "sleeping" | "dead";

interface DonutPetProps {
  state: PetState;
  happiness: number;
  health: number;
  isAnimating: boolean;
}

export function DonutPet({ state, happiness, health, isAnimating }: DonutPetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const animate = () => {
      frameRef.current++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 80;

      // Breathing effect
      const breathe = Math.sin(frameRef.current * 0.05) * 5;
      const radius = baseRadius + breathe;

      // Draw donut body
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = getDonutColor(state, health);
      ctx.fill();
      ctx.strokeStyle = "#8b4513";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw donut hole
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = "#000";
      ctx.fill();

      // Draw frosting
      drawFrosting(ctx, centerX, centerY - radius * 0.3, radius * 1.2, state);

      // Draw face
      drawFace(ctx, centerX, centerY, state, frameRef.current);

      // Draw particles for excited state
      if (state === "excited" && isAnimating) {
        drawParticles(ctx, centerX, centerY, frameRef.current);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [state, health, isAnimating]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      className="w-full max-w-[300px] mx-auto"
    />
  );
}

function getDonutColor(state: PetState, health: number): string {
  if (state === "dead") return "#666";
  if (health < 30) return "#d4a574";
  return "#f4a460";
}

function drawFrosting(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, state: PetState) {
  const frostingColor = state === "dead" ? "#888" : "#ec4899";
  
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const waveX = x + Math.cos(angle) * (width / 2);
    const waveY = y + Math.sin(angle) * 15;
    if (i === 0) ctx.moveTo(waveX, waveY);
    else ctx.lineTo(waveX, waveY);
  }
  ctx.closePath();
  ctx.fillStyle = frostingColor;
  ctx.fill();

  // Sprinkles
  if (state !== "dead") {
    const colors = ["#ff6b9d", "#ffd93d", "#6bcf7f", "#4ecdc4"];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 30 + Math.random() * 20;
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(
        x + Math.cos(angle) * dist - 2,
        y + Math.sin(angle) * 10 - 1,
        8,
        3
      );
    }
  }
}

function drawFace(ctx: CanvasRenderingContext2D, x: number, y: number, state: PetState, frame: number) {
  const eyeY = y + 10;
  const eyeSpacing = 25;

  // Eyes
  if (state === "sleeping") {
    // Closed eyes
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - eyeSpacing - 8, eyeY);
    ctx.lineTo(x - eyeSpacing + 8, eyeY);
    ctx.moveTo(x + eyeSpacing - 8, eyeY);
    ctx.lineTo(x + eyeSpacing + 8, eyeY);
    ctx.stroke();
  } else if (state === "dead") {
    // X eyes
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - eyeSpacing - 6, eyeY - 6);
    ctx.lineTo(x - eyeSpacing + 6, eyeY + 6);
    ctx.moveTo(x - eyeSpacing + 6, eyeY - 6);
    ctx.lineTo(x - eyeSpacing - 6, eyeY + 6);
    ctx.moveTo(x + eyeSpacing - 6, eyeY - 6);
    ctx.lineTo(x + eyeSpacing + 6, eyeY + 6);
    ctx.moveTo(x + eyeSpacing + 6, eyeY - 6);
    ctx.lineTo(x + eyeSpacing - 6, eyeY + 6);
    ctx.stroke();
  } else {
    // Open eyes
    const blink = Math.floor(frame / 120) % 20 === 0;
    const eyeHeight = blink ? 2 : 12;
    
    ctx.fillStyle = "#fff";
    ctx.fillRect(x - eyeSpacing - 8, eyeY - eyeHeight / 2, 16, eyeHeight);
    ctx.fillRect(x + eyeSpacing - 8, eyeY - eyeHeight / 2, 16, eyeHeight);
    
    if (!blink) {
      ctx.fillStyle = "#000";
      ctx.fillRect(x - eyeSpacing - 4, eyeY - 4, 8, 8);
      ctx.fillRect(x + eyeSpacing - 4, eyeY - 4, 8, 8);
    }
  }

  // Mouth
  const mouthY = y + 35;
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 3;
  ctx.beginPath();

  if (state === "happy" || state === "excited") {
    // Happy smile
    ctx.arc(x, mouthY - 5, 20, 0.2, Math.PI - 0.2);
  } else if (state === "hungry" || state === "dead") {
    // Sad frown
    ctx.arc(x, mouthY + 10, 20, Math.PI + 0.2, Math.PI * 2 - 0.2);
  } else {
    // Neutral
    ctx.moveTo(x - 15, mouthY);
    ctx.lineTo(x + 15, mouthY);
  }
  ctx.stroke();
}

function drawParticles(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  const particles = 8;
  for (let i = 0; i < particles; i++) {
    const angle = (i / particles) * Math.PI * 2 + frame * 0.1;
    const dist = 100 + Math.sin(frame * 0.1 + i) * 20;
    const px = x + Math.cos(angle) * dist;
    const py = y + Math.sin(angle) * dist;
    
    ctx.fillStyle = `rgba(236, 72, 153, ${0.5 - (dist - 100) / 100})`;
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}
