import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { CountriesAction, LoadCountries } from './countries.actions';
import { DataService } from '@services/data/data.service';

export class CountriesStateModel {
  public rotating: {};
  public world: {};
  public countries: string[];
}

const defaults = {
  rotating: {},
  world: {},
  countries: [],
};

@State<CountriesStateModel>({
  name: 'countries',
  defaults,
})
@Injectable()
export class CountriesState {
  @Action(LoadCountries)
  loadCountries({ setState }: StateContext<CountriesStateModel>) {
    setState(inject(DataService).loadData());
  }

  @Action(LoadCountries)
  filterCountryData({ patchState }: StateContext<CountriesStateModel>) {
    // const countries = this.wd_indicators.map((item: any) => ({
    //   country: item.country,
    //   code: item.code,
    //   [path]: item[path],
    // }));
  }
}
