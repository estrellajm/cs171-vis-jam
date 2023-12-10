import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { CountriesState } from 'src/app/core/stores/countries/countries.state';

const routes: Routes = [
  // { path: '', redirectTo: '/welcome', pathMatch: 'full' }, // redirect to `welcome`
  {
    path: 'welcome',
    loadComponent: () =>
      import('./welcome/welcome.page').then((m) => m.WelcomePage),
    data: { animation: 0 },
  },
  {
    path: 'exploration',
    loadChildren: () =>
      import('./exploration/exploration.root.module').then(
        (m) => m.ExplorationModule
      ),
    data: { animation: 1 },
  },
  {
    path: 'credits',
    loadComponent: () =>
      import('./credits/credits.page').then((m) => m.CreditsPage),
    data: { animation: 5 },
  },
  { path: '**', redirectTo: '/welcome' },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgxsModule.forFeature([CountriesState]),
  ],
  exports: [RouterModule],
})
export class PagesModule {}
