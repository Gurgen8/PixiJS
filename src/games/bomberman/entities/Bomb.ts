import { Container, Text, TextStyle } from 'pixi.js';
import { GridSystem } from '@/games/bomberman/systems/GridSystem';

export class Bomb extends Container {
  public gridX: number;
  public gridY: number;

  public isActive: boolean = true;
  public owner: unknown; // Can be used later if multiple players

  private timer: number = 3000; // 3 seconds to explode
  private gridSystem: GridSystem;
  private sprite: Text;

  public onExplode: (bomb: Bomb) => void = () => {};

  constructor(gridX: number, gridY: number, gridSystem: GridSystem) {
    super();
    this.gridX = gridX;
    this.gridY = gridY;
    this.gridSystem = gridSystem;

    this.sprite = new Text({
      text: '💣',
      style: new TextStyle({ fontSize: 28 }),
    });
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);

    const pos = this.gridSystem.getPixelPos(this.gridX, this.gridY);
    this.position.set(pos.x, pos.y);
  }

  public update(delta: number): void {
    if (!this.isActive) return;

    // Pulse effect
    this.sprite.scale.set(1 + Math.sin(Date.now() / 150) * 0.1);

    // Assuming delta is around 1 (for 60fps), equivalent to 16.66ms
    this.timer -= (delta / 60) * 1000;

    if (this.timer <= 0) {
      this.explode();
    }
  }

  public explode(): void {
    if (!this.isActive) return;
    this.isActive = false;
    this.onExplode(this);
  }
}
