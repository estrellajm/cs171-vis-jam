export class CountriesAction {
  static readonly type = '[Countries] Add item';
  constructor(public payload: string) {}
}

export class LoadCountries {
  static readonly type = '[Countries] Load Countries';
}
