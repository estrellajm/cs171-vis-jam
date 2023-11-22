import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExplorationPage } from './exploration.page';

const routes: Routes = [
  {
    path: '',
    component: ExplorationPage,
    children: [
      {
        path: 'economy',
        loadComponent: () =>
          import('./globe/globe.page').then((m) => m.GlobePage),
      },
      // {
      //   path: 'environment',
      //   loadComponent: () =>
      //     import('./main/pages/welcome/welcome.page').then((m) => m.WelcomePage),
      //   data: { animation: 1 },
      // },
      // {
      //   path: 'education',
      //   loadComponent: () =>
      //     import('./main/pages/welcome/welcome.page').then((m) => m.WelcomePage),
      //   data: { animation: 2 },
      // },
      // {
      //   path: 'correlation',
      //   loadComponent: () =>
      //     import('./main/pages/welcome/welcome.page').then((m) => m.WelcomePage),
      //   data: { animation: 3 },
      // },
    ],
  },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' }, // redirect to `welcome`
  { path: '**', redirectTo: '/welcome' },
];

@NgModule({
  declarations: [ExplorationPage],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExplorationModule {}
