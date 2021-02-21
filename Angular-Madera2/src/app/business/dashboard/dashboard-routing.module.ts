import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from '../dashboard/page/dashboard-home/dashboard-home.component';
import { UserListComponent } from '../user/page/user-list/user-list.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardHomeComponent,
    },
    {
        path: 'users',
        component: UserListComponent,
    },
    // {
    //     path: 'tickets',
    // },
    // {
    //     path: 'settings',
    // },
    // {
    //     path: 'support'
    // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
