import { BaseScene } from '@/scenes/BaseScene';
import { Player } from '@/games/spaceshooter/entities/Player';
import { HUD } from '@/games/spaceshooter/ui/HUD';
import { BulletManager } from '@/games/spaceshooter/systems/BulletManager';
import { EnemySpawner } from '@/games/spaceshooter/systems/EnemySpawner';
import { CollisionSystem } from '@/games/spaceshooter/systems/CollisionSystem';
import { GameManager } from '@/games/spaceshooter/GameManager';
import { SceneManager } from '@/managers/SceneManager';
import { GameOverScene } from '@/scenes/GameOverScene';
import { GameConfig } from '@/config/GameConfig';
import { Container } from 'pixi.js';
import { InputManager } from '@/managers/InputManager';
import { AudioManager } from '@/managers/AudioManager';

export class SpaceShooterScene extends BaseScene {
  private player: Player;
  private hud: HUD;
  private bulletManager: BulletManager;
  private enemySpawner: EnemySpawner;
  private gameManager: GameManager;

  // Layers to keep depth correct (Background, Game, UI)
  private gameLayer: Container;
  private uiLayer: Container;

  constructor() {
    super();

    this.gameLayer = new Container();
    this.uiLayer = new Container();

    this.addChild(this.gameLayer);
    this.addChild(this.uiLayer);

    // Systems
    this.bulletManager = new BulletManager(this.gameLayer);
    this.enemySpawner = new EnemySpawner(this.gameLayer);

    // Entities
    this.player = new Player();
    this.gameLayer.addChild(this.player);

    this.player.onShoot = (x, y) => {
      this.bulletManager.spawnBullet(x, y, false); // Player bullet
      AudioManager.playSound('shoot');
    };

    // UI
    this.hud = new HUD();
    this.uiLayer.addChild(this.hud);

    // Manager
    this.gameManager = new GameManager(this.enemySpawner, this.hud, this.player, () =>
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
      this.bulletManager.clear();
      this.enemySpawner.clear();
      return;
    }

    if (this.gameManager.isPaused) return;

    this.player.update(delta);
    this.bulletManager.update(delta);
    this.enemySpawner.update(delta);

    CollisionSystem.update(this.player, this.bulletManager, this.enemySpawner, this.gameManager);

    this.hud.updateFPS();
  }

  public resize(_width: number, _height: number): void {
    // Keep UI at top left, player clamps are dynamic
  }

  public destroyScene(): void {
    this.bulletManager.clear();
    this.enemySpawner.clear();
  }

  private onGameOver(): void {
    // Wait a brief moment, then transition to GameOverScene
    setTimeout(() => {
      SceneManager.changeSceneWithTransition(
        new GameOverScene({
          stats: [
            `Final Score: ${this.gameManager.score}`,
            `Waves Survived: ${this.gameManager.wave}`,
          ],
          onRestart: () => SceneManager.changeSceneWithTransition(new SpaceShooterScene()),
        }),
      );
    }, 1000);
  }
}
