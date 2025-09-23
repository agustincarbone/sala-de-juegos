import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MayorMenorRoutingModule } from './mayor-menor-routing.module';
import { MayorMenor } from './mayor-menor';

@NgModule({
  imports: [
    CommonModule,
    MayorMenorRoutingModule,
    MayorMenor,
  ]
})
export class MayorMenorModule { }