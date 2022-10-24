import { Component, OnInit } from '@angular/core';
import { resetState } from '../../front/common/utils';
import { GameService } from '../../front/common/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public get hasSave(): boolean {
    const stateKey = GameService.StorageKey + '_state';
    return !!localStorage.getItem(stateKey);
  }

  constructor(private router: Router) {}

  ngOnInit(): void {}

  newGame() {
    resetState();
    this.router.navigate(['/', 'game']).then(_ => location.reload());
  }
}
