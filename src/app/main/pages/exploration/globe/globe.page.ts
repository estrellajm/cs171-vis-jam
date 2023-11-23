import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Country } from '@interfaces/country.interface';
import { Observable, map } from 'rxjs';

type RouteKey = 'economy' | 'education' | 'environment';
@Component({
  selector: 'app-globe',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './globe.page.html',
  styleUrls: ['./globe.page.scss'],
})
export class GlobePage {
  data: Country[];
  title: string;
  path$: Observable<{ previous: string; next: string }>;

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
      this.title = data['path'];
      this.data = data['data'];
    });
  }

  getPreviousPath(previous: string): string {
    if (previous === 'welcome') return 'welcome';
    return `exploration/${previous}`;
  }
}
