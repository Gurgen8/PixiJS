import { Container } from 'pixi.js';
import { Bullet } from '../entities/Bullet';
import { ObjectPool } from '../../../utils/ObjectPool';
import { GameConfig } from '../../../config/GameConfig';

export class BulletManager {
  private bulletPool: ObjectPool<Bullet>;
  public activeBullets: Bullet[] = [];
  private container: Container;

  constructor(container: Container) {
    this.container = container;
    this.bulletPool = new ObjectPool<Bullet>(() => {
      const b = new Bullet();
      this.container.addChild(b);
      b.visible = false;
      return b;
    }, 20);
  }

  public spawnBullet(x: number, y: number, isEnemy: boolean = false): void {
    const bullet = this.bulletPool.get();
    bullet.visible = true;
    bullet.spawn(x, y, isEnemy);
    this.activeBullets.push(bullet);
  }

  public update(delta: number): void {
    for (let i = this.activeBullets.length - 1; i >= 0; i--) {
      const bullet = this.activeBullets[i];
      bullet.update(delta);

      // Despawn if out of bounds or marked inactive
      if (!bullet.isActive || bullet.y < -50 || bullet.y > GameConfig.height + 50) {
        bullet.isActive = false;
        bullet.visible = false;
        this.bulletPool.release(bullet);
        this.activeBullets.splice(i, 1);
      }
    }
  }

  public clear(): void {
    this.activeBullets.forEach(b => {
      b.isActive = false;
      b.visible = false;
      this.bulletPool.release(b);
    });
    this.activeBullets = [];
  }
}
