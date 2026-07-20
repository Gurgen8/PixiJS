import { Container, Text, TextStyle } from 'pixi.js';

import { VelocityComponent } from '../components/VelocityComponent';
import { ActiveComponent } from '../components/ActiveComponent';
import { CollisionComponent } from '../components/CollisionComponent';
import { ItemComponent } from '../components/ItemComponent';

export type ItemType = 'fruit' | 'bomb';

const FRUIT_EMOJIS = ['🍎', '🍌', '🍒', '🍉', '🍇'];
const BOMB_EMOJI = '💣';

export class FallingItem extends Container {
  public active: ActiveComponent = new ActiveComponent(false);
  public item: ItemComponent = new ItemComponent('fruit');
  public velocity: VelocityComponent = new VelocityComponent(3);
  public collision: CollisionComponent = new CollisionComponent(40, 40);

  private sprite: Text;

  constructor() {
    super();

    this.sprite = new Text({
      text: '',
      style: new TextStyle({ fontSize: 40 }),
    });
    this.sprite.anchor.set(0.5);

    this.addChild(this.sprite);

    this.width = this.collision.hitWidth;
    this.height = this.collision.hitHeight;
  }

  public spawn(x: number, y: number, type: ItemType, speedMult: number): void {
    this.active.isActive = true;
    this.item.itemType = type;
    this.position.set(x, y);
    this.velocity.speed = (Math.random() * 2 + 3) * speedMult; // base speed 3-5 * multiplier

    if (this.item.itemType === 'fruit') {
      const randomFruit = FRUIT_EMOJIS[Math.floor(Math.random() * FRUIT_EMOJIS.length)];
      this.sprite.text = randomFruit;
    } else {
      this.sprite.text = BOMB_EMOJI;
    }

    this.visible = true;
  }

  public hit(): void {
    this.active.isActive = false;
    this.visible = false;
  }

  public update(delta: number): void {
    if (!this.active.isActive) return;

    this.y += this.velocity.speed * delta;
  }
}
