import { Container, Graphics } from 'pixi.js';

export const CellType = {
  EMPTY: 0,
  SOLID: 1,
  DESTRUCTIBLE: 2,
} as const;

export type CellType = (typeof CellType)[keyof typeof CellType];

export class GridSystem {
  public cols: number = 15;
  public rows: number = 13;
  public cellSize: number = 40;

  public offsetX: number = 0;
  public offsetY: number = 0;

  public grid: CellType[][] = [];

  constructor(canvasWidth: number, canvasHeight: number) {
    this.offsetX = (canvasWidth - this.cols * this.cellSize) / 2;
    this.offsetY = (canvasHeight - this.rows * this.cellSize) / 2;
  }

  public generateMap(): void {
    this.grid = [];
    for (let x = 0; x < this.cols; x++) {
      this.grid[x] = [];
      for (let y = 0; y < this.rows; y++) {
        // Borders are solid
        if (x === 0 || y === 0 || x === this.cols - 1 || y === this.rows - 1) {
          this.grid[x][y] = CellType.SOLID;
        }
        // Alternate solid blocks
        else if (x % 2 === 0 && y % 2 === 0) {
          this.grid[x][y] = CellType.SOLID;
        }
        // Safe zone for player start (top-left)
        else if ((x === 1 && y === 1) || (x === 1 && y === 2) || (x === 2 && y === 1)) {
          this.grid[x][y] = CellType.EMPTY;
        }
        // Random destructible blocks
        else {
          this.grid[x][y] = Math.random() > 0.3 ? CellType.DESTRUCTIBLE : CellType.EMPTY;
        }
      }
    }
  }

  public isWalkable(x: number, y: number): boolean {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return false;
    return this.grid[x][y] === CellType.EMPTY;
  }

  public getPixelPos(gridX: number, gridY: number): { x: number; y: number } {
    return {
      x: this.offsetX + gridX * this.cellSize + this.cellSize / 2,
      y: this.offsetY + gridY * this.cellSize + this.cellSize / 2,
    };
  }

  public getGridPos(pixelX: number, pixelY: number): { x: number; y: number } {
    return {
      x: Math.floor((pixelX - this.offsetX) / this.cellSize),
      y: Math.floor((pixelY - this.offsetY) / this.cellSize),
    };
  }

  // Used for debugging the grid
  public drawDebug(container: Container): void {
    const debugGfx = new Graphics();
    debugGfx.stroke({ color: 0xff0000, width: 1, alpha: 0.5 });

    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        debugGfx.rect(
          this.offsetX + x * this.cellSize,
          this.offsetY + y * this.cellSize,
          this.cellSize,
          this.cellSize,
        );
      }
    }

    container.addChild(debugGfx);
  }
}
