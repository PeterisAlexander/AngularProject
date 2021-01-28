import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthentificationModule } from './authentification/authentification.module';

@NgModule({
  exports: [AuthentificationModule],
  imports: [CommonModule],
})
export class BusinessModule {}
