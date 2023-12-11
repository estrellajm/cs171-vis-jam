import { Injectable, inject } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { LoadCountries, UpdateSelections } from './countries.actions';
import { DataService } from '@services/data/data.service';

export type SelectedValues = {
  xVariable: string;
  yVariable: string;
  areas: string[];
  selectedYears: number[];
};
export class CountriesStateModel {
  public rotating: {};
  public world: {};
  public countries: string[];
  public selectedCorrelationValues: SelectedValues;
  public scatterForm: {};
}

const defaults: CountriesStateModel = {
  rotating: {},
  world: {},
  countries: [],
  scatterForm: {
    model: undefined,
    dirty: false,
    status: '',
    errors: {},
  },
  selectedCorrelationValues: {
    xVariable: 'Renewable energy consumption (% of energy consumption)',
    yVariable: 'GDP per capita (2015 US$)',
    areas: ['World'],
    selectedYears: [
      1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971,
      1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983,
      1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995,
      1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007,
      2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019,
      2020, 2021, 2022,
    ],
  },
};

@State<CountriesStateModel>({
  name: 'countries',
  defaults,
})
@Injectable()
export class CountriesState {
  @Action(LoadCountries)
  loadCountries({ getState, patchState }: StateContext<CountriesStateModel>) {
    patchState(inject(DataService).loadData());
  }

  @Action(UpdateSelections)
  updateSelections(
    { patchState }: StateContext<CountriesStateModel>,
    { payload }: UpdateSelections
  ) {
    patchState({ selectedCorrelationValues: payload });
  }
}
