import { appInstance } from './app/App';
import { SceneManager } from './managers/SceneManager';
import { MainMenuScene } from './scenes/MainMenuScene';

async function bootstrap() {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('Canvas element #game-canvas not found in DOM!');
  }

  // 1. Initialize PixiJS Application
  await appInstance.init(canvas);

  // 2. Initialize Scene Manager
  SceneManager.initialize();

  // 3. Load the initial scene
  const mainMenu = new MainMenuScene();
  SceneManager.changeScene(mainMenu);

  // Optional: Handle window resizing
  window.addEventListener('resize', () => {
    // Basic resize handling, can be expanded to maintain aspect ratio
    // appInstance.pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
    // SceneManager.currentScene?.resize(window.innerWidth, window.innerHeight);
  });
}

bootstrap().catch(console.error);
