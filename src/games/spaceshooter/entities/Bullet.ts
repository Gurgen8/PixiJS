import { Sprite, Assets } from 'pixi.js';

export class Bullet extends Sprite {
  public speed: number = 10;
  public isEnemyBullet: boolean = false;
  public isActive: boolean = false;

  constructor() {
    super(Assets.get('assets/images/spaceshooter/bullet.png'));
    this.anchor.set(0.5);
    this.scale.set(0.015); // Make it 4-6 times smaller than ship
    this.blendMode = 'add';
  }

  public spawn(x: number, y: number, isEnemy: boolean = false): void {
    this.position.set(x, y);
    this.isEnemyBullet = isEnemy;
    this.isActive = true;
    this.tint = this.isEnemyBullet ? 0xff4444 : 0x44aaff;

    // Rotate to point up for player (-90 deg), down for enemy (+90 deg)
    this.rotation = this.isEnemyBullet ? Math.PI / 2 : -Math.PI / 2;
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
