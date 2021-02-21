import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibModule } from '../lib/lib.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';



@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    CoreModule,
    FormsModule,
    LibModule,
    ReactiveFormsModule,
    RouterModule,
],
imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    LibModule,
    ReactiveFormsModule,
    RouterModule,
],
})
export class SharedModule { }
