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
}
