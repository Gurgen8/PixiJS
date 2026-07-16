/**
 * Менеджер ввода.
 * Отслеживает состояние клавиш на клавиатуре.
 * В коммерческой разработке он также отвечает за геймпады и мобильный тач.
 */
export class InputManager {
  private static keys: { [key: string]: boolean } = {};

  public static init(): void {
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  private static onKeyDown(e: KeyboardEvent): void {
    this.keys[e.code] = true;
  }

  private static onKeyUp(e: KeyboardEvent): void {
    this.keys[e.code] = false;
  }

  /**
   * Проверяет, нажата ли клавиша (например, 'Space', 'ArrowLeft')
   */
  public static isKeyDown(keyCode: string): boolean {
    return this.keys[keyCode] === true;
  }
}
