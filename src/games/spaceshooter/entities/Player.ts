import { Graphics } from 'pixi.js';
import { InputManager } from '../../../managers/InputManager';
import { GameConfig } from '../../../config/GameConfig';

export class Player extends Graphics {
  public speed: number = 8;
  public isActive: boolean = true;
  
  // AABB properties
  public hitWidth: number = 50;
  public hitHeight: number = 50;

  // Shooting rate limit
  private lastShootTime: number = 0;
  private shootCooldownFrames: number = 15; // roughly 4 shots per sec at 60fps

  public onShoot?: (x: number, y: number) => void;

  constructor() {
    super();
    this.drawShape();
    this.resetPosition();
  }

  private drawShape(): void {
    this.clear();
    // Draw a spaceship shape (triangle)
    this.moveTo(0, -this.hitHeight / 2);
    this.lineTo(this.hitWidth / 2, this.hitHeight / 2);
    this.lineTo(-this.hitWidth / 2, this.hitHeight / 2);
    this.closePath();
    this.fill(0x44aaff);
    this.stroke({ color: 0xffffff, width: 2 });
  }

  public resetPosition(): void {
    this.position.set(GameConfig.width / 2, GameConfig.height - 100);
    this.isActive = true;
  }

  public update(delta: number): void {
    if (!this.isActive) return;

    // Movement logic
    if (InputManager.isKeyDown('KeyA') || InputManager.isKeyDown('ArrowLeft')) {
      this.x -= this.speed * delta;
    }
    if (InputManager.isKeyDown('KeyD') || InputManager.isKeyDown('ArrowRight')) {
      this.x += this.speed * delta;
    }

    // Clamping to screen boundaries
    const halfWidth = this.hitWidth / 2;
    if (this.x < halfWidth) this.x = halfWidth;
    if (this.x > GameConfig.width - halfWidth) this.x = GameConfig.width - halfWidth;

    // Shooting logic
    this.lastShootTime -= delta;
    if (this.lastShootTime <= 0) {
      if (InputManager.isKeyDown('Space') || InputManager.isKeyDown('MouseLeft')) {
        this.lastShootTime = this.shootCooldownFrames;
        if (this.onShoot) {
          this.onShoot(this.x, this.y - this.hitHeight / 2);
        }
      }
    }
  }

  public hit(): void {
    // Player took damage
    // Note: handling lives will be in GameManager
  }
}
