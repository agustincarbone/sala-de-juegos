import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-quien-soy',
  imports: [],
  templateUrl:'./quien-soy.html',
  styleUrl: './quien-soy.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuienSoy {

  nombre = 'Carbone Agustin';
  edad = 25;
  carrera = 'Tecnicatura Universitaria en Programacion';
  universidad = 'Universidad Tecnologica Nacional';
  imageUrl = '';
}
