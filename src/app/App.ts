import { Application, Ticker } from 'pixi.js';
import { GameConfig } from '@/config/GameConfig';

export class App {
  private static instance: App;
  public pixiApp: Application;

  private constructor() {
    this.pixiApp = new Application();
  }

  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  public async init(canvas: HTMLCanvasElement): Promise<void> {
    await this.pixiApp.init({
      canvas: canvas,
      width: GameConfig.width,
      height: GameConfig.height,
      backgroundColor: GameConfig.backgroundColor,
      resolution: GameConfig.resolution,
      autoDensity: GameConfig.autoDensity,
    });

    // Lock ticker to max 60 fps for consistent gameplay physics
    Ticker.shared.maxFPS = 60;
  }
}

export const appInstance = App.getInstance();
