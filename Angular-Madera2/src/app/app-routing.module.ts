import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {
    path: 'bacasable',
    canActivate: [DevEnvironmentGuard],
    data: { isPublic: true },
    component: BacASableComponent,
  },
  {
    path: '',
    canActivate: [AuthentificationGuard],
    component: WelcomePageComponent,
  },
  {
    path: 'forbidden',
    canActivate: [AuthentificationGuard],
    component: PageForbiddenComponent,
  },
  // Prend en charge l'ensemble des chemins non liés
  // et charge le composant PageNotFoundComponent.
  {
    path: '**',
    data: { withAppFrame: false },
    component: PageNotFoundComponent,
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(appRoutes, {
      enableTracing: false,
      onSameUrlNavigation: 'reload',
    }),
  ],
})
export class AppRoutingModule {}
