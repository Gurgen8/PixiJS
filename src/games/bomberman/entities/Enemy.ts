import { Container, Text, TextStyle } from 'pixi.js';
import { GridSystem } from '@/games/bomberman/systems/GridSystem';

export class Enemy extends Container {
  public gridX: number;
  public gridY: number;

  public isActive: boolean = true;
  private speed: number = 80; // pixels per second
  private isMoving: boolean = false;

  private targetGridX: number;
  private targetGridY: number;
  private dx: number = 0;
  private dy: number = 0;

  private sprite: Text;
  private gridSystem: GridSystem;

  constructor(gridX: number, gridY: number, gridSystem: GridSystem) {
    super();
    this.gridX = gridX;
    this.gridY = gridY;
    this.targetGridX = gridX;
    this.targetGridY = gridY;
    this.gridSystem = gridSystem;

    this.sprite = new Text({
      text: '👾',
      style: new TextStyle({ fontSize: 30 }),
    });
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);

    const pos = this.gridSystem.getPixelPos(this.gridX, this.gridY);
    this.position.set(pos.x, pos.y);

    this.chooseRandomDirection();
  }

  public update(delta: number): void {
    if (!this.isActive) return;

    if (!this.isMoving) {
      const nextX = this.gridX + this.dx;
      const nextY = this.gridY + this.dy;

      if (this.gridSystem.isWalkable(nextX, nextY)) {
        this.targetGridX = nextX;
        this.targetGridY = nextY;
        this.isMoving = true;
      } else {
        // Hit a wall, choose new direction
        this.chooseRandomDirection();
      }
    } else {
      this.moveTowardsTarget(delta);
    }
  }

  private chooseRandomDirection(): void {
    const dirs = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];
    // Simple AI: pick a random valid direction
    const validDirs = dirs.filter((d) =>
      this.gridSystem.isWalkable(this.gridX + d.dx, this.gridY + d.dy),
    );

    if (validDirs.length > 0) {
      const randomDir = validDirs[Math.floor(Math.random() * validDirs.length)];
      this.dx = randomDir.dx;
      this.dy = randomDir.dy;
    } else {
      // Stuck
      this.dx = 0;
      this.dy = 0;
    }
  }

  private moveTowardsTarget(delta: number): void {
    const targetPos = this.gridSystem.getPixelPos(this.targetGridX, this.targetGridY);
    const dist = this.speed * (delta / 60);

    const dx = targetPos.x - this.x;
    const dy = targetPos.y - this.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length <= dist) {
      this.x = targetPos.x;
      this.y = targetPos.y;
      this.gridX = this.targetGridX;
      this.gridY = this.targetGridY;
      this.isMoving = false;
    } else {
      this.x += (dx / length) * dist;
      this.y += (dy / length) * dist;
    }
  }
}
