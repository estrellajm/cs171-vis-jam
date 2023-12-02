import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { DataService } from '@services/data/data.service';
import { Country } from '@interfaces/country.interface';

export const dataResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const path = route.data['path'];
  return inject(DataService).getData(path);
};
