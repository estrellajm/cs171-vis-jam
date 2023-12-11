import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { Select, Store } from '@ngxs/store';
import { Observable, firstValueFrom } from 'rxjs';
import { UpdateSelections } from 'src/app/core/stores/countries/countries.actions';
import { CountriesSelectors } from 'src/app/core/stores/countries/countries.selectors';
import { SelectedValues } from 'src/app/core/stores/countries/countries.state';
import { ScatterEarthComponent } from 'src/app/main/components/scatter/scatter.component';

export type Correlation = SelectedValues & {
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
    NgxsFormPluginModule,
  ],
  templateUrl: './correlation.page.html',
  styleUrls: ['./correlation.page.scss'],
})
export class CorrelationPage {
  @Select(CountriesSelectors.getCorrelationFields)
  correlation$: Observable<Correlation>;
  @Select(CountriesSelectors.getSelectedCorrelationValues)
  selectedValues$: Observable<any>;

  scatterForm: FormGroup = new FormGroup({
    xVariable: new FormControl(),
    yVariable: new FormControl(),
    areas: new FormControl(),
    selectedYears: new FormControl(),
  });
  selectedValues: FormGroup;

  showXDropdown: boolean = false;
  showYDropdown: boolean = false;
  showCountryDropdown: boolean = false;
  showYearDropdown: boolean = false;

  fb = inject(FormBuilder);
  store = inject(Store);

  constructor() {
    this.selectedValues = this.fb.group({
      xVariable: '',
      yVariable: '',
      areas: '',
      selectedYears: '',
    });

    this.loadInitialValues();
    // // this.selectedValues.valueChanges.subscribe((values) => {
    // //   console.log(values);

    // //   this.store.dispatch(new UpdateSelections(values));
    // // });
  }

  async loadInitialValues() {
    const initialValues = await firstValueFrom(this.selectedValues$);
    this.selectedValues.patchValue(initialValues);
  }

  changeSelectedX(xVariable: string) {
    this.selectedValues.patchValue({ xVariable });
    this.store.dispatch(new UpdateSelections(this.selectedValues.value));
    this.showXDropdown = false;
  }
  
  changeSelectedY(yVariable: string) {
    this.selectedValues.patchValue({ yVariable });
    this.store.dispatch(new UpdateSelections(this.selectedValues.value));
    this.showYDropdown = false;
  }
  
  changeSelectedCountry(areas: string) {
    this.selectedValues.patchValue({ areas });
    this.store.dispatch(new UpdateSelections(this.selectedValues.value));
    this.showCountryDropdown = false;
  }
  
  changeSelectedYear(selectedYears: number) {
    this.selectedValues.patchValue({ selectedYears });
    this.store.dispatch(new UpdateSelections(this.selectedValues.value));
    this.showYearDropdown = false;
  }
}
