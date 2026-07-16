export const GameEvents = {
  SCORE_ADDED: 'scoreAdded',
  PLAYER_HIT: 'playerHit',
  PLAYER_DIED: 'playerDied',
  GAME_OVER: 'gameOver',
  GAME_RESTART: 'gameRestart',
  ENEMY_DESTROYED: 'enemyDestroyed',
} as const;

export type GameEvents = (typeof GameEvents)[keyof typeof GameEvents];
