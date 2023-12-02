import { Injectable } from '@angular/core';
import { Country } from '@interfaces/country.interface';
import { WD_INDICATORS } from '@assets/data/wd_indicators'; // Adjust the path as needed

@Injectable({
  providedIn: 'root',
})
export class DataService {
  wd_indicators = WD_INDICATORS;
  getData(path: string): Country[] {
    const countries = this.wd_indicators.map((item: any) => ({
      country: item.country,
      code: item.code,
      [path]: item[path],
    }));
    return countries;
  }
}
