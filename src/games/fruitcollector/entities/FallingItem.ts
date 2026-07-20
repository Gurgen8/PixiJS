import { Container, Text, TextStyle } from 'pixi.js';

export type ItemType = 'fruit' | 'bomb';

const FRUIT_EMOJIS = ['🍎', '🍌', '🍒', '🍉', '🍇'];
const BOMB_EMOJI = '💣';

export class FallingItem extends Container {
  public isActive: boolean = false;
  public itemType: ItemType = 'fruit';
  public speed: number = 3;

  public hitWidth: number = 40;
  public hitHeight: number = 40;

  private sprite: Text;

  constructor() {
    super();

    this.sprite = new Text({
      text: '',
      style: new TextStyle({ fontSize: 40 }),
    });
    this.sprite.anchor.set(0.5);

    this.addChild(this.sprite);

    this.width = this.hitWidth;
    this.height = this.hitHeight;
  }

  public spawn(x: number, y: number, type: ItemType, speedMult: number): void {
    this.isActive = true;
    this.itemType = type;
    this.position.set(x, y);
    this.speed = (Math.random() * 2 + 3) * speedMult; // base speed 3-5 * multiplier

    if (this.itemType === 'fruit') {
      const randomFruit = FRUIT_EMOJIS[Math.floor(Math.random() * FRUIT_EMOJIS.length)];
      this.sprite.text = randomFruit;
    } else {
      this.sprite.text = BOMB_EMOJI;
    }

    this.visible = true;
  }

  public hit(): void {
    this.isActive = false;
    this.visible = false;
  }

  public update(delta: number): void {
    if (!this.isActive) return;

    this.y += this.speed * delta;
  }
}
