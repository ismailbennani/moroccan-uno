import { Component, Input } from '@angular/core';
import { Player, PlayerState } from '../../../game/game-types';
import { PlayerCustomizationService } from '../../common/player-customization/player-customization.service';
import { CardSize } from '../../common/card/card.component';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss'],
})
export class HandComponent {
  @Input()
  playerState: PlayerState;

  @Input()
  size: CardSize = 'lg';

  @Input()
  labelPosition: 'above' | 'below';

  constructor(private playerCustomizationService: PlayerCustomizationService) {}

  colorOf(player: Player) {
    return this.playerCustomizationService.getScheme(player).bgSelected;
  }

  getId(_, { id }: { id: number }) {
    return id;
  }
}
