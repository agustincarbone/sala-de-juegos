import { Component, OnInit } from '@angular/core';

interface Carta {
  valor: number;
  palo: string;
}

@Component({
  selector: 'app-mayor-menor',
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.css'
})
export class MayorMenor implements OnInit{
  mazo: Carta[] = [];
  cartaActual: Carta | undefined;
  puntuacion: number = 0;
  resultado: string = '';
  juegoTerminado: boolean = false;

  palos: string[] = ["copas", "bastos", "espadas", "oros"];

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego(): void{
    this.mazo = this.crearMazo();
    this.barajarMazo();
    this.cartaActual = this.darCarta();
    this.puntuacion = 0;
    this.resultado = '';
    this.juegoTerminado = false;
  }

  crearMazo(): Carta[] {
    const nuevoMazo: Carta[] = [];
    for (const palo of this.palos) {
      for (let valor = 1; valor <= 12; valor++) {
        nuevoMazo.push({ valor, palo });
      }
    }
    return nuevoMazo;
  }

  barajarMazo(): void {
    this.mazo.sort(() => Math.random() - 0.5);
  }

  darCarta(): Carta | undefined {
    return this.mazo.pop();
  }

  predecir(prediccion: string): void {
    if (!this.cartaActual || this.juegoTerminado) return;

    const nuevaCarta = this.darCarta();

    if (!nuevaCarta) {
      this.resultado = '¡Mazo terminado!';
      this.juegoTerminado = true;
      return;
    }

    if (nuevaCarta.valor === this.cartaActual.valor) {
      this.resultado = '¡Empate! Predice de nuevo.';
      this.cartaActual = nuevaCarta; // Se actualiza la carta actual para la siguiente predicción
      return;
    } else {
      const esMayor = nuevaCarta.valor > this.cartaActual.valor;
      const acerto = (prediccion === 'mayor' && esMayor) || (prediccion === 'menor' && !esMayor);

      if (acerto) {
        this.puntuacion++;
        this.resultado = '¡Correcto!';
      } else {
        this.resultado = '¡Incorrecto! Juego terminado.';
        this.juegoTerminado = true;
      }
      this.cartaActual = nuevaCarta;
    }
  }
}
