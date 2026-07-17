import { EnemySpawner } from './systems/EnemySpawner';
import { HUD } from './ui/HUD';
import { Player } from './entities/Player';
import { AudioManager } from '../../managers/AudioManager';

export class GameManager {
  public score: number = 0;
  public lives: number = 3;
  public wave: number = 1;
  public isGameOver: boolean = false;
  public isPaused: boolean = false;

  private enemySpawner: EnemySpawner;
  private hud: HUD;
  private player: Player;
  private onGameOverCallback: () => void;

  constructor(enemySpawner: EnemySpawner, hud: HUD, player: Player, onGameOver: () => void) {
    this.enemySpawner = enemySpawner;
    this.hud = hud;
    this.player = player;
    this.onGameOverCallback = onGameOver;

    this.enemySpawner.onWaveComplete = () => {
      this.startNextWave();
    };
  }

  public startGame(): void {
    this.score = 0;
    this.lives = 3;
    this.wave = 1;
    this.isGameOver = false;
    this.isPaused = false;
    this.player.resetPosition();
    this.updateHUD();
    this.enemySpawner.startWave(this.wave);
  }

  public togglePause(): void {
    if (this.isGameOver) return;
    this.isPaused = !this.isPaused;
  }

  public addScore(points: number): void {
    if (this.isGameOver) return;
    this.score += points;
    this.updateHUD();
    AudioManager.playSound('explosion');
  }

  public onPlayerHit(): void {
    if (this.isGameOver) return;

    this.lives--;
    this.updateHUD();
    AudioManager.playSound('player_hit');

    if (this.lives <= 0) {
      this.triggerGameOver();
    } else {
      // Temporarily give player invincibility or just reset position?
      // For now, let's just let them continue.
    }
  }

  private startNextWave(): void {
    if (this.isGameOver) return;

    this.wave++;
    this.updateHUD();
    AudioManager.playSound('wave_complete');
    this.enemySpawner.startWave(this.wave);
  }

  private triggerGameOver(): void {
    this.isGameOver = true;
    this.player.isActive = false;
    this.player.explode();
    AudioManager.playSound('game_over');
    this.onGameOverCallback();
  }

  public updateHUD(): void {
    this.hud.updateStats(this.score, this.lives, this.wave);
  }
}
