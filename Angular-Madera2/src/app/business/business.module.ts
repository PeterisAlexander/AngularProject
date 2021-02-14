import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardHomeComponent } from './dashboard/page/dashboard-home/dashboard-home.component';
import { DashboardHeaderComponent } from './dashboard/page/dashboard-header/dashboard-header.component';
import { LibModule } from '../lib/lib.module';
import { CardComponent } from './dashboard/component/card/card.component';
import { BarChartComponent } from './dashboard/component/chart/bar-chart/bar-chart.component';
import { DoughnutChartComponent } from './dashboard/component/chart/doughnut-chart/doughnut-chart.component';



@NgModule({
  declarations: [CardComponent, LoginComponent, DashboardHomeComponent, HomeComponent, DashboardHeaderComponent, BarChartComponent, DoughnutChartComponent],
  imports: [
    LibModule,
    CommonModule
  ]
})
export class BusinessModule { }
