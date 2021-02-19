import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BacASableComponent } from './business/bac-a-sable/bac-a-sable.component';
import { DashboardHomeComponent } from './business/dashboard/page/dashboard-home/dashboard-home.component';
import { HomeComponent } from './business/home/home.component';
import { LoginComponent } from './business/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardHomeComponent,
  },
  {
    path: 'bacasable',
    component: BacASableComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
