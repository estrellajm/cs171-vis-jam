import { Injectable } from '@angular/core';
import WD_INDICATORS from '@assets/data/wd_indicators.json';
import WORLD from '@assets/data/world.json';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  wd_indicators = WD_INDICATORS as any;
  world = WORLD as any;
  getData(path: string): any {
    const countries = this.wd_indicators.map((item: any) => ({
      country: item.country,
      code: item.code,
      [path]: item[path],
    }));
    const world = this.world;
    return { countries, world };
  }
}
