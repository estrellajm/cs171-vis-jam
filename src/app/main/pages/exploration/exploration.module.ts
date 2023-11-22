import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExplorationPage } from './exploration.page';

const routes: Routes = [
  {
    path: '',
    component: ExplorationPage,
    children: [
      { path: '', redirectTo: 'economy', pathMatch: 'full' }, // on empty path redirect to economy
      {
        path: 'economy',
        loadComponent: () =>
          import('./globe/globe.page').then((m) => m.GlobePage),
        data: { animation: 1 },
      },
      {
        path: 'environment',
        loadComponent: () =>
          import('./globe/globe.page').then((m) => m.GlobePage),
        data: { animation: 2 },
      },
      {
        path: 'education',
        loadComponent: () =>
          import('./globe/globe.page').then((m) => m.GlobePage),
        data: { animation: 3 },
      },
      {
        path: 'correlation',
        loadComponent: () =>
          import('./correlation/correlation.page').then(
            (m) => m.CorrelationPage
          ),
        data: { animation: 4 },
      },
      { path: '**', redirectTo: 'economy' }, // catch-all redirect
    ],
  },
];

@NgModule({
  declarations: [ExplorationPage],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExplorationModule {}
