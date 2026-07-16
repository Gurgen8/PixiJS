import { Container, Text, TextStyle, FillGradient } from 'pixi.js';

export class LogoAnimation extends Container {
  private titleText: Text;
  private time: number = 0;

  constructor() {
    super();

    const fillGradient = new FillGradient(0, 0, 0, 64);
    fillGradient.addColorStop(0, '#ffffff');
    fillGradient.addColorStop(1, '#44aaff');

    const style = new TextStyle({
      fill: fillGradient,
      fontSize: 64,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      letterSpacing: 8,
      dropShadow: {
        alpha: 0.8,
        angle: Math.PI / 6,
        blur: 15,
        color: 0x0088ff,
        distance: 0,
      },
    });

    this.titleText = new Text({ text: 'SPACE SHOOTER', style });
    this.titleText.anchor.set(0.5);

    // Initial state for animation
    this.titleText.alpha = 0;
    this.titleText.y = -50;

    this.addChild(this.titleText);
  }

  public update(delta: number): void {
    this.time += delta;

    // Fade in
    if (this.titleText.alpha < 1) {
      this.titleText.alpha = Math.min(1, this.titleText.alpha + 0.02 * delta);
    }

    // Slide down to 0
    if (Math.abs(this.titleText.y) > 0.5) {
      this.titleText.y += (0 - this.titleText.y) * 0.05 * delta;
    }

    // Continuous floating/pulsating effect
    this.titleText.scale.set(1 + Math.sin(this.time * 0.03) * 0.03);
    this.titleText.rotation = Math.sin(this.time * 0.015) * 0.015;
  }
}
