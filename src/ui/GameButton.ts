import { Container, Text, TextStyle } from 'pixi.js';

export interface GameButtonOptions {
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

export class GameButton extends Container {
  private buttonText: Text;
  private isActive: boolean;
  private onClickHandler?: () => void;

  private targetScale: number = 1;
  private currentScale: number = 1;

  constructor(options: GameButtonOptions) {
    super();
    this.isActive = options.isActive;
    this.onClickHandler = options.onClick;

    const fillColor = this.isActive ? '#ffffff' : '#666666';

    const style = new TextStyle({
      fill: fillColor,
      fontSize: 32,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      letterSpacing: 2,
      dropShadow: this.isActive
        ? {
            alpha: 0.5,
            angle: Math.PI / 4,
            blur: 5,
            color: 0x000000,
            distance: 2,
          }
        : undefined,
    });

    const prefix = this.isActive ? '▶ ' : '▷ ';
    const suffix = this.isActive ? '' : ' (Coming Soon)';

    this.buttonText = new Text({ text: prefix + options.label + suffix, style });
    this.buttonText.anchor.set(0.5);
    this.addChild(this.buttonText);

    if (this.isActive) {
      this.buttonText.eventMode = 'static';
      this.buttonText.cursor = 'pointer';

      this.buttonText.on('pointerover', this.onPointerOver, this);
      this.buttonText.on('pointerout', this.onPointerOut, this);
      this.buttonText.on('pointerdown', this.onPointerDown, this);
      this.buttonText.on('pointerup', this.onPointerUp, this);
    }
  }

  private onPointerOver(): void {
    this.targetScale = 1.15;
    this.buttonText.style.fill = '#00ffff';
  }

  private onPointerOut(): void {
    this.targetScale = 1;
    this.buttonText.style.fill = '#ffffff';
  }

  private onPointerDown(): void {
    this.targetScale = 0.95;
  }

  private onPointerUp(): void {
    this.targetScale = 1.15;
    if (this.onClickHandler) {
      this.onClickHandler();
    }
  }

  public update(delta: number): void {
    // Smooth scaling animation using linear interpolation
    if (Math.abs(this.currentScale - this.targetScale) > 0.001) {
      this.currentScale += (this.targetScale - this.currentScale) * 0.2 * delta;
      this.buttonText.scale.set(this.currentScale);
    }
  }
}
