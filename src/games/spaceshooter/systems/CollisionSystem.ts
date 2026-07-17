import { Player } from '../entities/Player';
import { BulletManager } from './BulletManager';
import { EnemySpawner } from './EnemySpawner';
import { GameManager } from '../GameManager';

export class CollisionSystem {
  public static update(
    player: Player,
    bulletManager: BulletManager,
    enemySpawner: EnemySpawner,
    gameManager: GameManager,
  ): void {
    const activeBullets = bulletManager.activeBullets;
    const activeEnemies = enemySpawner.activeEnemies;

    for (const enemy of activeEnemies) {
      if (!enemy.isActive) continue;

      // 1. Check enemy vs player
      if (player.isActive && this.checkAABB(player, enemy)) {
        player.hit();
        enemy.hit();
        gameManager.onPlayerHit();
        continue;
      }

      // 2. Check enemy vs player bullets
      for (const bullet of activeBullets) {
        if (!bullet.isActive || bullet.isEnemyBullet) continue;

        if (this.checkAABB(bullet, enemy)) {
          bullet.hit();
          enemy.hit();
          gameManager.addScore(enemy.scoreValue);
          break; // bullet can only hit one enemy
        }
      }
    }
  }

  /**
   * Simple Axis-Aligned Bounding Box collision check.
   */
  private static checkAABB(
    objA: import('pixi.js').Container,
    objB: import('pixi.js').Container,
  ): boolean {
    const boundsA = objA.getBounds();
    const boundsB = objB.getBounds();

    return (
      boundsA.x < boundsB.x + boundsB.width &&
      boundsA.x + boundsA.width > boundsB.x &&
      boundsA.y < boundsB.y + boundsB.height &&
      boundsA.y + boundsA.height > boundsB.y
    );
  }
}
