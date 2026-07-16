import { Container, Graphics } from 'pixi.js';

interface Star {
  graphics: Graphics;
  speed: number;
}

export class BackgroundAnimation extends Container {
  private stars: Star[] = [];
  private screenWidth: number;
  private screenHeight: number;

  constructor(width: number, height: number) {
    super();
    this.screenWidth = width;
    this.screenHeight = height;

    this.initStars(150);
  }

  private initStars(count: number): void {
    const tints = [0xffffff, 0xaaccff, 0xffffcc, 0xffaacc];

    for (let i = 0; i < count; i++) {
      const graphics = new Graphics();
      const radius = Math.random() * 1.5 + 0.5;

      graphics.circle(0, 0, radius);

      const color = tints[Math.floor(Math.random() * tints.length)];
      const alpha = Math.random() * 0.8 + 0.2;

      graphics.fill({ color, alpha });

      graphics.x = Math.random() * this.screenWidth;
      graphics.y = Math.random() * this.screenHeight;

      // Stars with a larger radius move faster (parallax effect)
      const speed = radius * 0.2 + Math.random() * 0.1;

      this.stars.push({
        graphics,
        speed,
      });

      this.addChild(graphics);
    }
  }

  public update(delta: number): void {
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      star.graphics.y += star.speed * delta;

      // Loop back to the top
      if (star.graphics.y > this.screenHeight) {
        star.graphics.y = 0;
        star.graphics.x = Math.random() * this.screenWidth;
      }
    }
  }

  public resize(width: number, height: number): void {
    this.screenWidth = width;
    this.screenHeight = height;

    this.stars.forEach((star) => {
      // Reposition stars that fall out of bounds
      if (star.graphics.x > width) star.graphics.x = Math.random() * width;
      if (star.graphics.y > height) star.graphics.y = Math.random() * height;
    });
  }
}
