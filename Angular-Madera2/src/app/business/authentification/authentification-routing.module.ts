import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from './component/login-form/login-form.component';

export function getBreadcrumbMatiere(data: any): string {
  return data.matiere.nom;
}

const routes: Routes = [
  {
    path: 'auth',
    data: {
      breadcrumb: 'Authentification',
      // menu: DroitApplicatifEnum.menuMatiere,
    },
    children: [
      {
        path: '',
        component: LoginFormComponent,
      },
    ],
  },
];

// canDeactivateAllRoutes(routes);

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class AuthentificationRoutingModule {}
