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
  calculateLimbExpression,
  getEyeAppearance,
  spawnParticles,
  updateParticle,
  calculateIdleQuirk,
  getQuirkTransform,
  calculateStakingAura,
  type Particle,
  type StakingAura,
} from "@/lib/physics";
import { feedback } from "@/lib/feedback";

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
  hasDpsBoost?: boolean;
}

export function DonutPet({ state, happiness, health, isAnimating, gesture, onGestureComplete, traits, createdAtSeconds, hasDpsBoost = false }: DonutPetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const gestureFrameRef = useRef(0);
  const gestureCompleteRef = useRef(onGestureComplete);

  // Physics state for jump/bounce
  const jumpStateRef = useRef({ y: 0, vy: 0 });

  // Particle system for happy/excited states
  const particlesRef = useRef<Particle[]>([]);
  const lastParticleSpawnRef = useRef(0);

  // Track previous DPS boost state for sound trigger
  const prevDpsBoostRef = useRef(hasDpsBoost);

  // DPS boost unlock sound (only plays once when unlocked)
  useEffect(() => {
    if (hasDpsBoost && !prevDpsBoostRef.current) {
      feedback.onStakingUnlocked();
    }
    prevDpsBoostRef.current = hasDpsBoost;
  }, [hasDpsBoost]);

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
      const baseRadius = 85; // Slightly larger base

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

      // Calculate idle quirks (personality-specific behaviors)
      const personality = traits?.personality || "Friendly";
      const idleQuirk = calculateIdleQuirk(personality, frameRef.current, state);
      const quirkTransform = getQuirkTransform(idleQuirk);

      // Calculate staking aura (for DPS boosted users)
      const stakingAura = calculateStakingAura(hasDpsBoost, frameRef.current);

      // Apply quirk transforms (unless gesture is active)
      if (!gesture && idleQuirk.type) {
        offsetY += quirkTransform.offsetY;
        rotation += quirkTransform.rotation;
        scale *= quirkTransform.scaleX; // Apply horizontal squash
      }

      ctx.save();
      ctx.translate(centerX + offsetX, centerY + offsetY);
      ctx.rotate(rotation);
      ctx.scale(scale * quirkTransform.scaleX, scale * quirkTransform.scaleY);

      // Lifecycle-based donut size (smaller when young)
      const sizeMultiplier = lifecycleInfo?.stage === "birth" ? 0.7 : lifecycleInfo?.stage === "growth" ? 0.85 : 1;
      const actualRadius = radius * sizeMultiplier;

      // STAKING AURA: Draw glow behind donut
      if (stakingAura.active) {
        drawStakingAura(ctx, 0, 0, actualRadius, stakingAura);
      }

      // Draw donut body with trait-based coloring and depth shading
      const donutColor = getDonutColor(state, health, traits);

      // KAWAII UPGRADE: Softer gradients and outlines
      const bodyGradient = ctx.createRadialGradient(
        -actualRadius * 0.3, -actualRadius * 0.3, 0,
        0, 0, actualRadius
      );
      bodyGradient.addColorStop(0, lightenColor(donutColor, 0.3)); // Brighter highlight
      bodyGradient.addColorStop(0.4, donutColor);
      bodyGradient.addColorStop(1, darkenColor(donutColor, 0.1));

      ctx.beginPath();
      ctx.arc(0, 0, actualRadius, 0, Math.PI * 2);
      ctx.fillStyle = bodyGradient;
      ctx.fill();

      // Softer outline
      ctx.strokeStyle = darkenColor(donutColor, 0.4);
      ctx.lineWidth = 3;
      ctx.stroke();

      // KAWAII UPGRADE: Add a glossy shine
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.beginPath();
      ctx.ellipse(-actualRadius * 0.4, -actualRadius * 0.4, 15, 8, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw donut hole (scales with size)
      ctx.beginPath();
      ctx.arc(0, 0, actualRadius * 0.28, 0, Math.PI * 2); // Smaller hole for cuteness
      ctx.fillStyle = "#2a1505"; // Dark chocolate center
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

      // Draw limbs (arms and feet) - KAWAII UPGRADE: Nubs instead of sticks
      const limbExpr = calculateLimbExpression(state, frameRef.current);
      drawKawaiiLimbs(ctx, 0, 0, actualRadius, limbExpr);

      // Draw face with expression-based eyes and mouth
      // Pass quirk transforms for yawn/doze eye effects
      drawFaceKawaii(ctx, 0, 0, state, frameRef.current, traits, quirkTransform);

      // STAKING CROWN: Draw floating crown above donut
      if (stakingAura.active) {
        drawStakingCrown(ctx, 0, -actualRadius - 25, stakingAura);
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
  }, [state, health, isAnimating, gesture, traits, lifecycleInfo, hasDpsBoost]);

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
  if (state === "dead") return "#9ca3af";
  if (state === "bored") return "#e8c4a0";
  if (health < 30) return "#d4a574";

  // Use trait-based coloring if available
  if (traits) {
    const baseColor = getColorHex(traits.coloring);
    return baseColor;
  }

  return "#f4a460";
}

