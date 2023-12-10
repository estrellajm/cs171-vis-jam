import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { CountriesState } from 'src/app/core/stores/countries/countries.state';
import { PagesRoot } from './pages.root';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' }, // redirect to `welcome`
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
  // {
  //   path: 'economy',
  //   loadComponent: () =>
  //     import('./exploration/globe/globe.page').then((m) => m.GlobePage),
  //   data: { animation: 1, path: 'economy' },
  // },
  // {
  //   path: 'environment',
  //   loadComponent: () =>
  //     import('./exploration/globe/globe.page').then((m) => m.GlobePage),
  //   data: { animation: 2, path: 'environment' },
  // },
  // {
  //   path: 'education',
  //   loadComponent: () =>
  //     import('./exploration/globe/globe.page').then((m) => m.GlobePage),
  //   data: { animation: 3, path: 'education' },
  // },
  {
    path: 'correlation',
    loadComponent: () =>
      import('./exploration/correlation/correlation.page').then(
        (m) => m.CorrelationPage
      ),
    data: { animation: 4 },
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
  declarations: [PagesRoot],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxsModule.forFeature([CountriesState]),
  ],
  exports: [RouterModule],
})
export class PagesModule {}
