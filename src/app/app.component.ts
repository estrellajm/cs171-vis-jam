import { Component, VERSION, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { LoadCountries } from './core/stores/countries/countries.actions';
import { slider } from './slider';

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
  store = inject(Store);
  constructor() {
    this.store.dispatch(LoadCountries);
    console.log(`Angular ${VERSION.full}`);
  }

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }
}
