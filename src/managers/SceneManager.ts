import { Container, Ticker } from 'pixi.js';
import { appInstance } from '../app/App';
import { BaseScene } from '../scenes/BaseScene';

export class SceneManager {
  private static currentScene: BaseScene | null = null;
  private static container: Container = new Container();

  /**
   * Must be called after App is initialized.
   */
  public static initialize(): void {
    appInstance.pixiApp.stage.addChild(SceneManager.container);
    Ticker.shared.add(SceneManager.update);
  }

  /**
   * Changes the current scene to the new provided scene.
   * Handles cleanup of the old scene automatically.
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

  public static update = (ticker: Ticker): void => {
    if (SceneManager.currentScene) {
      // In PixiJS v8, ticker.deltaTime gives us delta frames (where 1 = 1/60s).
      SceneManager.currentScene.update(ticker.deltaTime);
    }
  };
}
