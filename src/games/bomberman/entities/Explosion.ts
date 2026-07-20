import { Container, Text, TextStyle } from 'pixi.js';
import { GridSystem } from '@/games/bomberman/systems/GridSystem';
import { AudioManager } from '@/managers/AudioManager';

export class Explosion extends Container {
  public gridX: number;
  public gridY: number;

  public isActive: boolean = true;
  private timer: number = 500; // Lives for 500ms
  private sprite: Text;

  constructor(gridX: number, gridY: number, gridSystem: GridSystem) {
    super();
    this.gridX = gridX;
    this.gridY = gridY;

    this.sprite = new Text({
      text: '💥',
      style: new TextStyle({ fontSize: 32 }),
    });
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);

    const pos = gridSystem.getPixelPos(gridX, gridY);
    this.position.set(pos.x, pos.y);

    AudioManager.playSound('explosion');
  }

  public update(delta: number): void {
    if (!this.isActive) return;

    this.timer -= (delta / 60) * 1000;

    // Fade out
    this.alpha = this.timer / 500;

    if (this.timer <= 0) {
      this.isActive = false;
    }
  }
}
