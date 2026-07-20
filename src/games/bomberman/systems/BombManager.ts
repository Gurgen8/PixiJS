import { Container } from 'pixi.js';
import { GridSystem, CellType } from '@/games/bomberman/systems/GridSystem';
import { Bomb } from '@/games/bomberman/entities/Bomb';
import { Explosion } from '@/games/bomberman/entities/Explosion';
import { GameManager } from '@/games/bomberman/GameManager';

export class BombManager {
  private container: Container;
  private gridSystem: GridSystem;
  private gameManager: GameManager;

  public bombs: Bomb[] = [];
  public explosions: Explosion[] = [];

  constructor(container: Container, gridSystem: GridSystem, gameManager: GameManager) {
    this.container = container;
    this.gridSystem = gridSystem;
    this.gameManager = gameManager;
  }

  public placeBomb(gridX: number, gridY: number): void {
    if (this.bombs.length >= this.gameManager.bombCapacity) return;

    // Check if a bomb already exists here
    if (this.bombs.some((b) => b.gridX === gridX && b.gridY === gridY)) return;

    const bomb = new Bomb(gridX, gridY, this.gridSystem);
    bomb.onExplode = (b) => this.handleExplosion(b);

    this.bombs.push(bomb);
    this.container.addChild(bomb);
  }

  private handleExplosion(bomb: Bomb): void {
    // Spawn explosions in + shape
    const range = this.gameManager.bombRange;
    const dirs = [
      { dx: 0, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];

    dirs.forEach((d) => {
      for (let i = 0; i <= (d.dx === 0 && d.dy === 0 ? 0 : range); i++) {
        const ex = bomb.gridX + d.dx * i;
        const ey = bomb.gridY + d.dy * i;

        if (ex < 0 || ex >= this.gridSystem.cols || ey < 0 || ey >= this.gridSystem.rows) break;

        const cell = this.gridSystem.grid[ex][ey];

        if (cell === CellType.SOLID) {
          break; // Blast stops at solid walls
        }

        const explosion = new Explosion(ex, ey, this.gridSystem);
        this.explosions.push(explosion);
        this.container.addChild(explosion);

        if (cell === CellType.DESTRUCTIBLE) {
          // Destroys block and stops blast in this direction
          this.gridSystem.grid[ex][ey] = CellType.EMPTY;
          // Note: Actual Block visual entity cleanup is handled by BombermanScene
          // checking cellType mismatch or by emitting an event.
          break;
        }
      }
    });

    // Cleanup bomb
    this.container.removeChild(bomb);
    bomb.destroy();
  }

  public update(delta: number): void {
    for (let i = this.bombs.length - 1; i >= 0; i--) {
      const bomb = this.bombs[i];
      bomb.update(delta);
      if (!bomb.isActive) {
        this.bombs.splice(i, 1);
      }
    }

    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const explosion = this.explosions[i];
      explosion.update(delta);
      if (!explosion.isActive) {
        this.container.removeChild(explosion);
        explosion.destroy();
        this.explosions.splice(i, 1);
      }
    }
  }

  public clear(): void {
    this.bombs.forEach((b) => {
      this.container.removeChild(b);
      b.destroy();
    });
    this.explosions.forEach((e) => {
      this.container.removeChild(e);
      e.destroy();
    });
    this.bombs = [];
    this.explosions = [];
  }
}
