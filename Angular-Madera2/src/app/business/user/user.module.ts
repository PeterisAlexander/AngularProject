import { NgModule } from '@angular/core';
import { DashboardModule } from '../dashboard/dashboard.module';
import { UserEditComponent } from './page/user-edit/user-edit.component';
import { UserFormComponent } from './component/user-form/user-form.component';
import { UserHeaderComponent } from './component/user-header/user-header.component';
import { UserListComponent } from './page/user-list/user-list.component';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
      UserHeaderComponent,
      UserListComponent,
      UserEditComponent,
      UserFormComponent,
    ],
    imports: [
      DashboardModule,
      UserRoutingModule,
      SharedModule,
  ],
  providers: [],
})
export class UserModule { }
