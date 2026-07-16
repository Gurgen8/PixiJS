import { Container } from 'pixi.js';

/**
 * Базовый класс Сцены.
 * Сцена - это отдельный "экран" или "состояние" игры (например, Меню, Игра, Экран победы).
 * Все объекты на сцене добавляются в ее корневой контейнер (this.container).
 */
export abstract class Scene {
  public container: Container;

  constructor() {
    this.container = new Container();
  }

  /**
   * Вызывается при запуске сцены
   */
  public abstract init(): void | Promise<void>;

  /**
   * Вызывается каждый кадр (Game Loop)
   * @param dt Delta Time (коэффициент времени)
   * @param ms Миллисекунды, прошедшие с прошлого кадра
   */
  public abstract update(dt: number, ms: number): void;

  /**
   * Вызывается при уничтожении сцены или переходе на другую
   */
  public abstract destroy(): void;
}
