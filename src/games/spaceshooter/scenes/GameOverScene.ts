import { BaseScene } from '@/scenes/BaseScene';
import { InputManager } from '@/managers/InputManager';
import { GameConfig } from '@/config/GameConfig';
import { SceneManager } from '@/managers/SceneManager';
import { MainMenuScene } from '@/scenes/MainMenuScene';
import { Text, TextStyle } from 'pixi.js';
import { GameButton } from '@/ui/GameButton';

export class GameOverScene extends BaseScene {
  private titleText: Text;
  private scoreText: Text;
  private restartButton: GameButton;
  private menuButton: GameButton;

  constructor(finalScore: number, finalWave: number) {
    super();

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

    this.titleText = new Text({ text: 'GAME OVER', style: titleStyle });
    this.titleText.anchor.set(0.5);

    const scoreStyle = new TextStyle({
      fill: 0xffffff,
      fontSize: 32,
      fontFamily: 'Arial',
    });

    this.scoreText = new Text({
      text: `Score: ${finalScore} | Wave: ${finalWave}`,
      style: scoreStyle,
    });
    this.scoreText.anchor.set(0.5);

    this.restartButton = new GameButton({
      label: 'Restart',
      isActive: true,
      onClick: () => {
        // To avoid circular dependency, dynamically import SpaceShooterScene or just use it.
        // Doing dynamic import or just standard import since it's in the same folder.
        import('@/games/spaceshooter/scenes/SpaceShooterScene').then(({ SpaceShooterScene }) => {
          SceneManager.changeSceneWithTransition(new SpaceShooterScene());
        });
      },
    });

    this.menuButton = new GameButton({
      label: 'Back to Menu',
      isActive: true,
      onClick: () => {
        SceneManager.changeSceneWithTransition(new MainMenuScene());
      },
    });

    this.addChild(this.titleText);
    this.addChild(this.scoreText);
    this.addChild(this.restartButton);
    this.addChild(this.menuButton);

    this.resize(GameConfig.width, GameConfig.height);
  }

  public update(_delta: number): void {
    // Pulse game over text
    this.titleText.scale.set(1 + Math.sin(Date.now() / 300) * 0.05);

    if (InputManager.isKeyJustPressed('KeyR')) {
      import('@/games/spaceshooter/scenes/SpaceShooterScene').then(({ SpaceShooterScene }) => {
        SceneManager.changeSceneWithTransition(new SpaceShooterScene());
      });
    }
  }

  public resize(width: number, height: number): void {
    this.titleText.position.set(width / 2, height * 0.3);
    this.scoreText.position.set(width / 2, height * 0.45);

    this.restartButton.position.set(width / 2, height * 0.6);
    this.menuButton.position.set(width / 2, height * 0.7);
  }

  public destroyScene(): void {
    // Cleanup
  }
}
