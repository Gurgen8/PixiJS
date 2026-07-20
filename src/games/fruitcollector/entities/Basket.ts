import { Container, Text, TextStyle } from 'pixi.js';
import { InputManager } from '@/managers/InputManager';
import { GameConfig } from '@/config/GameConfig';

import { VelocityComponent } from '../components/VelocityComponent';
import { ActiveComponent } from '../components/ActiveComponent';
import { CollisionComponent } from '../components/CollisionComponent';

export class Basket extends Container {
  public velocity: VelocityComponent = new VelocityComponent(10);
  public active: ActiveComponent = new ActiveComponent(true);
  public collision: CollisionComponent = new CollisionComponent(80, 40);

  private sprite: Text;

  constructor() {
    super();

    // Use emoji for the basket
    this.sprite = new Text({
      text: '🧺',
      style: new TextStyle({ fontSize: 60 }),
    });
    this.sprite.anchor.set(0.5);

    this.addChild(this.sprite);

    this.width = this.collision.hitWidth;
    this.height = this.collision.hitHeight;

    this.resetPosition();
  }

  public resetPosition(): void {
    this.position.set(GameConfig.width / 2, GameConfig.height - 80);
    this.active.isActive = true;
    this.visible = true;
  }

  public update(delta: number): void {
    if (!this.active.isActive) return;

    if (InputManager.isKeyDown('KeyA') || InputManager.isKeyDown('ArrowLeft')) {
      this.x -= this.velocity.speed * delta;
    }
    if (InputManager.isKeyDown('KeyD') || InputManager.isKeyDown('ArrowRight')) {
      this.x += this.velocity.speed * delta;
    }

    // Clamping to screen boundaries
    const halfWidth = this.collision.hitWidth / 2;
    if (this.x < halfWidth) this.x = halfWidth;
    if (this.x > GameConfig.width - halfWidth) this.x = GameConfig.width - halfWidth;
  }
}
