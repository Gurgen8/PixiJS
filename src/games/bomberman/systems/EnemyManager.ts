import { Container } from 'pixi.js';
import { GridSystem, CellType } from '@/games/bomberman/systems/GridSystem';
import { Enemy } from '@/games/bomberman/entities/Enemy';

export class EnemyManager {
  private container: Container;
  private gridSystem: GridSystem;

  public enemies: Enemy[] = [];

  constructor(container: Container, gridSystem: GridSystem) {
    this.container = container;
    this.gridSystem = gridSystem;
  }

  public spawnEnemies(count: number): void {
    let spawned = 0;
    while (spawned < count) {
      const x = Math.floor(Math.random() * this.gridSystem.cols);
      const y = Math.floor(Math.random() * this.gridSystem.rows);

      // Don't spawn near player start
      if (x <= 3 && y <= 3) continue;

      if (this.gridSystem.grid[x][y] === CellType.EMPTY) {
        const enemy = new Enemy(x, y, this.gridSystem);
        this.enemies.push(enemy);
        this.container.addChild(enemy);
        spawned++;
      }
    }
  }

  public update(delta: number): void {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(delta);
      if (!enemy.isActive) {
        this.container.removeChild(enemy);
        enemy.destroy();
        this.enemies.splice(i, 1);
      }
    }
  }

  public clear(): void {
    this.enemies.forEach((e) => {
      this.container.removeChild(e);
      e.destroy();
    });
    this.enemies = [];
  }
}
