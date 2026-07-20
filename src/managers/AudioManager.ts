import { Howl } from 'howler';

/**
 * Глобальный менеджер звука.
 * Использует Howler.js для качественного воспроизведения звуков и музыки,
 * с фоллбэком на Web Audio API для старых эффектов.
 */
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export class AudioManager {
  private static ctx: AudioContext;
  private static sounds: { [key: string]: Howl } = {};

  public static init(): void {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Инициализация Howler звуков
    if (Object.keys(this.sounds).length === 0) {
      this.sounds['bgm'] = new Howl({
        src: ['/assets/audio/bgm.mp3'],
        loop: true,
        volume: 0.3,
      });

      this.sounds['bomb_drop'] = new Howl({
        src: ['/assets/audio/bomb_drop.wav'],
        volume: 0.8,
      });

      this.sounds['powerup'] = new Howl({
        src: ['/assets/audio/powerup.wav'],
        volume: 0.7,
      });
    }
  }

  public static playBGM(): void {
    this.init();
    if (this.sounds['bgm'] && !this.sounds['bgm'].playing()) {
      this.sounds['bgm'].play();
    }
  }

  public static stopBGM(): void {
    if (this.sounds['bgm']) {
      this.sounds['bgm'].stop();
    }
  }

  public static playSound(id: string): void {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Воспроизводим качественные звуки через Howler если они есть
    if (this.sounds[id]) {
      this.sounds[id].play();
      return;
    }

    // Маппинг старых ID на новые звуки
    if (id === 'bomb') {
      this.sounds['bomb_drop']?.play();
      return;
    }

    if (id === 'explosion') {
      this.playExplosion();
      return;
    }

    if (id === 'game_over' || id === 'death') {
      this.playGameOver();
      return;
    }

    // Фоллбэк на синтезируемые звуки для старых игр (SpaceShooter, FruitCollector)
    if (id === 'shoot') {
      this.playShoot();
    } else if (id === 'catch') {
      this.playCatch();
    }
  }

  private static playShoot(): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  private static playCatch(): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  private static playExplosion(): void {
    if (!this.ctx) return;
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

  private static playGameOver(): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    // Pleasant descending tones: E4 (329.63), C4 (261.63), G3 (196.00), C3 (130.81)
    osc.frequency.setValueAtTime(329.63, now);
    osc.frequency.setValueAtTime(261.63, now + 0.15);
    osc.frequency.setValueAtTime(196.0, now + 0.3);
    osc.frequency.setValueAtTime(130.81, now + 0.45);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

    osc.start(now);
    osc.stop(now + 1.2);
  }
}
