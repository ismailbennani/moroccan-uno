import { Injectable, isDevMode } from '@angular/core';
import { GameOver, GameState, Player } from '../../game/game-types';
import { CredentialedActionShape, Game, State } from 'boardgame.io';
import { GameBuilder } from '../../game/game-builder';
import { Local } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/client';
import { _ClientImpl } from 'boardgame.io/dist/types/src/client/client';
import { Bot, MCTSBot } from 'boardgame.io/ai';
import MakeMove = CredentialedActionShape.MakeMove;

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public static readonly StorageKey = 'game';

  private game: Game<GameState>;
  private clients: { [id: Player]: _ClientImpl<GameState> } = {};
  private spectator: _ClientImpl<GameState>;
  private bot: Bot;

  get state(): State<GameState> {
    return this.spectator?.getState();
  }

  get currentPlayer(): Player {
    return this.state?.ctx.currentPlayer;
  }

  get players(): Player[] {
    return Object.keys(this.clients);
  }

  get gameover(): GameOver {
    return this.state?.ctx.gameover;
  }

  constructor() {
    this.game = new GameBuilder().build();
    this.bot = new MCTSBot({
      game: this.game,
      enumerate: this.game.ai.enumerate,
      iterations: 100,
      playoutDepth: 10,
    });

    const firstClient = Client({
      game: this.game,
      playerID: '0',
      multiplayer: Local({ persist: true, storageKey: GameService.StorageKey }),
      debug: isDevMode(),
    });
    firstClient.start();

    const { ctx } = firstClient.getInitialState();

    for (const player of ctx.playOrder) {
      if (player === firstClient.playerID) {
        this.clients[player] = firstClient;
      } else {
        this.clients[player] = Client({
          game: this.game,
          playerID: player,
          multiplayer: Local({ persist: true, storageKey: GameService.StorageKey }),
          debug: isDevMode(),
        });
        this.clients[player].start();

        if (this.isAIPlayer(player)) {
          this.clients[player].subscribe(state => {
            if (state.ctx.currentPlayer !== player) {
              return;
            }

            this.bot.play(state, player).then(({ action }) => {
              const move = action as MakeMove;
              if (move.payload.args) {
                this.clients[player].moves[move.payload.type](...move.payload.args);
              } else {
                this.clients[player].moves[move.payload.type]();
              }
            });
          });
        }
      }
    }

    this.spectator = Client({
      game: this.game,
      playerID: 'spec',
      multiplayer: Local({ persist: true, storageKey: GameService.StorageKey }),
      debug: isDevMode(),
    });
    this.spectator.start();
  }

  getPlayerClient(player: Player) {
    return this.clients[player];
  }

  getSpectator() {
    return this.spectator;
  }

  isAIPlayer(player: Player): boolean {
    return player !== '0';
  }
}
