import { Sprite, Assets } from 'pixi.js';

export class Enemy extends Sprite {
  public speed: number = 2;
  public isActive: boolean = false;
  public scoreValue: number = 100;

  // AABB properties
  public hitWidth: number = 40;
  public hitHeight: number = 40;

  constructor() {
    super(Assets.get('assets/images/spaceshooter/enemy.png'));
    this.anchor.set(0.5);
    this.width = this.hitWidth;
    this.height = this.hitHeight;
    this.blendMode = 'add'; // Remove black background as temporary solution
  }

  public spawn(x: number, y: number, speedMultiplier: number = 1): void {
    this.position.set(x, y);
    this.speed = 2 * speedMultiplier;
    this.isActive = true;
  }

  public update(delta: number): void {
    if (!this.isActive) return;

    this.y += this.speed * delta;
  }

  public hit(): void {
    this.isActive = false;
  }
}
