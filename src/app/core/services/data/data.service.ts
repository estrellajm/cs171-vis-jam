import { Injectable } from '@angular/core';
import WD_INDICATORS from '@assets/data/wd_indicators.json';
import WORLD from '@assets/data/world.json';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  wd_indicators = WD_INDICATORS as any;
  world = WORLD as any;

  loadData(): any {
    const world = this.world;
    const countries = this.wd_indicators;
    return { world, countries };
  }
}
