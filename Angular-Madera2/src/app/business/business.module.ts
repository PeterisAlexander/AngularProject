import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LibModule } from '../lib/lib.module';
import { UserModule } from './user/user.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { BacASableComponent } from './bac-a-sable/bac-a-sable.component';



@NgModule({
  declarations: [ BacASableComponent],
  exports: [UserModule, DashboardModule],
  imports: [
    LibModule,
    CommonModule
  ]
})
export class BusinessModule { }
