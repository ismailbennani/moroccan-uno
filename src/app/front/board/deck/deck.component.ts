import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardSize } from '../../common/card/card.component';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss'],
})
export class DeckComponent {
  @Input()
  name: string;

  @Input()
  size: CardSize = 'lg';

  @Input()
  deckSize: number;

  @Input()
  hoverable: boolean;

  @Input()
  disabled: boolean;

  @Output()
  hover: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  click: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}
}
