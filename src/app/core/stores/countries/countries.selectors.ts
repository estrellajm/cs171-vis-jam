import { Selector } from '@ngxs/store';
import { CountriesState, CountriesStateModel } from './countries.state';

export class CountriesSelectors {
  @Selector([CountriesState])
  static getRotating(state: CountriesStateModel) {
    return state.rotating;
  }

  @Selector([CountriesState])
  static getCountries(state: CountriesStateModel) {
    return state.countries;
  }

  @Selector([CountriesState])
  static getCorrelationFields(state: CountriesStateModel) {
    return {
      axis: this.extractKeys(state.countries[0]),
      countries: this.extractCountries(state.countries),
      years: this.extractYears(state.countries[0]),
    };
  }

  static extractKeys(data: any): string[] {
    let consolidatedKeys = new Set();
    // Iterate over each key in the data object
    for (let key in data) {
      // Check if the value is an array
      if (Array.isArray(data[key])) {
        // Get the first item in the array
        const firstItem = data[key][0];

        if (firstItem) {
          // Extract keys from the first item and add them to the set
          Object.keys(firstItem).forEach((key) => {
            if (key !== 'year') {
              consolidatedKeys.add(key);
            }
          });
        }
      }
    }

    return Array.from(consolidatedKeys).sort() as string[];
  }

  static extractCountries(data: any): string[] {
    return data.map((c: any) => c.country);
  }

  static extractYears(data: any): number[] {
    let years = new Set();
    // Iterate over each key in the data object
    for (let key in data) {
      // Check if the value is an array
      if (Array.isArray(data[key])) {
        // Iterate over each item in the array
        data[key].forEach((item: any) => {
          if (item.year) {
            // Add the year to the set
            years.add(item.year);
          }
        });
      }
    }

    return Array.from(years).reverse() as number[];
  }
}
