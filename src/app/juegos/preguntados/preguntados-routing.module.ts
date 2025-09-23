import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Preguntados } from './preguntados';

const routes: Routes = [
  { path: '', component: Preguntados }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreguntadosRoutingModule { }