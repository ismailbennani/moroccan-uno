import {
  CardColors,
  CardValues,
  GameState,
  hideGameStateForPlayer,
  IdentifiedCard,
  Player,
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
        const playerStates: PlayerState[] = ctx.playOrder.map(p => ({ player: p, hand: [], handSize: 0 }));
        const nCards = this.config.startingCards ?? 7;

        let state = {
          players: Object.fromEntries(playerStates.map(p => [p.player, p])),
          deck,
          deckSize: deck.length,
          top: null,
          discard: [],
        };

        for (let i = 0; i < nCards; i++) {
          for (const player of playerStates.map(p => p.player)) {
            state = drawCardToPlayerHand(state, player);
          }
        }

        return drawCardToTop(state);
      },

      playerView: ({ G, playerID }) => hideGameStateForPlayer(G, playerID),

      moves: {
        drawCard: ({ G, playerID }) => {
          return drawCardToPlayerHand(G, playerID);
        },
      },

      turn: {
        minMoves: 1,
        maxMoves: 1,
      },

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

function addToDiscard(card: IdentifiedCard, discard: IdentifiedCard[]) {
  if (!card) {
    return discard;
  }

  if (!discard || discard.length === 0) {
    return [card];
  }

  return [card, ...discard];
}

function drawCardToTop(G: GameState): GameState {
  const card = G.deck.pop();

  return {
    ...G,
    deckSize: G.deckSize - 1,
    top: card,
    discard: addToDiscard(G.top, G.discard),
  };
}

function drawCardToPlayerHand(G: GameState, player: Player): GameState {
  const newDeck = [...G.deck];
  const card = newDeck.pop();

  return {
    ...G,
    deck: newDeck,
    deckSize: newDeck.length,
    players: Object.fromEntries(
      Object.values(G.players).map(p =>
        p.player === player
          ? [
              p.player,
              {
                ...p,
                hand: [...p.hand, card],
                handSize: p.handSize + 1,
              },
            ]
          : [p.player, p]
      )
    ),
  };
}
