import { BaseScene } from './BaseScene';
import { BackgroundAnimation } from '../components/BackgroundAnimation';
import { LogoAnimation } from '../ui/LogoAnimation';
import { GameList } from '../ui/GameList';
import { GameConfig } from '../config/GameConfig';

export class MainMenuScene extends BaseScene {
  private background: BackgroundAnimation;
  private logo: LogoAnimation;
  private gameList: GameList;

  constructor() {
    super();

    // 1. Background Animation
    this.background = new BackgroundAnimation(GameConfig.width, GameConfig.height);
    this.addChild(this.background);

    // 2. Logo Animation
    this.logo = new LogoAnimation();
    this.addChild(this.logo);

    // 3. Interactive Game List
    this.gameList = new GameList([
      {
        label: 'Space Shooter',
        isActive: true,
        onClick: () => {
          console.log('Space Shooter clicked! Ready to launch the game scene.');
          // TODO: SceneManager.changeScene(...)
        },
      },
      {
        label: 'Fruit Collector',
        isActive: false,
      },
      {
        label: 'Coin Catcher',
        isActive: false,
      },
    ]);
    this.addChild(this.gameList);

    // Ensure initial placement is correct
    this.resize(GameConfig.width, GameConfig.height);
  }

  public update(delta: number): void {
    this.background.update(delta);
    this.logo.update(delta);
    this.gameList.update(delta);
  }

  public resize(width: number, height: number): void {
    this.background.resize(width, height);

    // Center logo at 25% height
    this.logo.position.set(width / 2, height * 0.25);

    // Center game list at 50% height
    this.gameList.position.set(width / 2, height * 0.45);
  }

  public destroyScene(): void {
    // Cleanup any local listeners or objects here
  }
}
