import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { CountriesAction, LoadCountries } from './countries.actions';
import { DataService } from '@services/data/data.service';
import { CountriesState } from './countries.state';

export class CountriesStateModel {
  public countries: string[];
  public world: {};
}

const defaults = {
  world: {},
  countries: [],
};

@State<CountriesStateModel>({
  name: 'countries',
  defaults,
})
@Injectable()
export class CountriesSelectors {
  @Selector([CountriesState])
  static getCountries(state: CountriesStateModel) {
    return state.countries;
  }
}
