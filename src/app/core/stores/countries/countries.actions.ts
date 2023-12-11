import { SelectedValues } from "./countries.state";

export class LoadCountries {
  static readonly type = '[Countries] Load Countries';
}
export class UpdateSelections {
  static readonly type = '[Countries] Update Selections';
  constructor(public payload: SelectedValues) {}
}
