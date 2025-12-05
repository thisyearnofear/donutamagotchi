"use client";

import { useEffect, useRef } from "react";

type PetState = "idle" | "happy" | "excited" | "hungry" | "sleeping" | "dead" | "bored" | "petting";
type PetGesture = "bounce" | "wiggle" | "jump" | "spin" | "nod" | null;

interface DonutPetProps {
  state: PetState;
  happiness: number;
  health: number;
  isAnimating: boolean;
  gesture?: PetGesture;
  onGestureComplete?: () => void;
}

export function DonutPet({ state, happiness, health, isAnimating, gesture, onGestureComplete }: DonutPetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const gestureFrameRef = useRef(0);
  const gestureCompleteRef = useRef(onGestureComplete);

  useEffect(() => {
    gestureCompleteRef.current = onGestureComplete;
  }, [onGestureComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const animate = () => {
      frameRef.current++;
      if (gesture) gestureFrameRef.current++;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 80;

      // State-dependent movement
      let offsetY = 0;
      let offsetX = 0;
      let rotation = 0;
      let scale = 1;

      // Idle breathing
      if (state !== "dead" && !gesture) {
        const breathe = Math.sin(frameRef.current * 0.05) * 5;
        offsetY = breathe;
      }

      // Gesture animations
      if (gesture) {
        const gestureProgress = gestureFrameRef.current;
        const gestureDuration = 30;

        switch (gesture) {
          case "bounce":
            offsetY = Math.abs(Math.sin(gestureProgress * Math.PI / gestureDuration)) * -30;
            if (gestureProgress > gestureDuration) {
              gestureFrameRef.current = 0;
              gestureCompleteRef.current?.();
            }
            break;
          case "wiggle":
            offsetX = Math.sin(gestureProgress * Math.PI * 2 / gestureDuration) * 15;
            if (gestureProgress > gestureDuration) {
              gestureFrameRef.current = 0;
              gestureCompleteRef.current?.();
            }
            break;
          case "jump":
            const jumpProgress = (gestureProgress / 40);
            if (jumpProgress <= 1) {
              offsetY = -Math.sin(jumpProgress * Math.PI) * 60;
            } else {
              gestureFrameRef.current = 0;
              gestureCompleteRef.current?.();
            }
            break;
          case "spin":
            rotation = (gestureProgress / 20) * Math.PI * 2;
            if (gestureProgress > 20) {
              gestureFrameRef.current = 0;
              gestureCompleteRef.current?.();
            }
            break;
          case "nod":
            const nodAmount = Math.abs(Math.sin(gestureProgress * Math.PI * 2 / 15)) * 0.3;
            rotation = nodAmount;
            if (gestureProgress > 30) {
              gestureFrameRef.current = 0;
              gestureCompleteRef.current?.();
            }
            break;
        }
      }

      const radius = baseRadius;
      ctx.save();
      ctx.translate(centerX + offsetX, centerY + offsetY);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);

      // Draw donut body
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = getDonutColor(state, health);
      ctx.fill();
      ctx.strokeStyle = "#8b4513";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw donut hole
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = "#000";
      ctx.fill();

      // Draw frosting
      drawFrosting(ctx, 0, -radius * 0.3, radius * 1.2, state);

      // Draw face
      drawFace(ctx, 0, 0, state, frameRef.current);

      // Draw particles for excited/petting state
      if ((state === "excited" || state === "petting") && isAnimating) {
        drawParticles(ctx, 0, 0, frameRef.current);
      }

      // Draw bored indicators
      if (state === "bored") {
        drawBoreIndicators(ctx, 0, 0, frameRef.current);
      }

      ctx.restore();

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [state, health, isAnimating, gesture]);

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
  if (state === "bored") return "#e8c4a0";
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
    // Closed eyes (Z's for sleeping)
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
  } else if (state === "bored") {
    // Half-closed eyes
    const eyeHeight = 6;
    ctx.fillStyle = "#fff";
    ctx.fillRect(x - eyeSpacing - 8, eyeY - eyeHeight / 2, 16, eyeHeight);
    ctx.fillRect(x + eyeSpacing - 8, eyeY - eyeHeight / 2, 16, eyeHeight);
    
    ctx.fillStyle = "#000";
    ctx.fillRect(x - eyeSpacing - 4, eyeY - 2, 8, 4);
    ctx.fillRect(x + eyeSpacing - 4, eyeY - 2, 8, 4);
  } else {
    // Open eyes with possible look direction
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

  if (state === "happy" || state === "excited" || state === "petting") {
    // Happy smile
    ctx.arc(x, mouthY - 5, 20, 0.2, Math.PI - 0.2);
  } else if (state === "hungry" || state === "dead") {
    // Sad frown
    ctx.arc(x, mouthY + 10, 20, Math.PI + 0.2, Math.PI * 2 - 0.2);
  } else if (state === "bored") {
    // Flat/bored mouth
    ctx.moveTo(x - 15, mouthY);
    ctx.lineTo(x + 15, mouthY);
  } else {
    // Neutral
    ctx.moveTo(x - 15, mouthY);
    ctx.lineTo(x + 15, mouthY);
  }
  ctx.stroke();
}

function drawParticles(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  const particles = 12;
  for (let i = 0; i < particles; i++) {
    const angle = (i / particles) * Math.PI * 2 + frame * 0.1;
    const dist = 100 + Math.sin(frame * 0.1 + i) * 20;
    const px = x + Math.cos(angle) * dist;
    const py = y + Math.sin(angle) * dist;
    
    // Gradient of colors for richer effect
    const colors = ["#ff6b9d", "#ffd93d", "#6bcf7f", "#4ecdc4"];
    ctx.fillStyle = colors[i % colors.length];
    ctx.globalAlpha = 0.6 - (dist - 100) / 100;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawBoreIndicators(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  // Floating Z's that indicate boredom
  const zCount = 3;
  for (let i = 0; i < zCount; i++) {
    const offset = (frame + i * 20) % 120;
    const zX = x + Math.cos(frame * 0.02 + i) * 80;
    const zY = y - 60 - offset * 0.5;
    const zAlpha = Math.max(0, 1 - offset / 60);
    
    ctx.fillStyle = `rgba(100, 100, 100, ${zAlpha * 0.6})`;
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.globalAlpha = zAlpha;
    ctx.fillText("Z", zX, zY);
    ctx.globalAlpha = 1;
  }
}
