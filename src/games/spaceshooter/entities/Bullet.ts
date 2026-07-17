import { Graphics } from 'pixi.js';

export class Bullet extends Graphics {
  public speed: number = 10;
  public isEnemyBullet: boolean = false;
  public isActive: boolean = false;

  constructor() {
    super();
    // Default style
    this.drawShape();
  }

  private drawShape(): void {
    this.clear();
    this.rect(-2, -10, 4, 20);
    this.fill(this.isEnemyBullet ? 0xff4444 : 0x44ff44);
  }

  public spawn(x: number, y: number, isEnemy: boolean = false): void {
    this.position.set(x, y);
    this.isEnemyBullet = isEnemy;
    this.isActive = true;
    this.drawShape();
  }

  public update(delta: number): void {
    if (!this.isActive) return;

    if (this.isEnemyBullet) {
      this.y += this.speed * delta;
    } else {
      this.y -= this.speed * delta;
    }
  }

  public hit(): void {
    this.isActive = false;
  }
}
