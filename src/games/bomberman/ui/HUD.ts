import { Container, Text, TextStyle } from 'pixi.js';
import { GameConfig } from '@/config/GameConfig';

export class HUD extends Container {
  private scoreText: Text;
  private livesText: Text;
  private levelText: Text;
  private bombsText: Text;
  private pausedText: Text;

  constructor() {
    super();

    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fill: '#ffffff',
      dropShadow: {
        blur: 5,
        distance: 3,
      },
    });

    this.scoreText = new Text({ text: 'Score: 0', style });
    this.scoreText.position.set(20, 20);
    this.addChild(this.scoreText);

    this.livesText = new Text({ text: 'Lives: 3', style });
    this.livesText.position.set(20, 60);
    this.addChild(this.livesText);

    this.levelText = new Text({ text: 'Level: 1', style });
    this.levelText.position.set(20, 100);
    this.addChild(this.levelText);

    this.bombsText = new Text({ text: 'Bombs: 1', style });
    this.bombsText.position.set(20, 140);
    this.addChild(this.bombsText);

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

  public updateStats(score: number, lives: number, level: number, bombCapacity: number): void {
    this.scoreText.text = `Score: ${score}`;
    this.livesText.text = `Lives: ${lives}`;
    this.levelText.text = `Level: ${level}`;
    this.bombsText.text = `Bombs: ${bombCapacity}`;
  }

  public setPaused(isPaused: boolean): void {
    this.pausedText.visible = isPaused;
  }
}
