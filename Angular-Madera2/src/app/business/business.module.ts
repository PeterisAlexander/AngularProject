import { NgModule } from '@angular/core';
import { UserModule } from './user/user.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { BacASableComponent } from './bac-a-sable/bac-a-sable.component';



@NgModule({
  declarations: [BacASableComponent],
  exports: [
    UserModule,
    DashboardModule
  ],
  imports: []
})
export class BusinessModule { }
