import { Component } from '@angular/core';
import { GameService } from '../common/game.service';
import { PlayerCustomizationService } from '../common/player-customization/player-customization.service';
import { isDraw, Player } from '../../game/game-types';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
  get players(): Player[] {
    return this.gameService?.players ?? [];
  }

  get currentPlayer(): Player {
    return this.gameService?.currentPlayer;
  }

  get color(): string {
    if (this.gameService?.gameover) {
      if (isDraw(this.gameService.gameover)) {
        return 'inherit';
      }

      return this.playerCustomizationService.getScheme(this.gameService.gameover.loser).primary;
    }

    return this.playerCustomizationService.getScheme(this.currentPlayer).primary;
  }

  constructor(private gameService: GameService, private playerCustomizationService: PlayerCustomizationService) {}

  identity(x): any {
    return x;
  }
}