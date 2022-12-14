import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card, CardColor, CardValue } from '../../../game/game-types';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  private readonly root = 'assets/cards';

  @Input()
  set hidden(b: boolean) {
    this._hidden = b;
    this.update();
  }

  @Input()
  set card(c: Card) {
    this._card = c;
    this.update();
  }

  @Input()
  set size(s: CardSize) {
    this._size = s;
    this.update();
  }

  @Input()
  disabled: boolean;

  @Input()
  selected: boolean;

  @Output()
  hover: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  clickCard: EventEmitter<void> = new EventEmitter<void>();

  asset: string;
  cardName: string;

  private _hidden: boolean;
  private _card: Card;
  private _size: CardSize;

  constructor() {}

  private update() {
    const dir = this.getDir();

    this.cardName = this.getCard();
    this.asset = `${this.root}/${dir}/${this.cardName}.png`;
  }

  private getDir() {
    switch (this._size) {
      case 'sm':
        return 'small';
      case 'md':
        return 'medium';
      case 'lg':
      default:
        return 'large';
    }
  }

  private getCard() {
    if (this._hidden) {
      return 'card_back';
    } else if (!this._card?.color || !this._card?.value) {
      return 'card_empty';
    } else {
      const color = this.getColor();
      const value = this.getValue();

      return `card_${color}_${value}`;
    }
  }

  private getColor() {
    switch (this._card.color) {
      case CardColor.Spades:
        return 'spades';
      case CardColor.Diamonds:
        return 'diamonds';
      case CardColor.Clubs:
        return 'clubs';
      case CardColor.Hearts:
        return 'hearts';
      default:
        throw new Error('Invalid color');
    }
  }

  private getValue() {
    switch (this._card.value) {
      case CardValue.Ace:
        return 'A';
      case CardValue.King:
        return 'K';
      case CardValue.Queen:
        return 'Q';
      case CardValue.Jack:
        return 'J';
      case CardValue.Nine:
        return '09';
      case CardValue.Eight:
        return '08';
      case CardValue.Seven:
        return '07';
      case CardValue.Six:
        return '06';
      case CardValue.Five:
        return '05';
      case CardValue.Four:
        return '04';
      case CardValue.Three:
        return '03';
      case CardValue.Two:
        return '02';
      default:
        throw new Error('Invalid value');
    }
  }

  onClick() {
    if (this.disabled) {
      return;
    }

    this.clickCard.emit();
  }

  onHover(b: boolean) {
    if (this.disabled) {
      return;
    }

    this.hover.emit(b);
  }
}

export type CardSize = 'sm' | 'md' | 'lg';
