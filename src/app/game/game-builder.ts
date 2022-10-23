import { GameState } from './game-types';
import { Game } from 'boardgame.io';

export class GameBuilder {
  constructor() {}

  build(): Game<GameState> {
    return {
      setup: _ => ({
        // INITIAL STATE
      }),

      endIf: _ => ({ draw: true }),
    };
  }
}
