import { Assets } from 'pixi.js';

/**
 * Менеджер ресурсов (Assets).
 * Обертка над PIXI.Assets для более удобной предзагрузки бандлов и звуков.
 */
export class AssetManager {
  public static async init(): Promise<void> {
    await Assets.init();
  }

  /**
   * Загружает группу ресурсов
   * @param assets Массив путей или алиасов для загрузки
   * @param onProgress Коллбэк для отображения прогресса (от 0 до 1)
   */
  public static async loadAssets(
    assets: Array<{ alias: string; src: string }>,
    onProgress?: (progress: number) => void,
  ): Promise<void> {
    Assets.addBundle('main-bundle', assets);
    await Assets.loadBundle('main-bundle', onProgress);
  }
}
