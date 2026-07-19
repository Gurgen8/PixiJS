import { BaseScene } from '@/scenes/BaseScene';
import { SceneManager } from '@/managers/SceneManager';
import { GameConfig } from '@/config/GameConfig';
import { Text, TextStyle, Graphics } from 'pixi.js';

export class GameOverScene extends BaseScene {
  private titleText: Text;
  private scoreText: Text;
  private waveText: Text;
  private retryButton: Graphics;

  constructor(finalScore: number, finalWave: number) {
    super();

    // Semi-transparent background
    const bg = new Graphics();
    bg.rect(0, 0, GameConfig.width, GameConfig.height);
    bg.fill({ color: 0x000000, alpha: 0.8 });
    this.addChild(bg);

    // Title
    this.titleText = new Text({
      text: 'GAME OVER',
      style: new TextStyle({
        fontFamily: 'Arial',
        fontSize: 64,
        fill: '#ff0000',
        fontWeight: 'bold',
        dropShadow: {
          blur: 5,
          distance: 5,
        },
      }),
    });
    this.titleText.anchor.set(0.5);
    this.addChild(this.titleText);

    // Score
    this.scoreText = new Text({
      text: `Final Score: ${finalScore}`,
      style: new TextStyle({
        fontFamily: 'Arial',
        fontSize: 32,
        fill: '#ffffff',
      }),
    });
    this.scoreText.anchor.set(0.5);
    this.addChild(this.scoreText);

    // Wave
    this.waveText = new Text({
      text: `Waves Survived: ${finalWave}`,
      style: new TextStyle({
        fontFamily: 'Arial',
        fontSize: 32,
        fill: '#ffffff',
      }),
    });
    this.waveText.anchor.set(0.5);
    this.addChild(this.waveText);

    // Main Menu Button
    this.retryButton = new Graphics();
    this.retryButton.roundRect(-100, -30, 200, 60, 15);
    this.retryButton.fill({ color: 0x333333 });
    this.retryButton.stroke({ color: 0xffffff, width: 2 });
    
    // Enable interaction
    this.retryButton.eventMode = 'static';
    this.retryButton.cursor = 'pointer';

    const btnText = new Text({
      text: 'MAIN MENU',
      style: new TextStyle({
        fontFamily: 'Arial',
        fontSize: 24,
        fill: '#ffffff',
        fontWeight: 'bold',
      }),
    });
    btnText.anchor.set(0.5);
    this.retryButton.addChild(btnText);

    // Button interactions
    this.retryButton.on('pointerdown', () => {
      import('@/scenes/MainMenuScene').then(({ MainMenuScene }) => {
        SceneManager.changeSceneWithTransition(new MainMenuScene());
      });
    });

    this.retryButton.on('pointerover', () => {
      this.retryButton.alpha = 0.8;
    });

    this.retryButton.on('pointerout', () => {
      this.retryButton.alpha = 1;
    });

    this.addChild(this.retryButton);

    this.resize(GameConfig.width, GameConfig.height);
  }

  public update(_delta: number): void {
    // Pulse animation for title
    this.titleText.scale.set(1 + Math.sin(Date.now() / 200) * 0.05);
  }

  public resize(width: number, height: number): void {
    this.titleText.position.set(width / 2, height * 0.3);
    this.scoreText.position.set(width / 2, height * 0.45);
    this.waveText.position.set(width / 2, height * 0.55);
    this.retryButton.position.set(width / 2, height * 0.7);
  }

  public destroyScene(): void {
    // Clean up
  }
}
