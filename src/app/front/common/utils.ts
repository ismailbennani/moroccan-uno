import { GameService } from './game.service';

export const resetState = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(GameService.StorageKey)) {
      localStorage.removeItem(key);
    }
  }
};
