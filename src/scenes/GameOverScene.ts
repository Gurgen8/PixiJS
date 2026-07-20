import { BaseScene } from '@/scenes/BaseScene';
import { GameConfig } from '@/config/GameConfig';
import { SceneManager } from '@/managers/SceneManager';
import { MainMenuScene } from '@/scenes/MainMenuScene';
import { Text, TextStyle, Graphics } from 'pixi.js';
import { GameButton } from '@/ui/GameButton';

export interface GameOverConfig {
  title?: string;
  stats: string[];
  onRestart: () => void;
}

export class GameOverScene extends BaseScene {
  private titleText: Text;
  private statTexts: Text[] = [];
  private restartButton: GameButton;
  private menuButton: GameButton;

  constructor(config: GameOverConfig) {
    super();

    // Semi-transparent background
    const bg = new Graphics();
    bg.rect(0, 0, GameConfig.width, GameConfig.height);
    bg.fill({ color: 0x000000, alpha: 0.8 });
    this.addChild(bg);

    const titleStyle = new TextStyle({
      fill: 0xff4444,
      fontSize: 72,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      dropShadow: {
        alpha: 0.5,
        blur: 10,
        color: 0x000000,
        distance: 5,
      },
    });

    this.titleText = new Text({ text: config.title || 'GAME OVER', style: titleStyle });
    this.titleText.anchor.set(0.5);
    this.addChild(this.titleText);

    const statStyle = new TextStyle({
      fill: 0xffffff,
      fontSize: 32,
      fontFamily: 'Arial',
    });

    // Generate stats dynamically
    config.stats.forEach((statText) => {
      const textObj = new Text({ text: statText, style: statStyle });
      textObj.anchor.set(0.5);
      this.statTexts.push(textObj);
      this.addChild(textObj);
    });

    this.restartButton = new GameButton({
      label: 'Restart',
      isActive: true,
      onClick: config.onRestart,
    });

    this.menuButton = new GameButton({
      label: 'Back to Menu',
      isActive: true,
      onClick: () => {
        SceneManager.changeSceneWithTransition(new MainMenuScene());
      },
    });

    this.addChild(this.restartButton);
    this.addChild(this.menuButton);

    this.resize(GameConfig.width, GameConfig.height);
  }

  public update(_delta: number): void {
    // Pulse game over text
    this.titleText.scale.set(1 + Math.sin(Date.now() / 300) * 0.05);
  }

  public resize(width: number, height: number): void {
    this.titleText.position.set(width / 2, height * 0.25);

    // Position stat texts dynamically
    let currentY = height * 0.4;
    this.statTexts.forEach((textObj) => {
      textObj.position.set(width / 2, currentY);
      currentY += 50;
    });

    // Position buttons below the stats
    this.restartButton.position.set(width / 2, currentY + 40);
    this.menuButton.position.set(width / 2, currentY + 110);
  }

  public destroyScene(): void {
    // Cleanup
  }
}
