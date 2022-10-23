import { PlayerID } from 'boardgame.io';

export type Player = PlayerID;

// ------------------------------------------------------------------------------
// CARDS
// ------------------------------------------------------------------------------

// ---- Value

export enum CardValue {
  Ace = '1',
  King = '12',
  Queen = '11',
  Jack = '10',
  Nine = '9',
  Eight = '8',
  Seven = '7',
  Six = '6',
  Five = '5',
  Four = '4',
  Three = '3',
  Two = '2',
}

export const CardValueNames = {
  '12': 'king',
  '11': 'queen',
  '10': 'jack',
  '9': 'nine',
  '8': 'eight',
  '7': 'seven',
  '6': 'six',
  '5': 'five',
  '4': 'four',
  '3': 'three',
  '2': 'two',
  '1': 'ace',
};

export const CardValues = Object.keys(CardValueNames);

// ---- Color

export enum CardColor {
  Spades = 'spades',
  Diamonds = 'diamonds',
  Clubs = 'clubs',
  Hearts = 'hearts',
}

export const CardColorNames = {
  spades: 'spades',
  diamonds: 'diamonds',
  clubs: 'clubs',
  hearts: 'hearts',
};

export const CardColors = Object.keys(CardColorNames);

export interface Card {
  value: CardValue;
  color: CardColor;
}

// ------------------------------------------------------------------------------
// STATE
// ------------------------------------------------------------------------------

export interface IdentifiedCard extends Card {
  readonly id: number;
}

export interface PlayerState {
  readonly player: Player;
  readonly hand: IdentifiedCard[];
  readonly handSize: number;
}

export interface GameState {
  readonly players: { [id: PlayerID]: PlayerState };
  readonly deck: IdentifiedCard[];
  readonly deckSize: number;
  readonly top: IdentifiedCard;
  readonly currentColorOverride: CardColor;
  readonly discard: IdentifiedCard[];
  readonly skipNextTurn: { [id: Player]: boolean };
}

export const hidePlayerState = (playerState: PlayerState): PlayerState => ({
  ...playerState,
  hand: null,
});

export const hideGameStateForPlayer = (gameState: GameState, player: PlayerID): GameState => ({
  ...gameState,
  players: Object.fromEntries(
    Object.values(gameState.players).map(p =>
      p.player === player ? [p.player, p] : [p.player, hidePlayerState(p as PlayerState)]
    )
  ),
  deck: [],
});

// ------------------------------------------------------------------------------
// GAME OVER
// ------------------------------------------------------------------------------

export interface Draw {
  draw: true;
}

export interface PlayerLost {
  winner: Player;
}

export type GameOver = Draw | PlayerLost;

export const isDraw = (gameover: GameOver): gameover is Draw => {
  return !!(gameover as unknown as Draw)?.draw;
};

export const playerWon = (gameover: GameOver): Player => {
  return isDraw(gameover) ? undefined : gameover.winner;
};
