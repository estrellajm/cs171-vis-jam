import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

interface DateObj {
  date: Date;
  average: number;
}

@Component({
  selector: 'app-paths',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paths.component.html',
  styleUrls: ['./paths.component.scss'],
})
export class PathsComponent {
  importedData: DateObj[] = [];

  ngOnInit() {
    this.loadData();
  }

  //Function for converting CSV values from strings to Dates and numbers

  async loadData() {
    const rowConverter = (d: any): DateObj => {
      return {
        date: new Date(+d.year, +d.month - 1),
        average: parseInt(d.average),
      };
    };
    //   /** Load in the data */
    this.importedData = await d3.csv(
      'assets/mauna_loa_co2_monthly_averages.csv',
      rowConverter
    );

    console.table(this.importedData, ['date', 'average']);
  }
}
