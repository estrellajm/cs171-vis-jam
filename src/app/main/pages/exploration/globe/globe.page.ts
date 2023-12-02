import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Country } from '@interfaces/country.interface';
import { Observable, map } from 'rxjs';
import { GlobeEarthComponent } from 'src/app/main/components/globe/globe.component';

type RouteKey = 'economy' | 'education' | 'environment';
@Component({
  selector: 'jam-globe-page',
  standalone: true,
  imports: [CommonModule, RouterModule, GlobeEarthComponent],
  templateUrl: './globe.page.html',
  styleUrls: ['./globe.page.scss'],
})
export class GlobePage {
  data: Country[];
  title: string;
  path$: Observable<{ previous: string; next: string }>;
  categories$: Observable<string[]>;
  years$: Observable<number[]>;

  selectedCategory: string = 'CO2 emissions (kg per 2015 US$ of GDP)';
  showCategoryDropdown: boolean = false;
  selectedYear: number = 2018;
  showYearDropdown: boolean = false;
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
        map((data: any) => Object.keys(data['data'][0][data['path']][0]).sort())
      );
      this.years$ = this.route.data.pipe(
        map((data) =>
          data['data'][0][data['path']]
            .map((item: { Year: any }) => item.Year)
            .reverse()
        )
      );
      this.title = data['path'];
      this.data = data['data'];
    });
  }

  getPreviousPath(previous: string): string {
    if (previous === 'welcome') return 'welcome';
    return `exploration/${previous}`;
  }

  changeSelectedCategory(newSelectedCategory: string) {
    this.selectedCategory = newSelectedCategory;
    this.showCategoryDropdown = false;
  }
  changeSelectedYear(newSelectedYear: number) {
    this.selectedYear = newSelectedYear;
    this.showYearDropdown = false;
  }

  closeDropdown() {
    console.log('asdd');

    this.showCategoryDropdown = false;
    this.showYearDropdown = false;
  }
}
