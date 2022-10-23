import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CardColor } from '../../../game/game-types';

@Component({
  selector: 'app-color-selection-dialog',
  templateUrl: './color-selection-dialog.component.html',
  styleUrls: ['./color-selection-dialog.component.scss'],
})
export class ColorSelectionDialogComponent {
  selectedColor: CardColor;

  constructor(
    public dialogRef: MatDialogRef<ColorSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { colors: CardColor[] }
  ) {}

  confirm() {
    if (this.selectedColor) {
      this.dialogRef.close({ color: this.selectedColor });
    } else {
      this.cancel();
    }
  }

  cancel() {
    this.dialogRef.close({ cancel: true });
  }
}
