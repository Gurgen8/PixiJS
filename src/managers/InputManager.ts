/**
 * Менеджер ввода.
 * Отслеживает состояние клавиш на клавиатуре.
 * В коммерческой разработке он также отвечает за геймпады и мобильный тач.
 */
export class InputManager {
  private static keys: { [key: string]: boolean } = {};
  private static keysJustPressed: { [key: string]: boolean } = {};

  public static init(): void {
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
    window.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('pointerup', this.onPointerUp.bind(this));
  }

  private static onKeyDown(e: KeyboardEvent): void {
    if (!this.keys[e.code]) {
      this.keysJustPressed[e.code] = true;
    }
    this.keys[e.code] = true;
  }

  private static onKeyUp(e: KeyboardEvent): void {
    this.keys[e.code] = false;
  }

  private static onPointerDown(e: PointerEvent): void {
    if (e.button === 0) {
      this.keys['MouseLeft'] = true;
    }
  }

  private static onPointerUp(e: PointerEvent): void {
    if (e.button === 0) {
      this.keys['MouseLeft'] = false;
    }
  }

  /**
   * Проверяет, нажата ли клавиша (например, 'Space', 'ArrowLeft', 'MouseLeft')
   */
  public static isKeyDown(keyCode: string): boolean {
    return this.keys[keyCode] === true;
  }

  /**
   * Проверяет, была ли клавиша только что нажата (срабатывает 1 раз за нажатие)
   */
  public static isKeyJustPressed(keyCode: string): boolean {
    if (this.keysJustPressed[keyCode]) {
      this.keysJustPressed[keyCode] = false;
      return true;
    }
    return false;
  }
}
