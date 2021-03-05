import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NoDataComponent } from './component/no-data/no-data.component';
import { LoadingDataComponent } from './component/loading-data/loading-data.component';



@NgModule({
  declarations: [NoDataComponent, LoadingDataComponent],
  exports: [NoDataComponent, LoadingDataComponent],
  imports: [
    SharedModule
  ]
})
export class CommunModule { }
