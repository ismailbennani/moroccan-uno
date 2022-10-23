import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardBase } from '../../boardgame-io-angular/board-base';
import { BoardConfig, OBSERVABLE_BOARD_CONFIG } from '../../boardgame-io-angular/config';
import { GameState, Player } from '../../game/game-types';
import { PlayerCustomizationService } from '../common/player-customization/player-customization.service';
import { Ctx } from 'boardgame.io';
import { GameInfoService } from '../common/game-info/game-info.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent extends BoardBase implements OnInit {
  public get state(): GameState {
    return this.G;
  }

  public get context(): Ctx {
    return this.ctx;
  }

  constructor(
    @Inject(OBSERVABLE_BOARD_CONFIG) private boardConfig$: Observable<BoardConfig>,
    private playerCustomizationService: PlayerCustomizationService,
    private gameInfoService: GameInfoService
  ) {
    super(boardConfig$);
  }

  ngOnInit() {
    this.update();
  }

  protected update() {
    this.gameInfoService.update({ G: this.G, ctx: this.context });
  }

  colorOf(player: Player) {
    return this.playerCustomizationService.getScheme(player).bgSelected;
  }

  color(): string {
    return this.colorOf(this.playerID);
  }
}
