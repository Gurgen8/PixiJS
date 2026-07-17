import { Container, Text, TextStyle, Ticker } from 'pixi.js';

export class HUD extends Container {
  private scoreText: Text;
  private livesText: Text;
  private waveText: Text;
  private fpsText: Text;

  constructor() {
    super();

    const style = new TextStyle({
      fill: 0xffffff,
      fontSize: 24,
      fontFamily: 'Arial',
      fontWeight: 'bold',
    });

    this.scoreText = new Text({ text: 'Score: 0', style });
    this.scoreText.position.set(20, 20);

    this.livesText = new Text({ text: 'Lives: 3', style });
    this.livesText.position.set(20, 60);

    this.waveText = new Text({ text: 'Wave: 1', style });
    this.waveText.position.set(20, 100);

    this.fpsText = new Text({ text: 'FPS: 0', style: { ...style, fontSize: 16, fill: 0xaaaaaa } });
    this.fpsText.position.set(20, 140);

    this.addChild(this.scoreText);
    this.addChild(this.livesText);
    this.addChild(this.waveText);
    this.addChild(this.fpsText);
  }

  public updateStats(score: number, lives: number, wave: number): void {
    this.scoreText.text = `Score: ${score}`;
    this.livesText.text = `Lives: ${lives}`;
    this.waveText.text = `Wave: ${wave}`;
  }

  public updateFPS(): void {
    const fps = Math.round(Ticker.shared.FPS);
    this.fpsText.text = `FPS: ${fps}`;
  }

  public setPaused(isPaused: boolean): void {
    if (isPaused && !this.getChildByName('pausedText')) {
      const pausedText = new Text({
        text: 'PAUSED',
        style: { fill: 0xffff00, fontSize: 48, fontWeight: 'bold' },
      });
      pausedText.name = 'pausedText';
      // It will just draw relative to HUD, but ideally centered.
      // GameConfig width/height is better but let's just place it statically for now
      pausedText.position.set(400, 300);
      pausedText.anchor.set(0.5);
      this.addChild(pausedText);
    } else if (!isPaused) {
      const pt = this.getChildByName('pausedText');
      if (pt) this.removeChild(pt);
    }
  }
}
