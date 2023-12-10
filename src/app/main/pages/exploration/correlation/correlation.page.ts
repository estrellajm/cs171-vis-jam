import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CountriesSelectors } from 'src/app/core/stores/countries/countries.selectors';
import { ScatterEarthComponent } from 'src/app/main/components/scatter/scatter.component';

type Correlation = {
  axis: string[];
  countries: string[];
  years: number[];
};
@Component({
  selector: 'jam-correlation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ScatterEarthComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './correlation.page.html',
  styleUrls: ['./correlation.page.scss'],
})
export class CorrelationPage {
  @Select(CountriesSelectors.getCorrelationFields)
  correlation$: Observable<Correlation>;
  selectedValues: FormGroup;

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

  fb = inject(FormBuilder);

  constructor() {
    this.selectedValues = this.fb.group({
      x: '',
      y: '',
      country: '',
      year: '',
    });
  }

  changeSelectedX(x: string) {
    this.selectedValues.patchValue({ x });
    this.showXDropdown = false;
  }

  changeSelectedY(y: string) {
    this.selectedValues.patchValue({ y });
    this.showYDropdown = false;
  }

  changeSelectedCountry(country: string) {
    this.selectedValues.patchValue({ country });
    this.showCountryDropdown = false;
  }

  changeSelectedYear(year: number) {
    this.selectedValues.patchValue({ year });
    this.showYearDropdown = false;
  }
}
