import { Component } from '@angular/core';
import { GameService } from '../common/game.service';
import { PlayerCustomizationService } from '../common/player-customization/player-customization.service';
import { isDraw } from '../../game/game-types';
import { resetState } from '../common/utils';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
  get color(): string {
    if (this.gameService?.gameover) {
      if (isDraw(this.gameService.gameover)) {
        return 'inherit';
      }

      return this.playerCustomizationService.getScheme(this.gameService.gameover.winner).primary;
    }

    return this.playerCustomizationService.getScheme('0').primary;
  }

  constructor(private gameService: GameService, private playerCustomizationService: PlayerCustomizationService) {}

  reset() {
    resetState();
    location.reload();
  }

  identity(x): any {
    return x;
  }
}
