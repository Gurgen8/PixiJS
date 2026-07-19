import { Container, Text, TextStyle } from 'pixi.js';
import { InputManager } from '@/managers/InputManager';
import { GameConfig } from '@/config/GameConfig';

export class Basket extends Container {
  public speed: number = 10;
  public isActive: boolean = true;
  
  public hitWidth: number = 80;
  public hitHeight: number = 40;
  
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
    
    this.width = this.hitWidth;
    this.height = this.hitHeight;

    this.resetPosition();
  }

  public resetPosition(): void {
    this.position.set(GameConfig.width / 2, GameConfig.height - 80);
    this.isActive = true;
    this.visible = true;
  }

  public update(delta: number): void {
    if (!this.isActive) return;

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
  }
}
