import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from '../dashboard/page/dashboard-home/dashboard-home.component';
import { UserEditComponent } from './page/user-edit/user-edit.component';
import { UserListComponent } from './page/user-list/user-list.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardHomeComponent,
    },
    {
        path: 'users',
        component: UserListComponent,
    },
    {
        path: 'users/new',
        component: UserEditComponent,
    },
    // {
    //      path: ':idUser',
    //      children: [
    //          { path: '', redirectTo: '/edit', pathMatch: 'full' },
    //          { path: 'edit', component: UserEditComponent },
    //      ],
    //  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }
