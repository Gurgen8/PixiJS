import { Container } from 'pixi.js';

/**
 * Base Scene class. All game scenes must inherit from this.
 */
export abstract class BaseScene extends Container {
  constructor() {
    super();
  }

  /**
   * Called every frame by the SceneManager.
   * @param delta The delta time since last frame (in frames or ms, depending on ticker setup)
   */
  public abstract update(delta: number): void;

  /**
   * Called when the window is resized.
   */
  public abstract resize(width: number, height: number): void;

  /**
   * Called right before the scene is destroyed.
   * Useful for cleaning up local events, object pools, or listeners.
   */
  public abstract destroyScene(): void;
}
