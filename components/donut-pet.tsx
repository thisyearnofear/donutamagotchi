"use client";

import { useEffect, useRef, useMemo } from "react";
import { Traits, getColorHex, getPersonalityTraits, getLifecycleInfo } from "@/lib/traits";
import {
  simulateSpring,
  applyGravity,
  handleGroundCollision,
  easeOutBounce,
  calculateSquashStretch,
  calculateWiggle,
  calculateBreathing,
  calculateHeadShake,
  calculateEyeExpression,
  calculateMouthExpression,
  calculateEyebrowExpression,
  calculateHeadBreathing,
  getEyeAppearance,
  spawnParticles,
  updateParticle,
  type Particle,
} from "@/lib/physics";

type PetState = "idle" | "happy" | "excited" | "hungry" | "sleeping" | "dead" | "bored" | "petting";
type PetGesture = "bounce" | "wiggle" | "jump" | "spin" | "nod" | null;

interface DonutPetProps {
  state: PetState;
  happiness: number;
  health: number;
  isAnimating: boolean;
  gesture?: PetGesture;
  onGestureComplete?: () => void;
  traits?: Traits | null;
  createdAtSeconds?: number;
}

export function DonutPet({ state, happiness, health, isAnimating, gesture, onGestureComplete, traits, createdAtSeconds }: DonutPetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const gestureFrameRef = useRef(0);
  const gestureCompleteRef = useRef(onGestureComplete);
  
  // Physics state for jump/bounce
  const jumpStateRef = useRef({ y: 0, vy: 0 });
  
  // Particle system for happy/excited states
  const particlesRef = useRef<Particle[]>([]);
  const lastParticleSpawnRef = useRef(0);

  // Calculate lifecycle for visual evolution
  const lifecycleInfo = useMemo(() => {
    if (!createdAtSeconds) return null;
    return getLifecycleInfo(createdAtSeconds, Date.now());
  }, [createdAtSeconds]);

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

      // Get personality-based animation speed
      const personalitySpeed = traits ? getPersonalityTraits(traits.personality).animationSpeed : 1;

      // State-dependent movement
      let offsetY = 0;
      let offsetX = 0;
      let rotation = 0;
      let scale = 1;

      // Idle breathing (speed affected by personality)
      if (state !== "dead" && !gesture) {
        const breathe = Math.sin(frameRef.current * 0.05 * personalitySpeed) * 5;
        offsetY = breathe;
        // Add subtle head tilt during breathing
        rotation = calculateHeadBreathing(frameRef.current, personalitySpeed);
      }

      // Physics-based gesture animations
      if (gesture) {
        const gestureProgress = gestureFrameRef.current;
        const gestureDuration = gesture === "jump" ? 50 : gesture === "bounce" ? 40 : 30;
        const progress = Math.min(gestureProgress / gestureDuration, 1);

        switch (gesture) {
          case "bounce":
            // Spring-based bounce with overshoot
            const bounceEase = easeOutBounce(progress);
            offsetY = -bounceEase * 40;
            // Squash on landing
            const { scaleX: bsx, scaleY: bsy } = calculateSquashStretch(bounceEase);
            scale = 1;
            if (gestureProgress > gestureDuration) {
              gestureFrameRef.current = 0;
              gestureCompleteRef.current?.();
            }
            break;
          case "wiggle":
            // Oscillating wiggle with damping
            const wiggleDamping = 1 - progress * 0.3;
            offsetX = calculateWiggle(gestureProgress, 0.25, 15) * wiggleDamping;
            if (gestureProgress > gestureDuration) {
              gestureFrameRef.current = 0;
              gestureCompleteRef.current?.();
            }
            break;
          case "jump":
            // Physics-based jump with gravity
            const jumpDuration = 50;
            const jumpPhase = gestureProgress / jumpDuration;
            
            if (jumpPhase <= 1) {
              // Parabolic arc with easing
              offsetY = -easeOutBounce(jumpPhase) * 80;
              // Squash/stretch during jump
              const { scaleX: jsx, scaleY: jsy } = calculateSquashStretch(jumpPhase);
              // Apply slight scale deformation
              if (jumpPhase < 0.3) {
                scale = 0.95; // Compress at start
              } else if (jumpPhase < 0.7) {
                scale = 1.05; // Stretch at peak
              } else {
                scale = 0.98; // Land compression
              }
            } else {
              gestureFrameRef.current = 0;
              gestureCompleteRef.current?.();
            }
            break;
          case "spin":
            // Smooth rotation with easing
            const spinEase = progress < 0.5 
              ? 2 * progress * progress 
              : -1 + (4 - 2 * progress) * progress;
            rotation = spinEase * Math.PI * 2;
            if (gestureProgress > gestureDuration) {
              gestureFrameRef.current = 0;
              gestureCompleteRef.current?.();
            }
            break;
          case "nod":
            // Head shake with natural motion
            rotation = calculateHeadShake(progress, 1);
            if (gestureProgress > gestureDuration) {
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

      // Lifecycle-based donut size (smaller when young)
      const sizeMultiplier = lifecycleInfo?.stage === "birth" ? 0.7 : lifecycleInfo?.stage === "growth" ? 0.85 : 1;
      const actualRadius = radius * sizeMultiplier;
      
      // Draw donut body with trait-based coloring and depth shading
      const donutColor = getDonutColor(state, health, traits);
      
      // Body with radial gradient for 3D depth effect
      const bodyGradient = ctx.createRadialGradient(
        -actualRadius * 0.2, -actualRadius * 0.2, 0,
        0, 0, actualRadius
      );
      bodyGradient.addColorStop(0, lightenColor(donutColor, 0.2));
      bodyGradient.addColorStop(0.5, donutColor);
      bodyGradient.addColorStop(1, darkenColor(donutColor, 0.2));
      
      ctx.beginPath();
      ctx.arc(0, 0, actualRadius, 0, Math.PI * 2);
      ctx.fillStyle = bodyGradient;
      ctx.fill();
      ctx.strokeStyle = "#8b4513";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw donut hole (scales with size)
      ctx.beginPath();
      ctx.arc(0, 0, actualRadius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = "#000";
      ctx.fill();

      // Draw frosting with lifecycle info
      drawFrosting(ctx, 0, -actualRadius * 0.3, actualRadius * 1.2, state, traits, lifecycleInfo);

      // Update and draw particles (emotion-driven effects)
      if ((state === "excited" || state === "happy" || state === "petting") && isAnimating) {
        // Spawn new particles every 15 frames
        if (frameRef.current - lastParticleSpawnRef.current > 15) {
          particlesRef.current.push(...spawnParticles(4, frameRef.current, 2.5));
          lastParticleSpawnRef.current = frameRef.current;
        }
      } else if (state === "bored") {
        // Don't spawn particles when bored
        particlesRef.current = [];
        lastParticleSpawnRef.current = frameRef.current;
      }
      
      // Update all particles
      particlesRef.current = particlesRef.current
        .map(p => updateParticle(p))
        .filter(p => p.life > 0);
      
      // Draw particles
      drawParticlesEnhanced(ctx, 0, 0, particlesRef.current);

      // Draw face with expression-based eyes and mouth
      drawFaceEnhanced(ctx, 0, 0, state, frameRef.current, traits);

      // Draw bored indicators
      if (state === "bored") {
        drawBoreIndicators(ctx, 0, 0, frameRef.current);
      }

      ctx.restore();

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [state, health, isAnimating, gesture, traits, lifecycleInfo]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      className="w-full max-w-[300px] mx-auto"
    />
  );
}

function getDonutColor(state: PetState, health: number, traits?: Traits | null): string {
  if (state === "dead") return "#666";
  if (state === "bored") return "#e8c4a0";
  if (health < 30) return "#d4a574";
  
  // Use trait-based coloring if available
  if (traits) {
    const baseColor = getColorHex(traits.coloring);
    // Apply grooming effect: higher grooming = more saturated color
    const groomingFactor = traits.grooming / 100;
    // This is a simplified effect; in a real implementation you might use HSL adjustment
    return baseColor;
  }
  
  return "#f4a460";
}

function drawFrosting(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, state: PetState, traits?: Traits | null, lifecycleInfo?: any) {
  const frostingColor = state === "dead" ? "#888" : traits?.personality === "Friendly" ? "#FFB6C1" : "#ec4899";
  
  // Wave height varies by lifecycle stage (babies have less frosting)
  const waveHeightMultiplier = lifecycleInfo?.stage === "birth" ? 0.5 : lifecycleInfo?.stage === "growth" ? 0.75 : 1;
  const waveHeight = 15 * waveHeightMultiplier;
  
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const waveX = x + Math.cos(angle) * (width / 2);
    const waveY = y + Math.sin(angle) * waveHeight;
    if (i === 0) ctx.moveTo(waveX, waveY);
    else ctx.lineTo(waveX, waveY);
  }
  ctx.closePath();
  ctx.fillStyle = frostingColor;
  ctx.fill();

  // Sprinkles with personality-based distribution
  if (state !== "dead") {
    // More sprinkles for happy/energetic, fewer for lazy
    const sprinkleCount = traits?.personality === "Energetic" ? 16 : traits?.personality === "Lazy" ? 8 : 12;
    const colors = ["#ff6b9d", "#ffd93d", "#6bcf7f", "#4ecdc4"];
    
    for (let i = 0; i < sprinkleCount; i++) {
      const angle = (i / sprinkleCount) * Math.PI * 2 + Math.random() * 0.3;
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

/**
 * Enhanced face drawing with exaggerated expression animations
 * Uses calculateEyeExpression and calculateMouthExpression for state-driven visuals
 * Includes: big expressive eyes with shine, cheek blushes, improved mouth shapes
 */
function drawFaceEnhanced(ctx: CanvasRenderingContext2D, x: number, y: number, state: PetState, frame: number, traits?: Traits | null) {
  const eyeY = y + 8;
  const eyeSpacing = 28;
  const baseEyeWidth = 20; // Enlarged from 16
  const baseEyeHeight = 16; // Enlarged from 12

  // Get expression state from physics engine
  const eyeExpr = calculateEyeExpression(state, frame);
  const mouthExpr = calculateMouthExpression(state, frame);
  const eyebrowExpr = traits ? calculateEyebrowExpression(traits.personality, state, frame) : null;
  const eyeAppearance = traits ? getEyeAppearance(traits.personality) : null;
  
  // Draw cheek blushes (key to cuteness)
  const blushIntensity = Math.max(0, calculateEyeExpression(state, frame).height * 0.7);
  drawCheekBlushes(ctx, x, y, blushIntensity, traits?.personality);
  
  // Draw eyebrows before eyes (so eyes render on top)
  if (eyebrowExpr && !("sleeping".includes(state) || "dead".includes(state))) {
    drawEyebrows(ctx, x, y, eyebrowExpr, eyeSpacing);
  }

  // Special case: dead pets get X eyes (classic)
  if (state === "dead") {
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
  } else if (state === "sleeping") {
    // Sleeping: straight lines
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - eyeSpacing - 8, eyeY);
    ctx.lineTo(x - eyeSpacing + 8, eyeY);
    ctx.moveTo(x + eyeSpacing - 8, eyeY);
    ctx.lineTo(x + eyeSpacing + 8, eyeY);
    ctx.stroke();
  } else {
    // Draw eyes with exaggerated expression and glancing
    const eyeWidth = baseEyeWidth * eyeExpr.width;
    const eyeHeight = baseEyeHeight * eyeExpr.height;
    const pupilY = eyeY + eyeExpr.pupilOffset * 4; // Pupil can move up/down
    const glanceShift = eyeExpr.glanceOffset * 6; // Horizontal glance offset

    // Personality-based eye shape
    const eyeShape = traits?.personality === "Stubborn" ? "round" : traits?.personality === "Lazy" ? "small" : "normal";
    
    // Get personality-based eye colors
    const pupilColor = eyeAppearance?.pupilColor || "#000";
    const eyeWhiteColor = eyeAppearance?.eyeWhiteColor || "#fff";

    // Draw eye whites and pupils (exaggerated for emotion)
    if (eyeShape === "round" && eyeHeight > 0.1) {
      // Round eyes (Stubborn personality)
      const radius = eyeWidth / 2;
      
      // Eye white base with personality color
      ctx.fillStyle = eyeWhiteColor;
      ctx.beginPath();
      ctx.arc(x - eyeSpacing + glanceShift, eyeY, radius * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + eyeSpacing + glanceShift, eyeY, radius * 0.9, 0, Math.PI * 2);
      ctx.fill();

      // Pupils with personality color tint
      ctx.fillStyle = pupilColor;
      const pupilRadius = radius * 0.4;
      ctx.beginPath();
      ctx.arc(x - eyeSpacing + glanceShift, pupilY, pupilRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + eyeSpacing + glanceShift, pupilY, pupilRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Shine/highlight spots (adds depth and sparkle)
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x - eyeSpacing + glanceShift - pupilRadius * 0.5, pupilY - pupilRadius * 0.5, pupilRadius * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + eyeSpacing + glanceShift - pupilRadius * 0.5, pupilY - pupilRadius * 0.5, pupilRadius * 0.35, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Oval/rectangular eyes (default/Lazy) - now with shine and glancing
      ctx.fillStyle = eyeWhiteColor;
      
      // Draw rounded rectangle eye whites
      drawRoundedRect(ctx, x - eyeSpacing + glanceShift - eyeWidth / 2, eyeY - eyeHeight / 2, eyeWidth, eyeHeight, eyeHeight / 3);
      drawRoundedRect(ctx, x + eyeSpacing + glanceShift - eyeWidth / 2, eyeY - eyeHeight / 2, eyeWidth, eyeHeight, eyeHeight / 3);

      // Pupils (only if eyes are open enough)
      if (eyeHeight > 3) {
        ctx.fillStyle = pupilColor;
        const pupilRadius = Math.max(2, eyeWidth * 0.25);
        const pupilX1 = x - eyeSpacing + glanceShift;
        const pupilX2 = x + eyeSpacing + glanceShift;
        
        ctx.beginPath();
        ctx.arc(pupilX1, pupilY, pupilRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pupilX2, pupilY, pupilRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Shine spots on pupils
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(pupilX1 - pupilRadius * 0.4, pupilY - pupilRadius * 0.4, pupilRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pupilX2 - pupilRadius * 0.4, pupilY - pupilRadius * 0.4, pupilRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Draw mouth with dynamic expression (improved shapes and shading)
  const mouthY = y + 35;
  const mouthIntensity = mouthExpr.intensity;

  switch (mouthExpr.type) {
    case "smile":
      // Happy smile - filled arc with depth
      drawSmileMouth(ctx, x, mouthY - 5, 20 * mouthIntensity);
      break;
    case "surprised":
      // O shape - open mouth
      drawSurprisedMouth(ctx, x, mouthY, 8 * mouthIntensity);
      break;
    case "frown":
      // Sad frown - arc curving downward
      drawFrownMouth(ctx, x, mouthY + 10, 20 * mouthIntensity);
      break;
    case "open":
      // Sleeping/resting - slight opening
      drawOpenMouth(ctx, x, mouthY, 8 * mouthIntensity);
      break;
    case "flat":
    default:
      // Neutral/flat mouth
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 15, mouthY);
      ctx.lineTo(x + 15, mouthY);
      ctx.stroke();
      break;
  }
}

/**
 * Enhanced particle rendering with physics-based movement
 * Hearts, sparkles, and stars float upward with gravity falloff
 */
function drawParticlesEnhanced(ctx: CanvasRenderingContext2D, x: number, y: number, particles: Particle[]) {
  particles.forEach(particle => {
    const px = x + particle.x;
    const py = y + particle.y;
    
    // Fade out as particle dies (life goes 1 -> 0)
    ctx.globalAlpha = particle.life * 0.8;
    
    switch (particle.type) {
      case "heart":
        drawHeart(ctx, px, py, 6);
        break;
      case "sparkle":
        drawSparkle(ctx, px, py, 5);
        break;
      case "star":
        drawStar(ctx, px, py, 5);
        break;
    }
  });
  
  ctx.globalAlpha = 1;
}

/**
 * Draw a heart shape (5x5 pixels)
 */
function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = "#ff6b9d";
  ctx.beginPath();
  // Simple heart (two circles + triangle)
  ctx.arc(x - size / 2, y - size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + size / 2, y - size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - size, y - size / 2);
  ctx.lineTo(x + size, y - size / 2);
  ctx.lineTo(x, y + size * 1.2);
  ctx.closePath();
  ctx.fill();
}

/**
 * Draw a sparkle/diamond shape
 */
function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = "#ffd93d";
  // Four-pointed star
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size / 2, y - size / 2);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x + size / 2, y + size / 2);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size / 2, y + size / 2);
  ctx.lineTo(x - size, y);
  ctx.lineTo(x - size / 2, y - size / 2);
  ctx.closePath();
  ctx.fill();
}

/**
 * Draw a star shape (5-pointed)
 */
function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = "#6bcf7f";
  ctx.beginPath();
  
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5;
    const radius = i % 2 === 0 ? size : size / 2;
    const px = x + Math.cos(angle - Math.PI / 2) * radius;
    const py = y + Math.sin(angle - Math.PI / 2) * radius;
    
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  
  ctx.closePath();
  ctx.fill();
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

/**
 * Draw personality-based eyebrows
 * Different styles (curved, sharp, droopy, straight) reinforce personality
 */
function drawEyebrows(ctx: CanvasRenderingContext2D, x: number, y: number, eyebrowExpr: any, eyeSpacing: number) {
  const eyebrowY = y - 8; // Above eyes
  const eyebrowHeight = eyebrowExpr.height;
  const eyebrowAngle = eyebrowExpr.angle;
  
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  
  // Left and right eyebrow positions
  const leftX = x - eyeSpacing;
  const rightX = x + eyeSpacing;
  
  switch (eyebrowExpr.type) {
    case "curved":
      // Soft curved eyebrows - Friendly personality
      ctx.beginPath();
      ctx.arc(leftX, eyebrowY + eyebrowHeight, 18, Math.PI, 0, true);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(rightX, eyebrowY + eyebrowHeight, 18, Math.PI, 0, true);
      ctx.stroke();
      break;
      
    case "sharp":
      // Pointed angled eyebrows - Energetic personality
      ctx.beginPath();
      ctx.moveTo(leftX - 15, eyebrowY + eyebrowHeight - 8);
      ctx.lineTo(leftX + 15, eyebrowY + eyebrowHeight + 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(rightX - 15, eyebrowY + eyebrowHeight - 8);
      ctx.lineTo(rightX + 15, eyebrowY + eyebrowHeight + 4);
      ctx.stroke();
      break;
      
    case "droopy":
      // Relaxed drooping eyebrows - Lazy personality
      ctx.beginPath();
      ctx.moveTo(leftX - 18, eyebrowY + eyebrowHeight - 5);
      ctx.quadraticCurveTo(leftX, eyebrowY + eyebrowHeight + 8, leftX + 18, eyebrowY + eyebrowHeight + 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(rightX - 18, eyebrowY + eyebrowHeight - 5);
      ctx.quadraticCurveTo(rightX, eyebrowY + eyebrowHeight + 8, rightX + 18, eyebrowY + eyebrowHeight + 10);
      ctx.stroke();
      break;
      
    case "straight":
      // Determined horizontal eyebrows - Stubborn personality
      ctx.beginPath();
      ctx.moveTo(leftX - 18, eyebrowY + eyebrowHeight);
      ctx.lineTo(leftX + 18, eyebrowY + eyebrowHeight);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(rightX - 18, eyebrowY + eyebrowHeight);
      ctx.lineTo(rightX + 18, eyebrowY + eyebrowHeight);
      ctx.stroke();
      break;
  }
}

/**
 * Draw cheek blushes - circles on the sides that fade based on happiness
 * Core tamagotchi aesthetic element
 */
function drawCheekBlushes(ctx: CanvasRenderingContext2D, x: number, y: number, intensity: number, personality?: string) {
  if (intensity < 0.1) return; // Don't draw if very faint
  
  // Personality-based blush color
  let blushColor = "#ff9bb5"; // Default pink
  if (personality === "Friendly") {
    blushColor = "#ffb3c1"; // Lighter pink
  } else if (personality === "Energetic") {
    blushColor = "#ff7fa0"; // More vibrant
  }
  
  ctx.fillStyle = blushColor;
  ctx.globalAlpha = intensity * 0.5; // Blushes are semi-transparent
  
  // Left cheek
  ctx.beginPath();
  ctx.arc(x - 45, y + 15, 15, 0, Math.PI * 2);
  ctx.fill();
  
  // Right cheek
  ctx.beginPath();
  ctx.arc(x + 45, y + 15, 15, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.globalAlpha = 1;
}

/**
 * Draw rounded rectangle for eye whites (softer look)
 */
function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

/**
 * Smile mouth - filled arc with subtle gradient for depth
 */
function drawSmileMouth(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  // Draw filled smile (more expressive than just stroke)
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, size, 0.2, Math.PI - 0.2);
  ctx.stroke();
  
  // Optional: add subtle fill for warmth (very light red)
  ctx.fillStyle = "rgba(255, 150, 150, 0.1)";
  ctx.beginPath();
  ctx.arc(x, y, size, 0.2, Math.PI - 0.2);
  ctx.lineTo(x + size * 0.8, y - size * 0.2);
  ctx.lineTo(x - size * 0.8, y - size * 0.2);
  ctx.closePath();
  ctx.fill();
}

/**
 * Surprised mouth - open O shape
 */
function drawSurprisedMouth(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = "#ffb3c1"; // Light pink interior
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  
  // Black outline
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * Frown mouth - sad downward arc
 */
function drawFrownMouth(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, size, Math.PI + 0.2, Math.PI * 2 - 0.2);
  ctx.stroke();
}

/**
 * Open mouth - sleeping or resting
 */
function drawOpenMouth(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = "#ffb3c1";
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI);
  ctx.lineTo(x - size, y);
  ctx.closePath();
  ctx.fill();
  
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI);
  ctx.stroke();
}

/**
 * Utility: Lighten color by percentage (for highlights)
 */
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent * 100);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

/**
 * Utility: Darken color by percentage (for shadows)
 */
function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent * 100);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}
