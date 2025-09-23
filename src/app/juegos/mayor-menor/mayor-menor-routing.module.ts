import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MayorMenor } from './mayor-menor';

const routes: Routes = [
  { path: '', component: MayorMenor }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MayorMenorRoutingModule { }