import { Component, Input, OnInit } from '@angular/core';
import { CardColors, CardValue, GameState, IdentifiedCard, Player, PlayerState } from '../../game/game-types';
import { PlayerCustomizationService } from '../common/player-customization/player-customization.service';
import { GameService } from '../common/game.service';
import { Ctx } from 'boardgame.io';
import { _ClientImpl } from 'boardgame.io/dist/types/src/client/client';
import { MatDialog } from '@angular/material/dialog';
import { ColorSelectionDialogComponent } from './color-selection-dialog/color-selection-dialog.component';

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

  get playerState(): PlayerState {
    return this.state.players[this.player] as PlayerState;
  }

  get otherPlayerState(): PlayerState {
    return Object.entries(this.state.players).find(([p, _]) => p !== this.player)[1];
  }

  private client: _ClientImpl<GameState>;

  constructor(
    private gameService: GameService,
    private playerCustomizationService: PlayerCustomizationService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.update();
  }

  clickDeck() {
    this.client.moves['drawCard']();
  }

  clickCard(card: IdentifiedCard) {
    if (card.value === CardValue.Seven) {
      this.dialog
        .open(ColorSelectionDialogComponent, {
          data: { colors: CardColors.filter(c => c !== this.state.top.color) },
        })
        .afterClosed()
        .subscribe(result => {
          if (result.cancel || !result.color) {
            return;
          }

          this.client.moves['playCard'](card.id, result.color);
        });
    } else {
      this.client.moves['playCard'](card.id);
    }
  }

  colorOf(player: Player) {
    return this.playerCustomizationService.getScheme(player).bgSelected;
  }

  protected update() {
    if (!this.client) {
      this.client = this.gameService.getPlayerClient(this.player);
      this.client.subscribe(_ => this.update());
    }

    const { G, ctx } = this.client.getState();

    this.state = G;
    this.context = ctx;
  }
}
