import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from '../dashboard/page/dashboard-home/dashboard-home.component';
import { UserEditComponent } from './page/user-edit/user-edit.component';
import { UserFormComponent } from './component/user-form/user-form.component';
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
        component: UserFormComponent,
    },
    {
        path: 'users/edit/id',
        component: UserEditComponent,
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }
