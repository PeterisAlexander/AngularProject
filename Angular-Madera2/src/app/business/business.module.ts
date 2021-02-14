import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardHomeComponent } from './dashboard/page/dashboard-home/dashboard-home.component';
import { DashboardHeaderComponent } from './dashboard/page/dashboard-header/dashboard-header.component';
import { LibModule } from '../lib/lib.module';
import { CardComponent } from './card/card.component';



@NgModule({
  declarations: [CardComponent, LoginComponent, DashboardHomeComponent, HomeComponent, DashboardHeaderComponent],
  imports: [
    LibModule,
    CommonModule
  ]
})
export class BusinessModule { }
