import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css'
})

export class Ahorcado implements OnInit {
  private words: string[] = ['javascript', 'desarrollo', 'programacion', 'ordenador', 'teclado', 'internet', 'angular'];
  public palabra = '';
  public definicion = '';
  public mostrarPalabra: string[] = [];
  public intentos: Set<string> = new Set();
  public errores = 0;
  public readonly maxErrores = 6;
  public alfabeto: string[] = 'abcdefghijklmnñopqrstuvwxyz'.split('');
  public estadoJuego: 'jugando' | 'ganaste' | 'perdiste' = 'jugando';

  ngOnInit(): void {
    this.startGame();
  }

  private quitarAcentos(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  public async startGame(): Promise<void> {
    this.definicion = '';

    try {
      const response = await fetch('https://rae-api.com/api/random');

      const data = await response.json();

      const infoPalabra = data.data;

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      else {
        const palabraOriginal = infoPalabra.word;
        this.palabra = this.quitarAcentos(palabraOriginal);

        try {
          const responseDef = await fetch(`https://rae-api.com/api/words/${palabraOriginal}`);
          const dataDef = await responseDef.json();
          this.definicion = dataDef.data.meanings[0].senses[0].description;

        }
        catch (error) {
          console.error("Error al obtener definición de la API.", error);
        }
      }
    } catch (error) {
      console.error("Error al obtener palabra de la API, usando lista local.", error);

      const palabraOriginal = this.words[Math.floor(Math.random() * this.words.length)];
      this.palabra = this.quitarAcentos(palabraOriginal);
    }

    this.mostrarPalabra = Array(this.palabra.length).fill('');
    this.intentos.clear();
    this.errores = 0;
    this.estadoJuego = 'jugando';
  }

  public manejadorIntento(letra: string): void {
    if (this.estadoJuego !== 'jugando' || this.intentos.has(letra)) {
      return;
    }

    this.intentos.add(letra);

    if (this.palabra.includes(letra)) {
      for (let i = 0; i < this.palabra.length; i++) {
        if (this.palabra[i] === letra) {
          this.mostrarPalabra[i] = letra;
        }
      }
      this.comprobarEstado();
    } else {
      this.errores++;
      this.comprobarEstado();
    }
  }

  private comprobarEstado(): void {
    if (this.mostrarPalabra.join('') === this.palabra) {
      this.estadoJuego = 'ganaste';
    } else if (this.errores >= this.maxErrores) {
      this.estadoJuego = 'perdiste';
    }
  }
}
