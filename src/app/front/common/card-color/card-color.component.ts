import { Component, Input } from '@angular/core';
import { CardColor } from '../../../game/game-types';

@Component({
  selector: 'app-card-color',
  templateUrl: './card-color.component.html',
  styleUrls: ['./card-color.component.scss'],
})
export class CardColorComponent {
  @Input()
  color: CardColor;

  @Input()
  showName: boolean;

  getColor(color: CardColor) {
    switch (color) {
      case CardColor.Spades:
      case CardColor.Clubs:
        return 'rgb(0, 0, 0)';
      case CardColor.Diamonds:
      case CardColor.Hearts:
        return 'rgb(255, 0, 0)';
      default:
        return 'rgb(100, 100, 100)';
    }
  }

  getAssetPath(color: CardColor) {
    switch (color) {
      case CardColor.Spades:
        return 'assets/cards/small/other_suit_spades.png';
      case CardColor.Diamonds:
        return 'assets/cards/small/other_suit_diamonds.png';
      case CardColor.Clubs:
        return 'assets/cards/small/other_suit_clubs.png';
      case CardColor.Hearts:
        return 'assets/cards/small/other_suit_hearts.png';
      default:
        return 'assets/cards/small/dice_small_question.png';
    }
  }
}
