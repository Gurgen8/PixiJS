import { Container } from 'pixi.js';
import { Enemy } from '../entities/Enemy';
import { ObjectPool } from '../../../utils/ObjectPool';
import { GameConfig } from '../../../config/GameConfig';

export class EnemySpawner {
  private enemyPool: ObjectPool<Enemy>;
  public activeEnemies: Enemy[] = [];
  private container: Container;

  private wave: number = 0;
  private enemiesToSpawn: number = 0;
  private spawnTimer: number = 0;
  private spawnInterval: number = 60; // frames

  public onWaveComplete?: () => void;

  constructor(container: Container) {
    this.container = container;
    this.enemyPool = new ObjectPool<Enemy>(() => {
      const e = new Enemy();
      this.container.addChild(e);
      e.visible = false;
      return e;
    }, 10);
  }

  public startWave(waveNumber: number): void {
    this.wave = waveNumber;
    // more enemies and slightly faster spawns each wave
    this.enemiesToSpawn = 5 + this.wave * 2;
    this.spawnInterval = Math.max(20, 60 - this.wave * 5); 
    this.spawnTimer = 0;
  }

  public update(delta: number): void {
    // Spawn logic
    if (this.enemiesToSpawn > 0) {
      this.spawnTimer -= delta;
      if (this.spawnTimer <= 0) {
        this.spawnTimer = this.spawnInterval;
        this.spawnEnemy();
        this.enemiesToSpawn--;
      }
    } else if (this.activeEnemies.length === 0) {
      // Wave complete
      if (this.onWaveComplete) {
        this.onWaveComplete();
        // Clear onWaveComplete temporary logic if needed, but usually we just notify
      }
    }

    // Update active enemies
    for (let i = this.activeEnemies.length - 1; i >= 0; i--) {
      const enemy = this.activeEnemies[i];
      enemy.update(delta);

      // Despawn if out of bounds or inactive (dead)
      if (!enemy.isActive || enemy.y > GameConfig.height + 50) {
        enemy.isActive = false;
        enemy.visible = false;
        this.enemyPool.release(enemy);
        this.activeEnemies.splice(i, 1);
      }
    }
  }

  private spawnEnemy(): void {
    const enemy = this.enemyPool.get();
    enemy.visible = true;
    
    // Random X position within screen bounds
    const padding = enemy.hitWidth;
    const x = Math.random() * (GameConfig.width - padding * 2) + padding;
    const speedMultiplier = 1 + this.wave * 0.1;
    
    enemy.spawn(x, -50, speedMultiplier);
    this.activeEnemies.push(enemy);
  }

  public clear(): void {
    this.activeEnemies.forEach(e => {
      e.isActive = false;
      e.visible = false;
      this.enemyPool.release(e);
    });
    this.activeEnemies = [];
    this.enemiesToSpawn = 0;
  }
}
