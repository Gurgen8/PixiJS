import { type ItemType } from '../entities/FallingItem';

export class ItemComponent {
  public itemType: ItemType;
  constructor(itemType: ItemType = 'fruit') {
    this.itemType = itemType;
  }
}
