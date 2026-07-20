import { Container } from 'pixi.js';
import { FallingItem, type ItemType } from '@/games/fruitcollector/entities/FallingItem';
import { GameConfig } from '@/config/GameConfig';

export class ItemSpawner {
  public activeItems: FallingItem[] = [];
  private itemPool: FallingItem[] = [];
  private layer: Container;

  private spawnTimer: number = 0;
  private spawnInterval: number = 60; // frames

  // Wave state
  private currentWave: number = 1;
  private waveItemCount: number = 0;
  private itemsSpawned: number = 0;

  public onWaveComplete?: () => void;

  constructor(layer: Container) {
    this.layer = layer;

    // Pre-allocate a pool of items
    for (let i = 0; i < 20; i++) {
      const item = new FallingItem();
      item.visible = false;
      this.layer.addChild(item);
      this.itemPool.push(item);
      this.activeItems.push(item);
    }
  }

  public startWave(wave: number): void {
    this.currentWave = wave;
    this.spawnInterval = Math.max(20, 60 - wave * 5); // Gets faster each wave
    this.waveItemCount = 10 + wave * 5; // More items each wave
    this.itemsSpawned = 0;
    this.spawnTimer = this.spawnInterval;
  }

  public update(delta: number): void {
    if (this.itemsSpawned < this.waveItemCount) {
      this.spawnTimer -= delta;
      if (this.spawnTimer <= 0) {
        this.spawnTimer = this.spawnInterval;
        this.spawnItem();
      }
    } else {
      // Check if all items are inactive to complete wave
      const anyActive = this.activeItems.some((i) => i.isActive);
      if (!anyActive && this.onWaveComplete) {
        this.onWaveComplete();
      }
    }

    // Update active items
    for (const item of this.activeItems) {
      if (item.isActive) {
        item.update(delta);
      }
    }
  }

  private spawnItem(): void {
    const inactiveItem = this.activeItems.find((i) => !i.isActive);
    if (!inactiveItem) return; // Pool empty

    this.itemsSpawned++;

    const isBomb = Math.random() < 0.2 + this.currentWave * 0.02; // Bomb chance increases
    const type: ItemType = isBomb ? 'bomb' : 'fruit';

    // Spawn somewhat away from the edges
    const x = 40 + Math.random() * (GameConfig.width - 80);
    const y = -50;

    const speedMult = 1 + this.currentWave * 0.1;
    inactiveItem.spawn(x, y, type, speedMult);
  }

  public clear(): void {
    for (const item of this.activeItems) {
      item.isActive = false;
      item.visible = false;
    }
  }
}
