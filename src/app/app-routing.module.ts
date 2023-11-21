import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'welcome',
    loadComponent: () =>
      import('./main/pages/welcome/welcome.page').then((m) => m.WelcomePage),
  },
  {
    path: 'exploration',
    loadComponent: () =>
      import('./main/pages/exploration/exploration.page').then(
        (m) => m.ExplorationPage
      ),
  },
  {
    path: 'correlation',
    loadComponent: () =>
      import('./main/pages/correlation/correlation.page').then(
        (m) => m.CorrelationPage
      ),
  },
  {
    path: 'credits',
    loadComponent: () =>
      import('./main/pages/credits/credits.page').then((m) => m.CreditsPage),
  },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' }, // redirect to `welcome`
  { path: '**', redirectTo: '/welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
