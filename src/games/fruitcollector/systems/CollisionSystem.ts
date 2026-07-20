import { Basket } from '@/games/fruitcollector/entities/Basket';
import { ItemSpawner } from '@/games/fruitcollector/systems/ItemSpawner';
import { GameManager } from '@/games/fruitcollector/GameManager';
import { GameConfig } from '@/config/GameConfig';

export class CollisionSystem {
  public static update(basket: Basket, itemSpawner: ItemSpawner, gameManager: GameManager): void {
    const activeItems = itemSpawner.activeItems;

    for (const item of activeItems) {
      if (!item.active.isActive) continue;

      // 1. Check item fell off screen
      if (item.y > GameConfig.height + item.collision.hitHeight) {
        item.hit(); // Deactivate
        if (item.item.itemType === 'fruit') {
          gameManager.onItemMissed();
        }
        continue;
      }

      // 2. Check item vs basket
      if (basket.active.isActive && this.checkAABB(basket, item)) {
        item.hit();

        if (item.item.itemType === 'fruit') {
          gameManager.addScore(100);
          import('@/managers/AudioManager').then(({ AudioManager }) => {
            AudioManager.playSound('catch');
          });
        } else if (item.item.itemType === 'bomb') {
          gameManager.onBombHit();
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
