import {
  Card,
  CardColor,
  CardColors,
  CardValue,
  CardValues,
  GameState,
  hideGameStateForPlayer,
  IdentifiedCard,
  Player,
  PlayerState,
} from './game-types';
import { Game } from 'boardgame.io';
import { RandomAPI } from 'boardgame.io/dist/types/src/plugins/random/random';
import { INVALID_MOVE } from 'boardgame.io/core';

export interface GameConfig {
  readonly startingCards: number;
}

export class GameBuilder {
  constructor(private config: Partial<GameConfig> = {}) {}

  build(): Game<GameState> {
    return {
      setup: ({ ctx, random }): GameState => {
        const deck = createDeck(random);
        const playerStates: PlayerState[] = ctx.playOrder.map(p => ({ player: p, hand: [], handSize: 0 }));
        const nCards = this.config.startingCards ?? 7;

        let state: GameState = {
          players: Object.fromEntries(playerStates.map(p => [p.player, p])),
          deck,
          deckSize: deck.length,
          top: null,
          currentColorOverride: null,
          discard: [],
          skipNextTurn: Object.fromEntries(playerStates.map(p => [p.player, false])),
        };

        for (const player of playerStates.map(p => p.player)) {
          drawCardToPlayerHand(state, player, nCards);
        }

        drawCardToTop(state);

        return state;
      },

      playerView: ({ G, playerID }) => hideGameStateForPlayer(G, playerID),

      moves: {
        drawCard: ({ G, playerID }): typeof INVALID_MOVE | void => {
          if (G.deck.length === 0) {
            return INVALID_MOVE;
          }

          drawCardToPlayerHand(G, playerID);
        },

        playCard: ({ G, ctx, playerID }, id: number, newColor?: CardColor): typeof INVALID_MOVE | void => {
          // CHECK IF MOVE IS VALID
          const cardIndex = G.players[playerID].hand.findIndex(c => c.id === id);
          if (cardIndex < 0) {
            return INVALID_MOVE;
          }

          const card: IdentifiedCard = G.players[playerID].hand[cardIndex];

          if (!validCard(G.top, G.currentColorOverride, card)) {
            return INVALID_MOVE;
          }

          // OVERRIDE COLOR IF CARD IS SEVEN
          if (card.value === CardValue.Seven) {
            if (!newColor || newColor === G.top?.color) {
              return INVALID_MOVE;
            }

            (G as any).currentColorOverride = newColor;
          } else {
            (G as any).currentColorOverride = null;
          }

          // APPLY EFFECTS TO NEXT PLAYER IF ANY
          const nextPlayerPos = (ctx.playOrderPos + 1) % ctx.playOrder.length;
          const nextPlayer = ctx.playOrder[nextPlayerPos];

          switch (card.value) {
            case CardValue.Ace:
              G.skipNextTurn[nextPlayer] = true;
              break;
            case CardValue.Two:
              drawCardToPlayerHand(G, nextPlayer, 2);
              break;
          }

          // PLAY CARD
          G.players[playerID].hand.splice(cardIndex, 1);
          (G.players[playerID] as any).handSize = G.players[playerID].hand.length;

          if (G.top != null) {
            G.discard.push(G.top);
          }

          (G as any).top = card;
        },
      },

      turn: {
        minMoves: 0,
        maxMoves: 1,

        onBegin: ({ G, ctx, events }) => {
          const player = ctx.currentPlayer;

          if (G.skipNextTurn[player]) {
            events.endTurn();
            G.skipNextTurn[player] = false;
          }
        },

        onEnd: ({ G, random }) => {
          if (G.deck.length === 0 && G.discard.length > 0) {
            (G as any).deck = random.Shuffle(G.discard);
            (G as any).deckSize = G.deck.length;
            (G as any).discard = [];
          }
        },
      },

      endIf: ({ G }) => {
        const handEmpty = [];

        for (const playerState of Object.values(G.players)) {
          if (playerState.handSize === 0) {
            handEmpty.push(playerState.player);
          }
        }

        switch (handEmpty.length) {
          case 0:
            return void 0;
          case 1:
            return { winner: handEmpty[0] };
          default:
            return { draw: true };
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

function drawCardToTop(G: GameState): void {
  if (G.top) {
    G.discard.push(G.top);
  }

  (G as any).top = G.deck.pop();
  (G as any).deckSize = G.deck.length;
}

function drawCardToPlayerHand(G: GameState, player: Player, n: number = 1): void {
  if (!G.players[player].hand) {
    return;
  }

  for (let i = 0; i < n; i++) {
    G.players[player].hand.push(G.deck.pop());
  }

  (G as any).deckSize = G.deck.length;
  (G.players[player] as any).handSize = G.players[player].hand.length;
}

export function validCard(top: Card, colorOverride: CardColor, newCard: Card) {
  return (
    top.value === newCard.value || (!colorOverride && top.color === newCard.color) || newCard.color === colorOverride
  );
}
