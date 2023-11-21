import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'welcome',
    loadComponent: () =>
      import('./main/pages/welcome/welcome.page').then((m) => m.WelcomePage),
  },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' }, // redirect to `welcome`
  { path: '**', redirectTo: '/welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
