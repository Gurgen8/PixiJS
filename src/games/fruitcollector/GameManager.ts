import { ItemSpawner } from '@/games/fruitcollector/systems/ItemSpawner';
import { HUD } from '@/games/fruitcollector/ui/HUD';
import { Basket } from '@/games/fruitcollector/entities/Basket';
import { AudioManager } from '@/managers/AudioManager';

export class GameManager {
  public score: number = 0;
  public lives: number = 3;
  public wave: number = 1;
  public isGameOver: boolean = false;
  public isPaused: boolean = false;

  private itemSpawner: ItemSpawner;
  private hud: HUD;
  private basket: Basket;
  private onGameOverCallback: () => void;

  constructor(itemSpawner: ItemSpawner, hud: HUD, basket: Basket, onGameOver: () => void) {
    this.itemSpawner = itemSpawner;
    this.hud = hud;
    this.basket = basket;
    this.onGameOverCallback = onGameOver;

    this.itemSpawner.onWaveComplete = () => {
      this.startNextWave();
    };
  }

  public startGame(): void {
    this.score = 0;
    this.lives = 3;
    this.wave = 1;
    this.isGameOver = false;
    this.isPaused = false;
    this.basket.resetPosition();
    this.updateHUD();
    this.itemSpawner.startWave(this.wave);
  }

  public togglePause(): void {
    if (this.isGameOver) return;
    this.isPaused = !this.isPaused;
  }

  public addScore(points: number): void {
    if (this.isGameOver) return;
    this.score += points;
    this.updateHUD();
  }

  public onItemMissed(): void {
    if (this.isGameOver) return;
    this.loseLife();
  }

  public onBombHit(): void {
    if (this.isGameOver) return;
    AudioManager.playSound('bomb');
    this.loseLife();
  }

  private loseLife(): void {
    this.lives--;
    this.updateHUD();

    if (this.lives <= 0) {
      this.triggerGameOver();
    }
  }

  private startNextWave(): void {
    if (this.isGameOver) return;

    this.wave++;
    this.updateHUD();
    this.itemSpawner.startWave(this.wave);
  }

  private triggerGameOver(): void {
    this.isGameOver = true;
    this.basket.active.isActive = false;
    AudioManager.playSound('game_over');
    this.onGameOverCallback();
  }

  public updateHUD(): void {
    this.hud.updateStats(this.score, this.lives, this.wave);
  }
}
