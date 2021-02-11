import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardHomeComponent } from './dashboard/page/dashboard-home/dashboard-home.component';



@NgModule({
  declarations: [LoginComponent, DashboardHomeComponent, HomeComponent],
  imports: [
    CommonModule
  ]
})
export class BusinessModule { }
