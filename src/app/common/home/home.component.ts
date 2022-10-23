import { Component, OnInit } from '@angular/core';
import { resetState } from '../../front/common/utils';
import { GameService } from '../../front/common/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public get hasSave(): boolean {
    const stateKey = GameService.StorageKey + '-state';
    return !!localStorage.getItem(stateKey);
  }

  constructor() {}

  ngOnInit(): void {}

  newGame() {
    resetState();
  }
}
