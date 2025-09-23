import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreguntadosRoutingModule } from './preguntados-routing.module';
import { Preguntados } from './preguntados';

@NgModule({
  imports: [
    CommonModule,
    PreguntadosRoutingModule,
    Preguntados,
  ],

})
export class PreguntadosModule { }