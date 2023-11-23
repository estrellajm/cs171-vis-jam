import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { dataResolver } from '@resolvers/data.resolver';
import { ExplorationPage } from './exploration.root';

const routes: Routes = [
  {
    path: '',
    component: ExplorationPage,
    children: [
      { path: '', redirectTo: 'economy', pathMatch: 'full' }, // on empty path redirect to economy
      {
        path: 'economy',
        resolve: { data: dataResolver },
        loadComponent: () =>
          import('./globe/globe.page').then((m) => m.GlobePage),
        data: { animation: 1, path: 'economy' },
      },
      {
        path: 'environment',
        resolve: { data: dataResolver },
        loadComponent: () =>
          import('./globe/globe.page').then((m) => m.GlobePage),
        data: { animation: 2, path: 'environment' },
      },
      {
        path: 'education',
        resolve: { data: dataResolver },
        loadComponent: () =>
          import('./globe/globe.page').then((m) => m.GlobePage),
        data: { animation: 3, path: 'education' },
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
