import { Component, VERSION } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
  constructor() {
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
