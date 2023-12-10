import { Injectable, inject } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { DataService } from '@services/data/data.service';
import { LoadCountries } from './countries.actions';

export class CountriesStateModel {
  public rotating: {};
  public world: {};
  public countries: string[];
}

const defaults: CountriesStateModel = {
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
