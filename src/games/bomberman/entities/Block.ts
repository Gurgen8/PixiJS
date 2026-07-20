import { Container, Text, TextStyle } from 'pixi.js';
import { GridSystem, CellType } from '@/games/bomberman/systems/GridSystem';

export class Block extends Container {
  public gridX: number;
  public gridY: number;
  public cellType: CellType;

  public isActive: boolean = true;
  private sprite: Text;

  constructor(gridX: number, gridY: number, cellType: CellType, gridSystem: GridSystem) {
    super();
    this.gridX = gridX;
    this.gridY = gridY;
    this.cellType = cellType;

    let char = '⬛'; // Solid wall
    if (this.cellType === CellType.DESTRUCTIBLE) {
      char = '📦'; // Destructible block
    }

    this.sprite = new Text({
      text: char,
      style: new TextStyle({ fontSize: 30 }),
    });
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);

    const pos = gridSystem.getPixelPos(this.gridX, this.gridY);
    this.position.set(pos.x, pos.y);
  }

  public destroyBlock(): void {
    if (this.cellType === CellType.DESTRUCTIBLE) {
      this.isActive = false;
    }
  }
}
