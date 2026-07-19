import { Container, Text, TextStyle } from 'pixi.js';
import { GameConfig } from '@/config/GameConfig';

export class HUD extends Container {
  private scoreText: Text;
  private livesText: Text;
  private waveText: Text;
  private fpsText: Text;
  private pausedText: Text;

  private style = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 24,
    fill: '#ffffff',
    dropShadow: {
      color: '#000000',
      blur: 4,
      distance: 2,
    },
  });

  constructor() {
    super();

    this.scoreText = new Text({ text: 'Score: 0', style: this.style });
    this.scoreText.position.set(20, 20);
    this.addChild(this.scoreText);

    this.livesText = new Text({ text: 'Lives: 3', style: this.style });
    this.livesText.position.set(GameConfig.width / 2 - 50, 20);
    this.addChild(this.livesText);

    this.waveText = new Text({ text: 'Wave: 1', style: this.style });
    this.waveText.position.set(GameConfig.width - 120, 20);
    this.addChild(this.waveText);

    this.fpsText = new Text({
      text: 'FPS: 0',
      style: new TextStyle({ fontFamily: 'Arial', fontSize: 16, fill: '#00ff00' }),
    });
    this.fpsText.position.set(GameConfig.width - 80, GameConfig.height - 30);
    this.addChild(this.fpsText);

    this.pausedText = new Text({
      text: 'PAUSED',
      style: new TextStyle({
        fontFamily: 'Arial',
        fontSize: 48,
        fill: '#ffff00',
        fontWeight: 'bold',
        dropShadow: {
          blur: 5,
          distance: 3,
        },
      }),
    });
    this.pausedText.anchor.set(0.5);
    this.pausedText.position.set(GameConfig.width / 2, GameConfig.height / 2);
    this.pausedText.visible = false;
    this.addChild(this.pausedText);
  }

  public updateStats(score: number, lives: number, wave: number): void {
    this.scoreText.text = `Score: ${score}`;
    this.livesText.text = `Lives: ${lives}`;
    this.waveText.text = `Wave: ${wave}`;
  }

  public updateFPS(): void {
    import('pixi.js').then(({ Ticker }) => {
      this.fpsText.text = `FPS: ${Math.round(Ticker.shared.FPS)}`;
    });
  }

  public setPaused(isPaused: boolean): void {
    this.pausedText.visible = isPaused;
  }
}
