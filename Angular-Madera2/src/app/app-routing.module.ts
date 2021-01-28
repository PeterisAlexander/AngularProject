import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './business/authentification/component/login-form/login-form.component';
import { DevEnvironmentGuard } from './core/guard/dev-environment.guard';

const routes: Routes = [
  {
    path: 'auth',
    // canActivate: [DevEnvironmentGuard],
    // data: { isPublic: true },
    component: LoginFormComponent,
  },
  {
    path: '',
    // canActivate: [AuthentificationGuard],
    component: AppComponent,
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false,
      onSameUrlNavigation: 'reload',
    }),
  ],
})
export class AppRoutingModule {}
