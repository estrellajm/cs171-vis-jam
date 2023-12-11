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

  selectedX: string = 'Renewable energy consumption (% of energy consumption)';
  selectedY: string = 'GDP per capita (2015 US$)';
  selectedCountry: string = 'World';
  selectedYear: number[] = [
    1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971,
    1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983,
    1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995,
    1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007,
    2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019,
    2020, 2021, 2022,
  ];

  showXDropdown: boolean = false;
  showYDropdown: boolean = false;
  showCountryDropdown: boolean = false;
  showYearDropdown: boolean = false;

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
