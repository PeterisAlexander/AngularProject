import { NgModule } from '@angular/core';

import { UiModule } from './ui/ui.module';



@NgModule({
  exports: [UiModule],
  imports: [UiModule]
})
export class LibModule { }
