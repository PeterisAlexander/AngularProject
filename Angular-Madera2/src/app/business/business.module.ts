import { NgModule } from '@angular/core';
import { UserModule } from './user/user.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { BacASableComponent } from './bac-a-sable/bac-a-sable.component';
import { CommunModule } from './commun/commun.module';



@NgModule({
  declarations: [BacASableComponent],
  exports: [
    DashboardModule,
    UserModule,
  ],
  imports: []
})
export class BusinessModule { }
