import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Country } from '@interfaces/country.interface';
import { Select } from '@ngxs/store';
import { Observable, map } from 'rxjs';
import { ClickOutsideDivDirective } from 'src/app/core/directives/click-outside/click-outside-div.directive';
import { CountriesSelectors } from 'src/app/core/stores/countries/countries.selectors';
import { BarsComponent } from 'src/app/main/components/bars/bars.component';
import { GlobeEarthComponent } from 'src/app/main/components/globe/globe.component';

type Route = {
  previous: string;
  next: string;
};

type Routes = {
  [key: string]: Route;
};

type RouteKey = 'economy' | 'education' | 'environment';

@Component({
  selector: 'jam-globe-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GlobeEarthComponent,
    FormsModule,
    ReactiveFormsModule,
    BarsComponent,
    ClickOutsideDivDirective,
  ],
  templateUrl: './globe.page.html',
  styleUrls: ['./globe.page.scss'],
})
export class GlobePage {
  @Select(CountriesSelectors.getCountries) countries$: Observable<any>;
  categoryForm: FormGroup;

  title: RouteKey;
  data: Country[];

  categories: string[];
  showCategoryDropdown: boolean = false;

  years: number[];
  showYearDropdown: boolean = false;

  fb = inject(FormBuilder);

  constructor() {
    this.categoryForm = this.fb.group({
      category: '',
      year: 2018,
    });
  }

  path: Route;
  routes: Routes = {
    economy: {
      previous: 'welcome',
      next: 'education',
    },
    education: {
      previous: 'economy',
      next: 'environment',
    },
    environment: {
      previous: 'education',
      next: 'correlation',
    },
  };

  route = inject(ActivatedRoute);

  ngOnInit() {
    const path: RouteKey = this.route.snapshot.data['path'];
    this.countries$.subscribe((data) => {
      // set title
      this.title = path;

      // set route paths
      this.path = this.routes[path];

      // set categories
      this.categories = Object.keys(data[0][path][0])
        .sort()
        .filter((b) => b !== 'year');
      this.categoryForm.patchValue({ category: this.categories[0] });

      // set years
      this.years = data[0][path]
        .map((item: { year: any }) => item.year)
        .reverse();

      this.data = {
        ...data,
        year: this.categoryForm.value.year,
      };
    });
  }

  getPreviousPath(previous: string): string {
    if (previous === 'welcome') return 'welcome';
    return `exploration/${previous}`;
  }

  changeCategory(newCategory: string) {
    this.categoryForm.patchValue({ category: newCategory });
    this.showCategoryDropdown = false;
  }
  changeYear(newYear: number) {
    this.categoryForm.patchValue({ year: newYear });
    this.showYearDropdown = false;
  }
}
