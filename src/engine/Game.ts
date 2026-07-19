import { Application, Ticker } from 'pixi.js';
import { GameConfig } from '@/config/GameConfig';
import { SceneManager } from '@/managers/SceneManager';
import { AssetManager } from '@/managers/AssetManager';

/**
 * Класс Game - это фасад нашего движка.
 * Он инициализирует Pixi.js Application, настраивает Game Loop и управляет глобальными менеджерами.
 *
 * Паттерн Singleton используется здесь для того, чтобы у нас всегда был единый доступ к приложению
 * из любой точки кода.
 */
export class Game {
  private static instance: Game;
  public app: Application;

  private constructor() {
    this.app = new Application();
  }

  public static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  /**
   * Инициализация приложения
   * @param canvas Элемент canvas, на котором будет рисовать Pixi
   */
  public async init(canvas: HTMLCanvasElement): Promise<void> {
    // Инициализация Pixi Application (v8)
    await this.app.init({
      canvas: canvas,
      width: GameConfig.width,
      height: GameConfig.height,
      backgroundColor: GameConfig.backgroundColor,
      resolution: GameConfig.resolution,
      autoDensity: GameConfig.autoDensity,
    });

    // Инициализация менеджеров
    await AssetManager.init();

    // Настраиваем Game Loop
    this.app.ticker.add((ticker: Ticker) => {
      SceneManager.update(ticker);
    });

    // Обработка изменения размера окна (Responsive Canvas)
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }

  /**
   * Логика для Responsive Canvas.
   * Растягивает canvas с сохранением пропорций (Letterboxing/Pillarboxing).
   */
  private resize(): void {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const scale = Math.min(screenWidth / GameConfig.width, screenHeight / GameConfig.height);

    const newWidth = Math.floor(scale * GameConfig.width);
    const newHeight = Math.floor(scale * GameConfig.height);

    this.app.canvas.style.width = `${newWidth}px`;
    this.app.canvas.style.height = `${newHeight}px`;

    // Центрируем
    this.app.canvas.style.position = 'absolute';
    this.app.canvas.style.left = `${(screenWidth - newWidth) / 2}px`;
    this.app.canvas.style.top = `${(screenHeight - newHeight) / 2}px`;
  }
}
