import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' }, // redirect to `welcome`
  {
    path: 'welcome',
    loadComponent: () =>
      import('./main/pages/welcome/welcome.page').then((m) => m.WelcomePage),
    data: { animation: 0 },
  },
  {
    path: 'exploration',
    loadChildren: () =>
      import('./main/pages/exploration/exploration.module').then(
        (m) => m.ExplorationModule
      ),
    data: { animation: 1 },
  },
  {
    path: 'credits',
    loadComponent: () =>
      import('./main/pages/credits/credits.page').then((m) => m.CreditsPage),
    data: { animation: 5 },
  },
  { path: '**', redirectTo: '/welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
