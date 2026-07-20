import { HUD } from '@/games/bomberman/ui/HUD';
import { Player } from '@/games/bomberman/entities/Player';
import { AudioManager } from '@/managers/AudioManager';

export class GameManager {
  public score: number = 0;
  public lives: number = 3;
  public level: number = 1;
  public isGameOver: boolean = false;
  public isPaused: boolean = false;

  public bombCapacity: number = 1;
  public bombRange: number = 2; // In grid cells

  private hud: HUD;
  private player: Player;
  private onGameOverCallback: () => void;
  private onLevelCompleteCallback: () => void;

  constructor(hud: HUD, player: Player, onGameOver: () => void, onLevelComplete: () => void) {
    this.hud = hud;
    this.player = player;
    this.onGameOverCallback = onGameOver;
    this.onLevelCompleteCallback = onLevelComplete;
  }

  public startGame(): void {
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.bombCapacity = 1;
    this.bombRange = 2;
    this.isGameOver = false;
    this.isPaused = false;
    this.updateHUD();
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

  public increaseBombCapacity(): void {
    this.bombCapacity++;
    this.updateHUD();
  }

  public increaseBombRange(): void {
    this.bombRange++;
  }

  public onPlayerHit(): void {
    if (this.isGameOver) return;

    AudioManager.playSound('death');
    this.lives--;
    this.updateHUD();

    if (this.lives <= 0) {
      this.triggerGameOver();
    } else {
      // Just visually reset player without a full scene reload for now
      this.player.resetToSpawn();
    }
  }

  public completeLevel(): void {
    if (this.isGameOver) return;
    this.level++;
    this.onLevelCompleteCallback();
  }

  private triggerGameOver(): void {
    this.isGameOver = true;
    this.player.isActive = false;
    this.onGameOverCallback();
  }

  public updateHUD(): void {
    this.hud.updateStats(this.score, this.lives, this.level, this.bombCapacity);
  }
}
