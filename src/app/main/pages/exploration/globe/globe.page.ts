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
import { Observable, map } from 'rxjs';
import { GlobeEarthComponent } from 'src/app/main/components/globe/globe.component';

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
  ],
  templateUrl: './globe.page.html',
  styleUrls: ['./globe.page.scss'],
})
export class GlobePage {
  categoryForm: FormGroup;

  title: string;
  data: Country[];
  path$: Observable<{ previous: string; next: string }>;

  categories$: Observable<string[]>;
  showCategoryDropdown: boolean = false;

  years$: Observable<number[]>;
  showYearDropdown: boolean = false;

  fb = inject(FormBuilder);

  constructor() {
    this.categoryForm = this.fb.group({
      category: '',
      year: 2018,
    });
  }

  routes = {
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
    this.route.data.subscribe((data) => {
      this.path$ = this.route.data.pipe(
        map((data: any) => this.routes[data['path'] as RouteKey])
      );
      this.categories$ = this.route.data.pipe(
        map((data: any) =>
          Object.keys(data['data'].countries[0][data['path']][0]).sort()
        )
      );
      this.years$ = this.route.data.pipe(
        map((data) =>
          data['data'].countries[0][data['path']]
            .map((item: { year: any }) => item.year)
            .reverse()
        )
      );
      this.title = data['path'];
      this.data = {
        ...data['data'],
        year: this.categoryForm.value.year,
      };
    });

    // Subscribe to categories$ and set the first element of the array to the form
    this.categories$.subscribe((categories) => {
      if (categories && categories.length > 0) {
        this.categoryForm.patchValue({ category: categories[0] });
      }
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

  closeDropdown() {
    this.showCategoryDropdown = false;
    this.showYearDropdown = false;
  }
}
