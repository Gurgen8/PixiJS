import { Container, Ticker, Graphics } from 'pixi.js';
import { appInstance } from '@/app/App';
import { BaseScene } from '@/scenes/BaseScene';
import { GameConfig } from '@/config/GameConfig';

export class SceneManager {
  private static currentScene: BaseScene | null = null;
  private static container: Container = new Container();
  private static overlay: Graphics = new Graphics();
  private static isTransitioning: boolean = false;

  /**
   * Must be called after App is initialized.
   */
  public static initialize(): void {
    appInstance.pixiApp.stage.addChild(SceneManager.container);

    // Setup overlay for transitions
    SceneManager.overlay.rect(0, 0, GameConfig.width, GameConfig.height);
    SceneManager.overlay.fill(0x000000);
    SceneManager.overlay.alpha = 0;
    SceneManager.overlay.visible = false;
    appInstance.pixiApp.stage.addChild(SceneManager.overlay);

    Ticker.shared.add(SceneManager.update);
  }

  /**
   * Changes the current scene to the new provided scene immediately.
   */
  public static changeScene(newScene: BaseScene): void {
    if (SceneManager.currentScene) {
      SceneManager.currentScene.destroyScene();
      SceneManager.currentScene.destroy({ children: true });
      SceneManager.container.removeChild(SceneManager.currentScene);
    }

    SceneManager.currentScene = newScene;
    SceneManager.container.addChild(SceneManager.currentScene);
  }

  /**
   * Changes the current scene to the new provided scene with a fade transition.
   */
  public static async changeSceneWithTransition(newScene: BaseScene): Promise<void> {
    if (SceneManager.isTransitioning) return;
    SceneManager.isTransitioning = true;
    SceneManager.overlay.visible = true;

    // Fade Out
    await SceneManager.fade(0, 1, 30);

    // Change Scene
    SceneManager.changeScene(newScene);

    // Optional: wait for assets to load if needed here

    // Fade In
    await SceneManager.fade(1, 0, 30);

    SceneManager.overlay.visible = false;
    SceneManager.isTransitioning = false;
  }

  private static fade(from: number, to: number, frames: number): Promise<void> {
    return new Promise((resolve) => {
      let currentFrame = 0;
      const step = (to - from) / frames;

      const onTick = () => {
        currentFrame++;
        SceneManager.overlay.alpha = from + step * currentFrame;

        if (currentFrame >= frames) {
          SceneManager.overlay.alpha = to;
          Ticker.shared.remove(onTick);
          resolve();
        }
      };

      Ticker.shared.add(onTick);
    });
  }

  public static update = (ticker: Ticker): void => {
    if (SceneManager.currentScene && !SceneManager.isTransitioning) {
      // In PixiJS v8, ticker.deltaTime gives us delta frames (where 1 = 1/60s).
      SceneManager.currentScene.update(ticker.deltaTime);
    }
  };
}
