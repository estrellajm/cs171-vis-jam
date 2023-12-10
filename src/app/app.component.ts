import { Component, VERSION, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { slider } from './slider';
import { Store } from '@ngxs/store';
import { LoadCountries } from './core/stores/countries/countries.actions';

@Component({
  selector: 'jam-root',
  animations: [
    // <-- add your animations here
    // fader,
    // slider,
    // transformer,
    //stepper
    slider,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;

  routes = [
    {
      route: 'welcome',
      title: 'Welcome',
    },
    {
      route: 'exploration',
      title: 'Exploration',
    },
    {
      route: 'correlation',
      title: 'Correlation',
    },
    {
      route: 'credits',
      title: 'Credits',
    },
  ];

  store = inject(Store);
  constructor() {
    this.store.dispatch(LoadCountries);
  }

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }
}
