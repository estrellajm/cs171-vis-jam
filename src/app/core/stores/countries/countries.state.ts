import { Injectable, inject } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { LoadCountries } from './countries.actions';
import { DataService } from '@services/data/data.service';

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
  updateSelections({ setState }: StateContext<CountriesStateModel>) {
    // setState(inject(DataService).loadData());
  }
}
