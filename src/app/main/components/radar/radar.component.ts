import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'jam-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss'],
})
export class RadarComponent {
  constructor(
    public dialogRef: MatDialogRef<RadarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }
}
