import { Injectable } from '@angular/core';
import ROTATING from '@assets/archive/world.json';
import WORLD from '@assets/archive/world.json';
import WD_INDICATORS from '@assets/data/wd_indicators.json';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  rotating = ROTATING as any;
  world = WORLD as any;
  wd_indicators = WD_INDICATORS as any;

  loadData(): any {
    const rotating = this.rotating;
    const world = this.world;
    const countries = this.wd_indicators;
    return { rotating, world, countries };
  }
}
