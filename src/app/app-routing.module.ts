import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'welcome',
    loadComponent: () =>
      import('./main/pages/welcome/welcome.page').then((m) => m.WelcomePage),
    data: { animation: 0 },
  },
  {
    path: 'exploration',
    loadComponent: () =>
      import('./main/pages/exploration/exploration.page').then(
        (m) => m.ExplorationPage
      ),
    data: { animation: 1 },
  },
  {
    path: 'correlation',
    loadComponent: () =>
      import('./main/pages/correlation/correlation.page').then(
        (m) => m.CorrelationPage
      ),
    data: { animation: 2 },
  },
  {
    path: 'credits',
    loadComponent: () =>
      import('./main/pages/credits/credits.page').then((m) => m.CreditsPage),
    data: { animation: 3 },
  },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' }, // redirect to `welcome`
  { path: '**', redirectTo: '/welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
