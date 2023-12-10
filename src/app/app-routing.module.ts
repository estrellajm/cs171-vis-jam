import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { dataResolver } from '@resolvers/data.resolver';

const routes: Routes = [
  // { path: '', redirectTo: '/welcome', pathMatch: 'full' }, // redirect to `welcome`
  {
    path: '',
    loadChildren: () =>
      import('./main/pages/page.module').then((m) => m.PagesModule),
    resolve: { data: dataResolver },
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
