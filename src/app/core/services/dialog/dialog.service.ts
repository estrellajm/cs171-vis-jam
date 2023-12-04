import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RadarComponent } from 'src/app/main/components/radar/radar.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  public dialog = inject(MatDialog);
  constructor() {}

  openDialog(country: any): void {
    const dialogRef = this.dialog.open(RadarComponent, {
      data: country,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }
}
