import { BaseScene } from '@/scenes/BaseScene';
import { Basket } from '@/games/fruitcollector/entities/Basket';
import { HUD } from '@/games/fruitcollector/ui/HUD';
import { ItemSpawner } from '@/games/fruitcollector/systems/ItemSpawner';
import { CollisionSystem } from '@/games/fruitcollector/systems/CollisionSystem';
import { GameManager } from '@/games/fruitcollector/GameManager';
import { SceneManager } from '@/managers/SceneManager';
import { GameOverScene } from '@/scenes/GameOverScene';
import { GameConfig } from '@/config/GameConfig';
import { Container } from 'pixi.js';
import { InputManager } from '@/managers/InputManager';

export class FruitCollectorScene extends BaseScene {
  private basket: Basket;
  private hud: HUD;
  private itemSpawner: ItemSpawner;
  private gameManager: GameManager;

  private gameLayer: Container;
  private uiLayer: Container;

  constructor() {
    super();

    this.gameLayer = new Container();
    this.uiLayer = new Container();

    this.addChild(this.gameLayer);
    this.addChild(this.uiLayer);

    // Systems
    this.itemSpawner = new ItemSpawner(this.gameLayer);

    // Entities
    this.basket = new Basket();
    this.gameLayer.addChild(this.basket);

    // UI
    this.hud = new HUD();
    this.uiLayer.addChild(this.hud);

    // Manager
    this.gameManager = new GameManager(this.itemSpawner, this.hud, this.basket, () =>
      this.onGameOver(),
    );

    this.resize(GameConfig.width, GameConfig.height);
    this.gameManager.startGame();
  }

  public update(delta: number): void {
    this.hud.updateFPS();

    if (this.gameManager.isGameOver) return;

    if (InputManager.isKeyJustPressed('KeyP') || InputManager.isKeyJustPressed('Escape')) {
      this.gameManager.togglePause();
      this.hud.setPaused(this.gameManager.isPaused);
    }

    if (InputManager.isKeyJustPressed('KeyR')) {
      this.gameManager.startGame();
      this.hud.setPaused(false);
      this.itemSpawner.clear();
      return;
    }

    if (this.gameManager.isPaused) return;

    this.basket.update(delta);
    this.itemSpawner.update(delta);

    CollisionSystem.update(this.basket, this.itemSpawner, this.gameManager);

    this.hud.updateFPS();
  }

  public resize(_width: number, _height: number): void {
    // Basic clamping is handled dynamically
  }

  public destroyScene(): void {
    this.itemSpawner.clear();
  }

  private onGameOver(): void {
    setTimeout(() => {
      SceneManager.changeSceneWithTransition(
        new GameOverScene({
          stats: [
            `Final Score: ${this.gameManager.score}`,
            `Waves Survived: ${this.gameManager.wave}`,
          ],
          onRestart: () => SceneManager.changeSceneWithTransition(new FruitCollectorScene()),
        }),
      );
    }, 1000);
  }
}
