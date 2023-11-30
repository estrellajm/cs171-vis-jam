import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScatterEarthComponent } from 'src/app/main/components/scatter/scatter.component';

@Component({
  selector: 'jam-correlation',
  standalone: true,
  imports: [CommonModule, RouterModule, ScatterEarthComponent],
  templateUrl: './correlation.page.html',
  styleUrls: ['./correlation.page.scss'],
})
export class CorrelationPage {
  selectedX: string = 'GDP Per Capita';
  selectedY: string = 'Literacy Rate';
  selectedCountry: string = 'Germany';
  selectedYear: number = 2018;

  showXDropdown: boolean = false;
  showYDropdown: boolean = false;
  showCountryDropdown: boolean = false;
  showYearDropdown: boolean = false;

  axisValues: string[] = ['GDP Per Capita', 'Literacy Rate'];
  countries: string[] = ['Germany', 'US'];
  years: number[] = [2018, 2019];

  changeSelectedX(newX: string) {
    this.selectedX = newX;
    this.showXDropdown = false;
  }

  changeSelectedY(newY: string) {
    this.selectedY = newY;
    this.showYDropdown = false;
  }

  changeSelectedCountry(newCountry: string) {
    this.selectedCountry = newCountry;
    this.showCountryDropdown = false;
  }

  changeSelectedYear(newYear: number) {
    this.selectedYear = newYear;
    this.showYearDropdown = false;
  }
}
