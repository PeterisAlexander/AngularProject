import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';



@NgModule({
  declarations: [LoginComponent, DashboardComponent, HomeComponent],
  imports: [
    CommonModule
  ]
})
export class BusinessModule { }