function drawFrosting(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, state: PetState, traits?: Traits | null, lifecycleInfo?: any) {
  const frostingColor = state === "dead" ? "#cbd5e1" : traits?.personality === "Friendly" ? "#fbcfe8" : "#f472b6"; // Lighter pastel pinks

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
    const colors = ["#ff6b9d", "#ffd93d", "#6bcf7f", "#4ecdc4", "#fff"]; // Added white for variety

    for (let i = 0; i < sprinkleCount; i++) {
      const angle = (i / sprinkleCount) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 30 + Math.random() * 20;
      ctx.fillStyle = colors[i % colors.length];

      // KAWAII UPGRADE: Personality-based sprinkle shapes
      const personality = traits?.personality || "Friendly";

      if (personality === "Friendly") {
        // Hearts for friendly
        drawTinyHeart(ctx, x + Math.cos(angle) * dist, y + Math.sin(angle) * 10, 4);
      } else if (personality === "Energetic") {
        // Stars for energetic
        drawTinyStar(ctx, x + Math.cos(angle) * dist, y + Math.sin(angle) * 10, 4);
      } else if (personality === "Stubborn") {
        // Diamonds/Squares for stubborn
        const sx = x + Math.cos(angle) * dist;
        const sy = y + Math.sin(angle) * 10;
        ctx.beginPath();
        ctx.rect(sx - 2, sy - 2, 4, 4);
        ctx.fill();
      } else {
        // Simple circles for Lazy/Default
        ctx.beginPath();
        ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * 10, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawTinyHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  ctx.moveTo(x, y + size / 2);
  ctx.bezierCurveTo(x - size, y - size / 2, x - size, y - size, x, y - size);
  ctx.bezierCurveTo(x + size, y - size, x + size, y - size / 2, x, y + size / 2);
  ctx.fill();
}

function drawTinyStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * KAWAII UPGRADE: Face Drawing
 * Massive eyes, tiny nose/mouth, sparkles
 */
function drawFaceKawaii(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  state: PetState,
  frame: number,
  traits?: Traits | null,
  quirkTransform?: { eyeSquint: number; mouthOpen: number }
) {
  const eyeY = y + 10; // Lower eyes slightly for "cute forehead" look
  const eyeSpacing = 24; // Closer together
  const baseEyeSize = 28; // MUCH larger eyes (was 20x16)

  // Get expression state from physics engine
  const eyeExpr = calculateEyeExpression(state, frame);
  const mouthExpr = calculateMouthExpression(state, frame);
  const eyebrowExpr = traits ? calculateEyebrowExpression(traits.personality, state, frame) : null;
  const eyeAppearance = traits ? getEyeAppearance(traits.personality) : null;

  // Apply quirk-based eye squint (for yawn/doze)
  const quirkSquint = quirkTransform?.eyeSquint || 0;
  const effectiveEyeHeight = eyeExpr.height * (1 - quirkSquint);

  // Draw cheek blushes (key to cuteness) - larger and softer
  const blushIntensity = Math.max(0.2, effectiveEyeHeight * 0.8);
  drawCheekBlushesKawaii(ctx, x, y + 12, blushIntensity, traits?.personality);

  // Draw eyebrows before eyes (so eyes render on top)
  if (eyebrowExpr && !("sleeping".includes(state) || "dead".includes(state))) {
    drawEyebrowsKawaii(ctx, x, y - 5, eyebrowExpr, eyeSpacing);
  }

  // Special case: dead pets get X eyes (classic)
  if (state === "dead") {
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    ctx.beginPath();
    // Left X
    ctx.moveTo(x - eyeSpacing - 8, eyeY - 8);
    ctx.lineTo(x - eyeSpacing + 8, eyeY + 8);
    ctx.moveTo(x - eyeSpacing + 8, eyeY - 8);
    ctx.lineTo(x - eyeSpacing - 8, eyeY + 8);
    // Right X
    ctx.moveTo(x + eyeSpacing - 8, eyeY - 8);
    ctx.lineTo(x + eyeSpacing + 8, eyeY + 8);
    ctx.moveTo(x + eyeSpacing + 8, eyeY - 8);
    ctx.lineTo(x + eyeSpacing - 8, eyeY + 8);
    ctx.stroke();
  } else if (state === "sleeping") {
    // Sleeping: curved lines (happy sleep)
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x - eyeSpacing, eyeY + 2, 10, Math.PI, 0); // U shape
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + eyeSpacing, eyeY + 2, 10, Math.PI, 0); // U shape
    ctx.stroke();
  } else {
    // Draw Anime Eyes with quirk-adjusted height
    const eyeWidth = baseEyeSize * eyeExpr.width;
    const eyeHeight = baseEyeSize * effectiveEyeHeight; // Apply squint
    const pupilY = eyeY + eyeExpr.pupilOffset * 4;

    const pupilColor = eyeAppearance?.pupilColor || "#1e1e1e";

    // Left Eye
    drawAnimeEye(ctx, x - eyeSpacing, eyeY, eyeWidth, eyeHeight, pupilColor, eyeExpr.glanceOffset);
    // Right Eye
    drawAnimeEye(ctx, x + eyeSpacing, eyeY, eyeWidth, eyeHeight, pupilColor, eyeExpr.glanceOffset);
  }

  // Draw mouth - smaller and higher up
  // Apply quirk-based mouth open (for yawn)
  const quirkMouthOpen = quirkTransform?.mouthOpen || 0;
  const mouthY = y + 22; // Closer to eyes
  const mouthIntensity = mouthExpr.intensity;

  // Override mouth for yawn quirk
  if (quirkMouthOpen > 0.3) {
    drawYawnMouth(ctx, x, mouthY, 10 * quirkMouthOpen);
  } else {
    switch (mouthExpr.type) {
      case "smile":
        drawKawaiiSmile(ctx, x, mouthY, 12 * mouthIntensity); // Smaller smile
        break;
      case "surprised":
        drawSurprisedMouth(ctx, x, mouthY, 6 * mouthIntensity); // Smaller O
        break;
      case "frown":
        drawFrownMouth(ctx, x, mouthY + 5, 12 * mouthIntensity);
        break;
      case "open":
        drawOpenMouth(ctx, x, mouthY, 6 * mouthIntensity);
        break;
      case "flat":
      default:
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 5, mouthY);
        ctx.lineTo(x + 5, mouthY);
        ctx.stroke();
        break;
    }
  }
}

