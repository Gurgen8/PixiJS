/**
 * Глобальный менеджер звука.
 * В будущем здесь будет загрузка и воспроизведение звуков через Web Audio API / HTML5 Audio / PixiSound.
 */
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export class AudioManager {
  private static ctx: AudioContext;

  public static init(): void {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  public static playSound(id: string): void {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (id === 'shoot') {
      this.playShoot();
    } else if (id === 'game_over') {
      this.playExplosion();
    }
  }

  private static playShoot(): void {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    // Pew sound: high pitch dropping fast
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  private static playExplosion(): void {
    const bufferSize = this.ctx.sampleRate * 0.5; // 0.5 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Apply lowpass filter for an explosion sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    const gain = this.ctx.createGain();

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    noise.start(now);
  }
}
