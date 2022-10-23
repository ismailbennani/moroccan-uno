import {
  CardColors,
  CardValues,
  FullGameState,
  GameState,
  hidePlayerState,
  IdentifiedCard,
  PlayerState,
} from './game-types';
import { Game } from 'boardgame.io';
import { RandomAPI } from 'boardgame.io/dist/types/src/plugins/random/random';

export interface GameConfig {
  readonly startingCards: number;
}

export class GameBuilder {
  constructor(private config: Partial<GameConfig> = {}) {}

  build(): Game<GameState> {
    return {
      setup: ({ ctx, random }) => {
        const deck = createDeck(random);
        const players = ctx.playOrder.map(p => ({ player: p, hand: [] }));
        const nCards = this.config.startingCards ?? 7;

        for (let i = 0; i < nCards; i++) {
          for (const player of players) {
            drawCardToPlayerHand(deck, player);
          }
        }

        const top = drawCard(deck);

        return {
          players: Object.fromEntries(players.map(p => [p.player, p])),
          deck,
          top,
          discard: [],
        };
      },

      playerView: ({ G, playerID }) => ({
        players: Object.fromEntries(
          Object.values(G.players).map(p =>
            p.player === playerID ? [p.player, p] : [p.player, hidePlayerState(p as PlayerState)]
          )
        ),
        deck: (G as FullGameState).deck.length,
        top: G.top,
        discard: G.discard,
      }),

      endIf: ({ G }) => {
        const handNotEmpty = [];

        for (const playerState of Object.values(G.players)) {
          if ((playerState as PlayerState).hand.length > 0) {
            handNotEmpty.push(playerState.player);
          }
        }

        switch (handNotEmpty.length) {
          case 0:
            return { draw: true };
          case 1:
            return { looser: handNotEmpty[0] };
          default:
            return void 0;
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
      deck.push({ id, value, color });

      id++;
    }
  }

  return random.Shuffle(deck);
}

function drawCard(deck: IdentifiedCard[]) {
  return deck.pop();
}

function drawCardToPlayerHand(deck: IdentifiedCard[], player: PlayerState) {
  const card = deck.pop();
  player.hand.push(card);
}
