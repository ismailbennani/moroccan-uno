import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontRoutingModule } from './front-routing.module';
import { GamePageComponent } from './game-page/game-page.component';
import { BoardComponent } from './board/board.component';
import { MatButtonModule } from '@angular/material/button';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CardComponent } from './common/card/card.component';
import { HandComponent } from './board/hand/hand.component';
import { DeckComponent } from './board/deck/deck.component';

@NgModule({
  declarations: [GamePageComponent, BoardComponent, CardComponent, HandComponent, DeckComponent],
  imports: [
    CommonModule,
    FrontRoutingModule,
    MatButtonModule,
    SvgIconsModule,
    MatDividerModule,
    MatIconModule,
    RouterLink,
  ],
})
export class FrontModule {}
