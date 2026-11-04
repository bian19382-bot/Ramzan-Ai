/**
 * High-Fidelity Synthesized Web Audio Engine
 * Provides tactile, futuristic sound effects for:
 * - Colliding Sparks impact & bursts
 * - Font & typography crystalline harmonics
 * - Card & box hover micro-ticks
 * - Tactile button clicks
 * - Bar & slider interactions
 * - Modal & panel opening/closing
 *
 * 100% synthesized procedural audio using Web Audio API:
 * 0ms latency, zero external asset downloads, zero 404s, works offline.
 */

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.65;
  private initialized: boolean = false;
  private lastPlayTimes: Record<string, number> = {};

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('ramzan_sound_enabled');
        this.isMuted = stored === 'false';
      } catch {}
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public initUserGesture() {
    this.getContext();
    this.initialized = true;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ramzan_sound_enabled', this.isMuted ? 'false' : 'true');
      } catch {}
    }
    if (!this.isMuted) {
      this.playButtonClick();
    }
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ramzan_sound_enabled', muted ? 'false' : 'true');
      } catch {}
    }
  }

  /**
   * Throttles identical sounds within a given millisecond threshold
   */
  private canPlay(key: string, cooldownMs = 60): boolean {
    if (this.isMuted) return false;
    const now = Date.now();
    const last = this.lastPlayTimes[key] || 0;
    if (now - last < cooldownMs) return false;
    this.lastPlayTimes[key] = now;
    return true;
  }

  /**
   * 1. COLLIDING SPARKS SOUND
   * Dual energetic frequency streams colliding at high kinetic velocity,
   * triggering electric spark sizzle, white-noise crackle, and resonant harmonic chime.
   */
  public playSparkCollision() {
    if (!this.canPlay('sparks', 200)) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.35 * this.volume, now);
    master.connect(ctx.destination);

    // Left converging spark stream (sweeps from 280Hz up to 1200Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(280, now);
    osc1.frequency.exponentialRampToValueAtTime(1400, now + 0.12);
    gain1.gain.setValueAtTime(0.01, now);
    gain1.gain.linearRampToValueAtTime(0.25, now + 0.1);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(master);

    // Right converging spark stream (sweeps from 1800Hz down to 800Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1800, now);
    osc2.frequency.exponentialRampToValueAtTime(750, now + 0.12);
    gain2.gain.setValueAtTime(0.01, now);
    gain2.gain.linearRampToValueAtTime(0.25, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(master);

    // Collision Flash & Spark Sizzle (Filtered white noise burst at impact)
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(3200, now + 0.1);
    noiseFilter.Q.setValueAtTime(4.0, now + 0.1);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.setValueAtTime(0.28, now + 0.1);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);

    // Resonant crystalline chime decay (bell-like ring)
    const bell = ctx.createOscillator();
    const bellGain = ctx.createGain();
    bell.type = 'sine';
    bell.frequency.setValueAtTime(1760, now + 0.11); // A6
    bellGain.gain.setValueAtTime(0.001, now);
    bellGain.gain.setValueAtTime(0.2, now + 0.12);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
    bell.connect(bellGain);
    bellGain.connect(master);

    osc1.start(now);
    osc2.start(now);
    noise.start(now + 0.1);
    bell.start(now + 0.11);

    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
    noise.stop(now + 0.32);
    bell.stop(now + 0.7);
  }

  /**
   * 2. BOX / CARD HOVER SOUND
   * Soft, subtle high-tech acoustic micro-tick for cards, boxes, and containers.
   */
  public playCardHover() {
    if (!this.canPlay('cardHover', 45)) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.035);

    gain.gain.setValueAtTime(0.05 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  /**
   * 3. FONT / TYPOGRAPHY HOVER SOUND
   * Crystalline resonant micro-harmonic chime when hovering over headings, titles, and text.
   */
  public playFontHover() {
    if (!this.canPlay('fontHover', 55)) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Harmonic notes: D6, F#6, A6, C#7
    const notes = [1174.66, 1479.98, 1760.0, 2217.46];
    const freq = notes[Math.floor(Math.random() * notes.length)];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.045 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  /**
   * 4. BUTTON / INTERACTION CLICK SOUND
   * Crisp, tactile futuristic mechanical click.
   */
  public playButtonClick() {
    if (!this.canPlay('click', 40)) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Body punch
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.04);

    gain.gain.setValueAtTime(0.18 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    // High transient snap
    const snap = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snap.type = 'triangle';
    snap.frequency.setValueAtTime(2400, now);
    snap.frequency.exponentialRampToValueAtTime(600, now + 0.02);

    snapGain.gain.setValueAtTime(0.12 * this.volume, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    snap.connect(snapGain);
    snapGain.connect(ctx.destination);

    osc.start(now);
    snap.start(now);
    osc.stop(now + 0.05);
    snap.stop(now + 0.03);
  }

  /**
   * 5. BAR / PROGRESS / SLIDER SOUND
   * High-precision mechanical micro-tick for progress indicators and filter bars.
   */
  public playBarTick() {
    if (!this.canPlay('barTick', 35)) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(980, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.02);

    gain.gain.setValueAtTime(0.04 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  /**
   * 6. TAB SWITCH / NAVIGATION SOUND
   * Sleek cyber frequency glide.
   */
  public playTabSwitch() {
    if (!this.canPlay('tabSwitch', 60)) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(760, now + 0.07);

    gain.gain.setValueAtTime(0.12 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  /**
   * 7. MODAL / DIALOG CLOSE SOUND
   * Smooth downward frequency dissipation.
   */
  public playClose() {
    if (!this.canPlay('close', 80)) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);

    gain.gain.setValueAtTime(0.12 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }
}

export const soundFx = new SoundEffectsEngine();

/**
 * Initializes automatic global event listeners so all cards, boxes,
 * fonts, headings, and buttons automatically produce their unique sound.
 */
export function initGlobalSoundListeners(): () => void {
  if (typeof window === 'undefined') return () => {};

  const handlePointerDown = () => {
    soundFx.initUserGesture();
  };

  const handleMouseOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Font / Typography Hover Sound
    if (
      target.matches('h1, h2, h3, h4, h5, h6, [data-font-sound]') ||
      target.closest('h1, h2, h3, h4, h5, h6, [data-font-sound]')
    ) {
      soundFx.playFontHover();
      return;
    }

    // Box / Card / Project Card / Category Button Hover Sound
    if (
      target.matches('[data-card], .group, article, .glass-panel, [data-box-sound]') ||
      target.closest('[data-card], article, [data-box-sound]')
    ) {
      soundFx.playCardHover();
      return;
    }

    // Button / Navigation Link Hover Sound
    if (target.matches('button, a, input, select, [role="button"]')) {
      soundFx.playCardHover();
    }
  };

  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const clickable = target.closest('button, a, input[type="submit"], [role="button"], [data-clickable]');
    if (clickable) {
      soundFx.playButtonClick();
    }
  };

  window.addEventListener('pointerdown', handlePointerDown, { passive: true });
  document.addEventListener('mouseover', handleMouseOver, { passive: true });
  document.addEventListener('click', handleClick, { passive: true });

  return () => {
    window.removeEventListener('pointerdown', handlePointerDown);
    document.removeEventListener('mouseover', handleMouseOver);
    document.removeEventListener('click', handleClick);
  };
}
