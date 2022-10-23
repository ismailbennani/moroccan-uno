import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card, IdentifiedCard, Player, PlayerState } from '../../../game/game-types';
import { PlayerCustomizationService } from '../../common/player-customization/player-customization.service';
import { CardSize } from '../../common/card/card.component';
import { validCard } from '../../../game/game-builder';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss'],
})
export class HandComponent {
  @Input()
  top: Card;

  @Input()
  playerState: PlayerState;

  @Input()
  size: CardSize = 'lg';

  @Input()
  labelPosition: 'above' | 'below';

  @Output()
  clickCard: EventEmitter<IdentifiedCard> = new EventEmitter<IdentifiedCard>();

  constructor(private playerCustomizationService: PlayerCustomizationService) {}

  canPlay(card: Card) {
    return !top || validCard(this.top, card);
  }

  colorOf(player: Player) {
    return this.playerCustomizationService.getScheme(player).bgSelected;
  }

  getId(_, { id }: { id: number }) {
    return id;
  }
}
