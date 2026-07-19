import { Sprite, Assets } from 'pixi.js';
import { InputManager } from '@/managers/InputManager';
import { GameConfig } from '@/config/GameConfig';

export class Player extends Sprite {
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
    super(Assets.get('assets/images/spaceshooter/player.png'));
    this.anchor.set(0.5);
    this.width = this.hitWidth;
    this.height = this.hitHeight;
    this.blendMode = 'add'; // Remove black background as temporary solution
    this.resetPosition();
  }

  public resetPosition(): void {
    this.position.set(GameConfig.width / 2, GameConfig.height - 100);
    this.isActive = true;
    this.visible = true;
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

  public explode(): void {
    this.visible = false;

    // Create an explosion effect using pixi graphics
    import('pixi.js').then(({ Graphics, Ticker }) => {
      const explosion = new Graphics();
      explosion.circle(0, 0, 30);
      explosion.fill(0xff8800);
      explosion.blendMode = 'add';

      this.parent?.addChild(explosion);
      explosion.position.copyFrom(this.position);

      let scale = 1;
      const explodeTick = (ticker: import('pixi.js').Ticker) => {
        scale += ticker.deltaTime * 0.15;
        explosion.scale.set(scale);
        explosion.alpha -= ticker.deltaTime * 0.05;
        if (explosion.alpha <= 0) {
          explosion.destroy();
          Ticker.shared.remove(explodeTick);
        }
      };
      Ticker.shared.add(explodeTick);
    });
  }
}
