import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CardComponent } from './component/card/card.component';
import { BarChartComponent } from './component/chart/bar-chart/bar-chart.component';
import { DoughnutChartComponent } from './component/chart/doughnut-chart/doughnut-chart.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHeaderComponent } from './page/dashboard-header/dashboard-header.component';
import { DashboardHomeComponent } from './page/dashboard-home/dashboard-home.component';



@NgModule({
  declarations: [
    DashboardHeaderComponent,
    CardComponent,
    BarChartComponent,
    DoughnutChartComponent,
    DashboardHomeComponent,
  ],
  exports: [DashboardHeaderComponent],
  imports: [
    DashboardRoutingModule,
    SharedModule
  ],
})
export class DashboardModule {}