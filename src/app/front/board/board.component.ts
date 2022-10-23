import { Component, Input, OnInit } from '@angular/core';
import { GameState, Player } from '../../game/game-types';
import { PlayerCustomizationService } from '../common/player-customization/player-customization.service';
import { GameService } from '../common/game.service';
import { Ctx } from 'boardgame.io';
import { _ClientImpl } from 'boardgame.io/dist/types/src/client/client';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @Input()
  set player(p: Player) {
    if (p === this._player) {
      return;
    }

    this._player = p;
    this.client = null;
    this.update();
  }

  get player(): Player {
    return this._player;
  }

  private _player: Player;

  get color(): string {
    return this.colorOf(this.player);
  }

  state: GameState;
  context: Ctx;

  private client: _ClientImpl<GameState>;

  constructor(private gameService: GameService, private playerCustomizationService: PlayerCustomizationService) {}

  ngOnInit() {
    this.update();
  }

  protected update() {
    if (!this.client) {
      this.client = this.gameService.getPlayerClient(this.player);
    }

    const { G, ctx } = this.client.getState();

    this.state = G;
    this.context = ctx;
  }

  colorOf(player: Player) {
    return this.playerCustomizationService.getScheme(player).bgSelected;
  }
}