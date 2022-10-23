import {CardColors, CardValues, GameState, IdentifiedCard, PlayerState} from './game-types';
import {Game} from 'boardgame.io';
import {RandomAPI} from "boardgame.io/dist/types/src/plugins/random/random";
import {PlayerView} from "boardgame.io/core";

export interface GameConfig {
  readonly startingCards: number;
}

export class GameBuilder {
  constructor(private config: Partial<GameConfig> = {}) {
  }

  build(): Game<GameState> {
    return {
      setup: ({ctx, random}) => {
        const deck = createDeck(random);
        const players = ctx.playOrder.map(p => ({player: p, hand: []}));
        const nCards = this.config.startingCards ?? 7;

        for (let i = 0; i < nCards; i++) {
          for (const player of players) {
            drawCard(deck, player);
          }
        }

        return {
          players: Object.fromEntries(players.map(p => [p.player, p])),
          deck,
        };
      },

      playerView: PlayerView.STRIP_SECRETS,

      endIf: ({ G }) => {
        const handNotEmpty = [];

        for (const playerState of Object.values(G.players)) {
          if (playerState.hand.length > 0) {
            handNotEmpty.push(playerState.player);
          }
        }

        switch (handNotEmpty.length) {
          case 0:
            return { draw: true };
          case 1:
            return { looser: handNotEmpty[0] }
          default:
            return void 0
        }
      },
    };
  }
}

function createDeck(random: RandomAPI) {
  const deck = [];

  let id = 1;

  for (const color of CardColors) {
    for (const value of CardValues) {
      deck.push({id, value, color});

      id++;
    }
  }

  return random.Shuffle(deck);
}

function drawCard(deck: IdentifiedCard[], player: PlayerState) {
  const card = deck.pop();
  player.hand.push(card);
}
