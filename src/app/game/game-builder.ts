import {
  Card,
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
          skipNextTurn: Object.fromEntries(playerStates.map(p => [p.player, false])),
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
        drawCard: ({ G, playerID }): GameState => {
          return drawCardToPlayerHand(G, playerID);
        },
        playCard: (c, id: number): typeof INVALID_MOVE | GameState => {
          const { G, playerID } = c;

          const cardIndex = G.players[playerID].hand.findIndex(c => c.id === id);
          if (cardIndex < 0) {
            return INVALID_MOVE;
          }

          const card: IdentifiedCard = G.players[playerID].hand[cardIndex];

          if (!validCard(G.top, card)) {
            return INVALID_MOVE;
          }

          const newState = applyEffects(c, card);

          const newHand = G.players[playerID].hand.filter(c => c.id !== id);

          return {
            ...newState,
            players: Object.fromEntries(
              Object.values(newState.players).map(p =>
                p.player === playerID
                  ? [
                      p.player,
                      {
                        ...p,
                        hand: newHand,
                        handSize: newHand.length,
                      },
                    ]
                  : [p.player, p]
              )
            ),
            top: card,
            discard: addToDiscard(G.top, G.discard),
          };
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

export function validCard(top: Card, newCard: Card) {
  return top.value === newCard.value || top.color === newCard.color;
}

function applyEffects({ G, ctx, events }, card): GameState {
  let skipNextTurn = G.skipNextTurn;
  const nextPlayerPos = (ctx.playOrderPos + 1) % ctx.playOrder.length;
  const nextPlayer = ctx.playOrder[nextPlayerPos];

  switch (card.value) {
    case CardValue.Ace:
      skipNextTurn = Object.fromEntries(
        Object.entries(skipNextTurn).map(([p, b]) => (p === nextPlayer ? [p, true] : [p, b]))
      );
      break;
  }

  return {
    ...G,
    skipNextTurn,
  };
}
