import { Container } from 'pixi.js';
import { GameButton, type GameButtonOptions } from './GameButton';

export class GameList extends Container {
  private buttons: GameButton[] = [];
  private entryDelay: number = 60; // Frames to wait before starting animations
  private currentFrame: number = 0;
  private gap: number = 70; // Vertical gap between buttons

  constructor(games: GameButtonOptions[]) {
    super();

    games.forEach((gameConfig, index) => {
      const btn = new GameButton(gameConfig);

      // Setup initial animation state (Slide up + Fade in)
      btn.y = index * this.gap + 40; // Starts lower
      btn.alpha = 0;

      this.buttons.push(btn);
      this.addChild(btn);
    });
  }

  public update(delta: number): void {
    this.currentFrame += delta;

    this.buttons.forEach((btn, index) => {
      // Cascade delay: each button appears slightly after the previous one
      const btnDelay = this.entryDelay + index * 15;

      if (this.currentFrame > btnDelay) {
        // Fade in
        if (btn.alpha < 1) {
          btn.alpha = Math.min(1, btn.alpha + 0.04 * delta);
        }

        // Slide up to target Y
        const targetY = index * this.gap;
        if (Math.abs(btn.y - targetY) > 0.5) {
          btn.y += (targetY - btn.y) * 0.15 * delta;
        }
      }

      // Update button internal animations (scaling)
      btn.update(delta);
    });
  }
}
