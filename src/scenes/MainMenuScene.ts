import { Text, TextStyle } from 'pixi.js';
import { BaseScene } from './BaseScene';

export class MainMenuScene extends BaseScene {
  private titleText: Text;

  constructor() {
    super();

    const style = new TextStyle({
      fill: 0xffffff,
      fontSize: 48,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      letterSpacing: 4,
    });

    this.titleText = new Text({ text: 'SPACE SHOOTER', style });
    this.titleText.anchor.set(0.5);
    // Center based on default config size, we'll implement resize properly later
    this.titleText.position.set(400, 300);

    this.addChild(this.titleText);
  }

  public update(_delta: number): void {
    // Simple pulsating effect for the title text using delta time or Date.now()
    this.titleText.scale.set(1 + Math.sin(Date.now() / 300) * 0.05);
  }

  public resize(width: number, height: number): void {
    this.titleText.position.set(width / 2, height / 2);
  }

  public destroyScene(): void {
    // Cleanup any local listeners or objects here
  }
}
