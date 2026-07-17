import { Graphics } from 'pixi.js';

export class Enemy extends Graphics {
  public speed: number = 2;
  public isActive: boolean = false;
  public scoreValue: number = 100;
  
  // AABB properties
  public hitWidth: number = 40;
  public hitHeight: number = 40;

  constructor() {
    super();
    this.drawShape();
  }

  private drawShape(): void {
    this.clear();
    // Draw an enemy shape (diamond/square)
    this.rect(-this.hitWidth / 2, -this.hitHeight / 2, this.hitWidth, this.hitHeight);
    this.fill(0xff3333);
    this.stroke({ color: 0xffaaaa, width: 2 });
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
