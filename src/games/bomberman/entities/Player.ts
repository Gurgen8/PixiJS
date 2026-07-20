import { Container, Text, TextStyle } from 'pixi.js';
import { InputManager } from '@/managers/InputManager';
import { GridSystem } from '@/games/bomberman/systems/GridSystem';
import { AudioManager } from '@/managers/AudioManager';

export class Player extends Container {
  public gridX: number = 1;
  public gridY: number = 1;

  public targetGridX: number = 1;
  public targetGridY: number = 1;

  public isActive: boolean = true;
  private speed: number = 150; // pixels per second
  private isMoving: boolean = false;

  private sprite: Text;
  private gridSystem: GridSystem;

  public onDropBomb: (gridX: number, gridY: number) => void = () => {};

  constructor(gridSystem: GridSystem) {
    super();
    this.gridSystem = gridSystem;

    this.sprite = new Text({
      text: '🤠',
      style: new TextStyle({ fontSize: 30 }),
    });
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);

    this.resetToSpawn();
  }

  public resetToSpawn(): void {
    this.gridX = 1;
    this.gridY = 1;
    this.targetGridX = 1;
    this.targetGridY = 1;
    this.isMoving = false;
    this.isActive = true;

    const pos = this.gridSystem.getPixelPos(this.gridX, this.gridY);
    this.position.set(pos.x, pos.y);
  }

  public update(delta: number): void {
    if (!this.isActive) return;

    if (!this.isMoving) {
      this.handleInput();
    } else {
      this.moveTowardsTarget(delta);
    }

    if (InputManager.isKeyJustPressed('Space')) {
      this.onDropBomb(this.gridX, this.gridY);
      AudioManager.playSound('bomb');
    }
  }

  private handleInput(): void {
    let dx = 0;
    let dy = 0;

    if (InputManager.isKeyDown('KeyW') || InputManager.isKeyDown('ArrowUp')) dy = -1;
    else if (InputManager.isKeyDown('KeyS') || InputManager.isKeyDown('ArrowDown')) dy = 1;
    else if (InputManager.isKeyDown('KeyA') || InputManager.isKeyDown('ArrowLeft')) dx = -1;
    else if (InputManager.isKeyDown('KeyD') || InputManager.isKeyDown('ArrowRight')) dx = 1;

    if (dx !== 0 || dy !== 0) {
      const nextX = this.gridX + dx;
      const nextY = this.gridY + dy;

      if (this.gridSystem.isWalkable(nextX, nextY)) {
        this.targetGridX = nextX;
        this.targetGridY = nextY;
        this.isMoving = true;
      }
    }
  }

  private moveTowardsTarget(delta: number): void {
    const targetPos = this.gridSystem.getPixelPos(this.targetGridX, this.targetGridY);
    const dist = this.speed * (delta / 60);

    const dx = targetPos.x - this.x;
    const dy = targetPos.y - this.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length <= dist) {
      // Arrived
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
