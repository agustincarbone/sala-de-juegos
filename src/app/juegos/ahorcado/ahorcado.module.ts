import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AhorcadoRoutingModule } from './ahorcado-routing.module';
import { Ahorcado } from './ahorcado';

@NgModule({
  imports: [
    CommonModule,
    AhorcadoRoutingModule,
    Ahorcado,
  ]
})
export class AhorcadoModule { }
