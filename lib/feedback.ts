/**
 * Feedback Module - Sound & Haptic Integration
 * 
 * Single source of truth for all user feedback:
 * - Haptic vibrations (mobile)
 * - Sound effects (optional, user-controlled)
 * 
 * Design principles:
 * - Progressive enhancement (works without sound/haptics)
 * - Battery conscious (short, efficient vibrations)
 * - User preference respect (localStorage toggle)
 */

// ============================================================
// HAPTIC FEEDBACK
// ============================================================

type HapticPattern = "light" | "medium" | "heavy" | "success" | "warning" | "error" | "selection";

/**
 * Trigger haptic feedback if available
 * Uses Vibration API with fallback to no-op
 */
export function haptic(pattern: HapticPattern = "light"): void {
    // Check if vibration is supported
    if (typeof navigator === "undefined" || !navigator.vibrate) return;

    // Check user preference
    if (typeof localStorage !== "undefined" && localStorage.getItem("haptics") === "off") return;

    const patterns: Record<HapticPattern, number | number[]> = {
        light: 10,
        medium: 25,
        heavy: 50,
        success: [10, 50, 20],      // Quick double tap
        warning: [30, 20, 30],      // Alert pattern
        error: [50, 30, 50, 30, 50], // Triple pulse
        selection: 5,               // Ultra-light tap
    };

    try {
        navigator.vibrate(patterns[pattern]);
    } catch {
        // Silently fail if vibration blocked
    }
}

// ============================================================
// SOUND EFFECTS
// ============================================================

type SoundEffect =
    | "feed"        // Satisfying munch
    | "pet"         // Soft happy sound
    | "play"        // Playful bounce
    | "happy"       // Chime when hearts appear
    | "level_up"    // Achievement unlocked
    | "staking"     // Crown appears sound
    | "error";      // Failure buzz

// Audio context for Web Audio API (more performant than HTMLAudioElement)
let audioContext: AudioContext | null = null;

/**
 * Get or create AudioContext (lazy initialization)
 */
function getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        } catch {
            return null;
        }
    }
    return audioContext;
}

/**
 * Check if sound is enabled
 */
function isSoundEnabled(): boolean {
    if (typeof localStorage === "undefined") return false;
    return localStorage.getItem("sound") !== "off";
}

/**
 * Play a synthesized sound effect
 * Uses Web Audio API for low-latency, battery-efficient sounds
 */
export function playSound(effect: SoundEffect): void {
    if (!isSoundEnabled()) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === "suspended") {
        ctx.resume().catch(() => { });
    }

    const now = ctx.currentTime;

    // Sound synthesis parameters for each effect
    const effects: Record<SoundEffect, () => void> = {
        feed: () => {
            // Satisfying "munch" - low thump + crunch
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = "sine";
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

            osc.start(now);
            osc.stop(now + 0.15);
        },

        pet: () => {
            // Soft happy chirp
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = "sine";
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
            osc.frequency.exponentialRampToValueAtTime(500, now + 0.12);

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

            osc.start(now);
            osc.stop(now + 0.12);
        },

        play: () => {
            // Playful bounce - rising tone
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = "triangle";
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(500, now + 0.1);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

            osc.start(now);
            osc.stop(now + 0.1);
        },

        happy: () => {
            // Chime - two note arpeggio
            [0, 0.08].forEach((delay, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = "sine";
                osc.frequency.setValueAtTime(i === 0 ? 523 : 659, now + delay); // C5, E5

                gain.gain.setValueAtTime(0.15, now + delay);
                gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.15);

                osc.start(now + delay);
                osc.stop(now + delay + 0.15);
            });
        },

        level_up: () => {
            // Celebratory ascending arpeggio
            [0, 0.08, 0.16].forEach((delay, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = "sine";
                const notes = [523, 659, 784]; // C5, E5, G5
                osc.frequency.setValueAtTime(notes[i], now + delay);

                gain.gain.setValueAtTime(0.2, now + delay);
                gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.2);

                osc.start(now + delay);
                osc.stop(now + delay + 0.2);
            });
        },

        staking: () => {
            // Majestic crown appearance - sparkle + chime
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = "sine";
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
            osc.frequency.exponentialRampToValueAtTime(1000, now + 0.3);

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

            osc.start(now);
            osc.stop(now + 0.3);
        },

        error: () => {
            // Error buzz - low harsh tone
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(100, now);

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

            osc.start(now);
            osc.stop(now + 0.15);
        },
    };

    try {
        effects[effect]();
    } catch {
        // Silently fail if audio blocked
    }
}

// ============================================================
// COMBINED FEEDBACK TRIGGERS
// ============================================================

/**
 * Trigger feedback for common actions
 * Combines haptic + sound for maximum impact
 */
export const feedback = {
    /** Feeding donut - satisfying munch */
    onFeed: () => {
        haptic("medium");
        playSound("feed");
    },

    /** Petting donut - gentle response */
    onPet: () => {
        haptic("light");
        playSound("pet");
    },

    /** Playing with donut - bouncy feel */
    onPlay: () => {
        haptic("light");
        playSound("play");
    },

    /** Hearts/sparkles appearing */
    onHappy: () => {
        haptic("selection");
        playSound("happy");
    },

    /** DPS boost crown appears */
    onStakingUnlocked: () => {
        haptic("success");
        playSound("staking");
    },

    /** Level up / milestone reached */
    onLevelUp: () => {
        haptic("success");
        playSound("level_up");
    },

    /** Error / failure */
    onError: () => {
        haptic("error");
        playSound("error");
    },

    /** Light interaction tap */
    onTap: () => {
        haptic("selection");
    },
};

// ============================================================
// USER PREFERENCES
// ============================================================

export function setSoundEnabled(enabled: boolean): void {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem("sound", enabled ? "on" : "off");
    }
}

export function setHapticsEnabled(enabled: boolean): void {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem("haptics", enabled ? "on" : "off");
    }
}

export function getSoundEnabled(): boolean {
    if (typeof localStorage === "undefined") return true;
    return localStorage.getItem("sound") !== "off";
}

export function getHapticsEnabled(): boolean {
    if (typeof localStorage === "undefined") return true;
    return localStorage.getItem("haptics") !== "off";
}