/**
 * Draws a detailed Anime/Kawaii style eye
 */
function drawAnimeEye(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, glance: number) {
  if (h < 2) {
    // Blink line
    ctx.strokeStyle = "#1e1e1e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y);
    ctx.lineTo(x + w / 2, y);
    ctx.stroke();
    return;
  }

  // Eye shape (tall oval)
  ctx.fillStyle = color;

  // Glance shift
  const gx = glance * 4;

  ctx.beginPath();
  ctx.ellipse(x + gx, y, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Highlights (The "Sparkle")
  ctx.fillStyle = "#fff";

  // Big top-left shine
  ctx.beginPath();
  ctx.ellipse(x + gx - w * 0.15, y - h * 0.2, w * 0.15, h * 0.12, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  // Small bottom-right shine
  ctx.beginPath();
  ctx.arc(x + gx + w * 0.15, y + h * 0.15, w * 0.08, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Enhanced particle rendering with physics-based movement
 */
function drawParticlesEnhanced(ctx: CanvasRenderingContext2D, x: number, y: number, particles: Particle[]) {
  particles.forEach(particle => {
    const px = x + particle.x;
    const py = y + particle.y;

    ctx.globalAlpha = particle.life * 0.9;

    switch (particle.type) {
      case "heart":
        drawHeart(ctx, px, py, 8); // Slightly bigger
        break;
      case "sparkle":
        drawSparkle(ctx, px, py, 6);
        break;
      case "star":
        drawStar(ctx, px, py, 6);
        break;
    }
  });

  ctx.globalAlpha = 1;
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = "#ff6b9d";
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.5);
  ctx.bezierCurveTo(x - size, y - size * 0.5, x - size, y - size * 1.5, x, y - size * 1.5);
  ctx.bezierCurveTo(x + size, y - size * 1.5, x + size, y - size * 0.5, x, y + size * 0.5);
  ctx.fill();
}

function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = "#ffd93d";
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.quadraticCurveTo(x, y, x + size, y);
  ctx.quadraticCurveTo(x, y, x, y + size);
  ctx.quadraticCurveTo(x, y, x - size, y);
  ctx.quadraticCurveTo(x, y, x, y - size);
  ctx.fill();
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = "#6bcf7f";
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const px = x + Math.cos(angle) * size;
    const py = y + Math.sin(angle) * size;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function drawBoreIndicators(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  const zCount = 3;
  for (let i = 0; i < zCount; i++) {
    const offset = (frame + i * 30) % 150;
    const zX = x + Math.sin(offset * 0.05) * 10 + 40; // Floating away to side
    const zY = y - 30 - offset * 0.8;
    const zAlpha = Math.max(0, 1 - offset / 120);

    ctx.fillStyle = `rgba(100, 116, 139, ${zAlpha})`;
    ctx.font = "bold 20px Comic Sans MS, rounded, sans-serif"; // Cuter font fallback
    ctx.fillText("z", zX, zY);
  }
}

/**
 * KAWAII UPGRADE: Limbs
 * Short, rounded nubs instead of sticks
 */
function drawKawaiiLimbs(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, limbExpr: any) {
  // Shorter, rounder dimensions
  const armSize = 14;
  const armDistance = radius * 0.65;

  const footSize = 12;
  const footDistance = radius * 0.4;

  ctx.fillStyle = "#7c2d12"; // Darker brown for limbs

  // Left Arm (Nub)
  ctx.save();
  ctx.translate(x - armDistance, y + limbExpr.armYOffset * 0.5);
  ctx.rotate(limbExpr.leftArmRotation);
  ctx.beginPath();
  ctx.ellipse(-armSize / 2, 0, armSize, armSize / 1.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Right Arm (Nub)
  ctx.save();
  ctx.translate(x + armDistance, y + limbExpr.armYOffset * 0.5);
  ctx.rotate(limbExpr.rightArmRotation);
  ctx.beginPath();
  ctx.ellipse(armSize / 2, 0, armSize, armSize / 1.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Feet (Small nubs at bottom)
  ctx.beginPath();
  ctx.ellipse(x - footDistance, y + radius - 5, footSize, footSize / 1.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(x + footDistance, y + radius - 5, footSize, footSize / 1.5, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawEyebrowsKawaii(ctx: CanvasRenderingContext2D, x: number, y: number, eyebrowExpr: any, eyeSpacing: number) {
  const eyebrowY = y - 12;

  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  const leftX = x - eyeSpacing;
  const rightX = x + eyeSpacing;

  // Simplified cute eyebrows (small dashes or curves)
  ctx.beginPath();
  if (eyebrowExpr.type === "straight" || eyebrowExpr.type === "sharp") {
    ctx.moveTo(leftX - 8, eyebrowY);
    ctx.lineTo(leftX + 8, eyebrowY + 2);
    ctx.moveTo(rightX - 8, eyebrowY + 2);
    ctx.lineTo(rightX + 8, eyebrowY);
  } else {
    ctx.arc(leftX, eyebrowY + 4, 8, Math.PI * 1.1, Math.PI * 1.9);
    ctx.moveTo(rightX + 8, eyebrowY + 2); // Start for next arc
    ctx.arc(rightX, eyebrowY + 4, 8, Math.PI * 1.1, Math.PI * 1.9);
  }
  ctx.stroke();
}

function drawCheekBlushesKawaii(ctx: CanvasRenderingContext2D, x: number, y: number, intensity: number, personality?: string) {
  if (intensity < 0.1) return;

  let blushColor = "#fda4af"; // Soft pink
  if (personality === "Friendly") blushColor = "#f9a8d4";
  if (personality === "Energetic") blushColor = "#fb7185";
  if (personality === "Lazy") blushColor = "#fbcfe8";

  ctx.fillStyle = blushColor;
  ctx.globalAlpha = intensity * 0.6;

  if (personality === "Energetic") {
    // Anime-style hash marks for high energy
    ctx.strokeStyle = blushColor;
    ctx.lineWidth = 2;
    // Left
    ctx.beginPath();
    ctx.moveTo(x - 55, y - 5); ctx.lineTo(x - 45, y + 5);
    ctx.moveTo(x - 50, y - 5); ctx.lineTo(x - 40, y + 5);
    ctx.stroke();
    // Right
    ctx.beginPath();
    ctx.moveTo(x + 45, y - 5); ctx.lineTo(x + 55, y + 5);
    ctx.moveTo(x + 40, y - 5); ctx.lineTo(x + 50, y + 5);
    ctx.stroke();
  } else if (personality === "Stubborn") {
    // Small intense dots
    ctx.beginPath();
    ctx.arc(x - 50, y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 50, y, 8, 0, Math.PI * 2);
    ctx.fill();
  } else if (personality === "Lazy") {
    // Lower, sleepy blushes
    ctx.beginPath();
    ctx.ellipse(x - 50, y + 5, 15, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 50, y + 5, 15, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Friendly/Default: Large soft ovals with shine
    // Left cheek
    ctx.beginPath();
    ctx.ellipse(x - 50, y, 18, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Right cheek
    ctx.beginPath();
    ctx.ellipse(x + 50, y, 18, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Add some white shines on cheeks for extra cuteness
    ctx.globalAlpha = intensity * 0.8;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x - 55, y - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 55, y - 3, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}

function drawKawaiiSmile(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";

  // "3" mouth shape or simple small cat mouth
  ctx.beginPath();
  // Simple 'u' shape but small
  ctx.arc(x, y, size, 0.1, Math.PI - 0.1);
  ctx.stroke();
}

function drawSurprisedMouth(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = "#fda4af";
  ctx.beginPath();
  ctx.ellipse(x, y, size, size * 1.2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function drawFrownMouth(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(x, y + size, size, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
}

function drawOpenMouth(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = "#fda4af";
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent * 100);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent * 100);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// ============================================================
// YAWN MOUTH - Special mouth for yawn quirk
// ============================================================

function drawYawnMouth(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  // Wide open oval mouth for yawning
  ctx.fillStyle = "#fda4af"; // Pink inner mouth
  ctx.beginPath();
  ctx.ellipse(x, y + 2, size * 0.8, size, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dark outline
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Small tongue at bottom
  ctx.fillStyle = "#f472b6";
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.5, size * 0.3, size * 0.2, 0, 0, Math.PI);
  ctx.fill();
}

// ============================================================
// STAKING AURA - Glow effect for DPS boosted users
// ============================================================

function drawStakingAura(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  aura: StakingAura
) {
  if (!aura.active) return;

  // Outer glow - pulsing golden aura
  const glowRadius = radius + 20 + aura.glowIntensity * 10;
  const gradient = ctx.createRadialGradient(x, y, radius, x, y, glowRadius);
  gradient.addColorStop(0, `rgba(255, 215, 0, ${aura.glowIntensity * 0.4})`);
  gradient.addColorStop(0.5, `rgba(255, 183, 0, ${aura.glowIntensity * 0.2})`);
  gradient.addColorStop(1, "rgba(255, 215, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  // Orbiting sparkles
  const sparkleCount = 4;
  for (let i = 0; i < sparkleCount; i++) {
    const angle = aura.particleAngle + (i / sparkleCount) * Math.PI * 2;
    const orbitRadius = radius + 15;
    const sx = x + Math.cos(angle) * orbitRadius;
    const sy = y + Math.sin(angle) * orbitRadius;

    ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + Math.sin(aura.pulsePhase * Math.PI * 2 + i) * 0.3})`;

    // Diamond/sparkle shape
    ctx.beginPath();
    ctx.moveTo(sx, sy - 4);
    ctx.lineTo(sx + 3, sy);
    ctx.lineTo(sx, sy + 4);
    ctx.lineTo(sx - 3, sy);
    ctx.closePath();
    ctx.fill();
  }
}

// ============================================================
// STAKING CROWN - Floating crown for DPS boosted users
// ============================================================

function drawStakingCrown(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  aura: StakingAura
) {
  if (!aura.active) return;

  const crownY = y + aura.crownBob;
  const crownWidth = 30;
  const crownHeight = 18;

  ctx.save();
  ctx.translate(x, crownY);

  // Crown base (golden)
  ctx.fillStyle = "#ffd700";
  ctx.strokeStyle = "#b8860b";
  ctx.lineWidth = 2;

  // Draw crown shape
  ctx.beginPath();
  ctx.moveTo(-crownWidth / 2, crownHeight / 2);           // Bottom left
  ctx.lineTo(-crownWidth / 2, -crownHeight / 4);          // Left side
  ctx.lineTo(-crownWidth / 4, crownHeight / 6);           // First valley
  ctx.lineTo(-crownWidth / 6, -crownHeight / 2);          // Left peak
  ctx.lineTo(0, crownHeight / 6);                          // Center valley
  ctx.lineTo(crownWidth / 6, -crownHeight / 2);           // Right peak
  ctx.lineTo(crownWidth / 4, crownHeight / 6);            // Right valley
  ctx.lineTo(crownWidth / 2, -crownHeight / 4);           // Right side
  ctx.lineTo(crownWidth / 2, crownHeight / 2);            // Bottom right
  ctx.closePath();

  ctx.fill();
  ctx.stroke();

  // Crown jewels (small circles at peaks)
  const jewelColors = ["#ff6b9d", "#4ecdc4", "#ff6b9d"];
  const jewelPositions = [
    { x: -crownWidth / 6, y: -crownHeight / 2 + 4 },
    { x: 0, y: -crownHeight / 2 + 8 },
    { x: crownWidth / 6, y: -crownHeight / 2 + 4 },
  ];

  jewelPositions.forEach((pos, i) => {
    ctx.fillStyle = jewelColors[i];
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
    ctx.fill();

    // Jewel shine
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.beginPath();
    ctx.arc(pos.x - 1, pos.y - 1, 1, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}