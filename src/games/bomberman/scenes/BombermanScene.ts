import { BaseScene } from '@/scenes/BaseScene';
import { Player } from '@/games/bomberman/entities/Player';
import { Block } from '@/games/bomberman/entities/Block';
import { HUD } from '@/games/bomberman/ui/HUD';
import { GameManager } from '@/games/bomberman/GameManager';
import { GridSystem, CellType } from '@/games/bomberman/systems/GridSystem';
import { BombManager } from '@/games/bomberman/systems/BombManager';
import { EnemyManager } from '@/games/bomberman/systems/EnemyManager';
import { SceneManager } from '@/managers/SceneManager';
import { GameOverScene } from '@/scenes/GameOverScene';
import { GameConfig } from '@/config/GameConfig';
import { Container } from 'pixi.js';
import { InputManager } from '@/managers/InputManager';
import { AudioManager } from '@/managers/AudioManager';

export class BombermanScene extends BaseScene {
  private player: Player;
  private hud: HUD;
  private gameManager: GameManager;
  private gridSystem: GridSystem;
  private bombManager: BombManager;
  private enemyManager: EnemyManager;

  private gameLayer: Container;
  private uiLayer: Container;
  private blocksContainer: Container;

  private blocks: Block[] = [];

  constructor() {
    super();

    this.gameLayer = new Container();
    this.uiLayer = new Container();
    this.blocksContainer = new Container();

    this.gameLayer.addChild(this.blocksContainer);
    this.addChild(this.gameLayer);
    this.addChild(this.uiLayer);

    // Systems
    this.gridSystem = new GridSystem(GameConfig.width, GameConfig.height);
    this.gridSystem.generateMap();

    // Entities
    this.player = new Player(this.gridSystem);
    this.gameLayer.addChild(this.player);

    // Managers
    this.hud = new HUD();
    this.uiLayer.addChild(this.hud);

    this.gameManager = new GameManager(
      this.hud,
      this.player,
      () => this.onGameOver(),
      () => this.onLevelComplete(),
    );

    this.bombManager = new BombManager(this.gameLayer, this.gridSystem, this.gameManager);
    this.enemyManager = new EnemyManager(this.gameLayer, this.gridSystem);

    this.player.onDropBomb = (x, y) => this.bombManager.placeBomb(x, y);

    this.renderBlocks();
    this.gameManager.startGame();
    this.enemyManager.spawnEnemies(this.gameManager.level * 2);

    AudioManager.playBGM();
  }

  private renderBlocks(): void {
    this.blocks.forEach((b) => {
      this.blocksContainer.removeChild(b);
      b.destroy();
    });
    this.blocks = [];

    for (let x = 0; x < this.gridSystem.cols; x++) {
      for (let y = 0; y < this.gridSystem.rows; y++) {
        const cell = this.gridSystem.grid[x][y];
        if (cell !== CellType.EMPTY) {
          const block = new Block(x, y, cell, this.gridSystem);
          this.blocks.push(block);
          this.blocksContainer.addChild(block);
        }
      }
    }
  }

  public update(delta: number): void {
    if (this.gameManager.isGameOver) return;

    if (InputManager.isKeyJustPressed('KeyP') || InputManager.isKeyJustPressed('Escape')) {
      this.gameManager.togglePause();
      this.hud.setPaused(this.gameManager.isPaused);
    }

    if (this.gameManager.isPaused) return;

    this.player.update(delta);
    this.bombManager.update(delta);
    this.enemyManager.update(delta);

    this.checkCollisions();

    // Level complete condition (all enemies dead)
    if (this.enemyManager.enemies.length === 0 && !this.gameManager.isGameOver) {
      this.gameManager.completeLevel();
    }
  }

  private checkCollisions(): void {
    // 1. Check if explosions hit player or enemies or blocks
    const activeExplosions = this.bombManager.explosions;

    activeExplosions.forEach((exp) => {
      // Hit Player?
      if (this.player.gridX === exp.gridX && this.player.gridY === exp.gridY) {
        this.gameManager.onPlayerHit();
      }

      // Hit Enemies?
      this.enemyManager.enemies.forEach((enemy) => {
        if (enemy.isActive && enemy.gridX === exp.gridX && enemy.gridY === exp.gridY) {
          enemy.isActive = false;
          this.gameManager.addScore(100);
        }
      });
    });

    // 2. Check if player hits enemy
    this.enemyManager.enemies.forEach((enemy) => {
      if (
        enemy.isActive &&
        this.player.gridX === enemy.gridX &&
        this.player.gridY === enemy.gridY
      ) {
        this.gameManager.onPlayerHit();
      }
    });

    // 3. Clean up destroyed blocks
    for (let i = this.blocks.length - 1; i >= 0; i--) {
      const block = this.blocks[i];
      if (this.gridSystem.grid[block.gridX][block.gridY] === CellType.EMPTY) {
        block.destroyBlock();
        this.blocksContainer.removeChild(block);
        block.destroy();
        this.blocks.splice(i, 1);
        this.gameManager.addScore(10); // 10 points for destroying a block
      }
    }
  }

  private onLevelComplete(): void {
    this.gridSystem.generateMap();
    this.renderBlocks();
    this.player.resetToSpawn();
    this.bombManager.clear();
    this.enemyManager.clear();
    this.enemyManager.spawnEnemies(this.gameManager.level * 2);
    this.gameManager.updateHUD();
  }

  private onGameOver(): void {
    setTimeout(() => {
      SceneManager.changeSceneWithTransition(
        new GameOverScene({
          stats: [
            `Final Score: ${this.gameManager.score}`,
            `Levels Cleared: ${this.gameManager.level - 1}`,
          ],
          onRestart: () => SceneManager.changeSceneWithTransition(new BombermanScene()),
        }),
      );
    }, 1000);
  }

  public resize(_width: number, _height: number): void {
    // Everything is centered initially, grid logic could be recalculated if window size changes
  }

  public destroyScene(): void {
    AudioManager.stopBGM();
    this.bombManager.clear();
    this.enemyManager.clear();
  }
}
