import { Injectable } from '@angular/core';
import { Player } from '../../../game/game-types';
import { GameService } from '../game.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerCustomizationService {
  private readonly predefinedSchemes: ReadonlyArray<ColorScheme> = [
    {
      primary: 'rgb(239 68 68)',
      bgSelected: 'rgb(239 68 68)',
      bgLight: 'rgb(254 226 226)',
    },
    {
      primary: 'rgb(59 130 246)',
      bgSelected: 'rgb(59 130 246)',
      bgLight: 'rgb(219 234 254)',
    },
  ];

  public readonly defaultScheme: ColorScheme = {
    primary: 'rgb(107 114 128)',
    bgSelected: 'rgb(107 114 128)',
    bgLight: 'rgb(243 244 246)',
  };

  private playerSchemeMapping: Map<Player, ColorScheme> = new Map<Player, ColorScheme>();
  private nextPredefinedSchemeToUse: number = 0;

  constructor(private gameService: GameService) {}

  getScheme(player: Player) {
    if (!this.playerSchemeMapping.has(player)) {
      if (!this.gameService.players.includes(player)) {
        return this.defaultScheme;
      }

      let scheme = this.knownPlayerSchemes(player);

      if (!scheme) {
        scheme = this.predefinedSchemes[this.nextPredefinedSchemeToUse];
        this.nextPredefinedSchemeToUse = (this.nextPredefinedSchemeToUse + 1) % this.predefinedSchemes.length;
      }

      if (!scheme) {
        throw new Error(`Could not determine scheme for player ${player}`);
      }

      this.playerSchemeMapping.set(player, scheme);
    }

    return this.playerSchemeMapping.get(player);
  }

  private knownPlayerSchemes(player: Player) {
    switch (player) {
      case '0':
        return this.predefinedSchemes[0];
      case '1':
        return this.predefinedSchemes[1];
    }

    return null;
  }
}

interface ColorScheme {
  readonly primary: string;
  readonly bgSelected: string;
  readonly bgLight: string;
}
