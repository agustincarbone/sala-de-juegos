import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TriviaService, ApiQuestion, Categoria, PokemonDetails } from '../../services/trivia.service';
import { FormsModule } from '@angular/forms';
export interface Pregunta {

  pregunta: string;
  opciones: string[];
  respuestaCorrecta: string;
  // Añadimos un objeto para guardar la versión en español
  espanol: {
    pregunta: string;
    respuestaCorrecta: string;
    opciones: string[];
  };
  // Añadimos un objeto para guardar la versión en inglés
  ingles: {
    pregunta: string;
    respuestaCorrecta: string | undefined;
    opciones: string[] | undefined;
  };
}

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule, FormsModule],

  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css'
})
export class Preguntados implements OnInit {
  triviaService = inject(TriviaService);

  categorias: Categoria[] = [];
  categoriaSeleccionada: string | null = null;
  preguntas: Pregunta[] = [];
  preguntaActual: Pregunta | undefined;
  puntuacion = 0;
    idioma:string ="es";
    indicePreguntaActual = 0;
  juegoTerminado = false;
  respuestaSeleccionada: string | null = null;
  cargando = true;
  estadoJuego: 'seleccion' | 'jugando' | 'terminado' = 'seleccion';

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.cargando = true;
    this.triviaService.getCategories().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        // Agregamos la categoría Pokémon manualmente
        this.categorias.push({ id: 'pokemon-inverso', nombre: 'Pokemon Sprites' });
        this.categorias.push({ id: 'pokemon', nombre: 'Pokemon' });
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener las categorías', err);
        this.cargando = false;
      }
    });
  }

  formatearCategoria(categoria: string): string {
    return categoria.replace('_', ' ').toUpperCase();
  }
  
  cambiarIdioma(): void {
      this.idioma = this.idioma === 'es' ? 'en' : 'es';
      if (this.preguntaActual) {
        if (this.idioma === 'es') {
          this.preguntaActual.pregunta = this.preguntaActual.espanol.pregunta;
          this.preguntaActual.opciones = this.preguntaActual.espanol.opciones;
          this.preguntaActual.respuestaCorrecta = this.preguntaActual.espanol.respuestaCorrecta;
        } else {
          this.preguntaActual.pregunta = this.preguntaActual.ingles.pregunta || '';
          this.preguntaActual.opciones = this.preguntaActual.ingles.opciones || [];
          this.preguntaActual.respuestaCorrecta = this.preguntaActual.ingles.respuestaCorrecta || '';
        }
      }
  }


  cargarPreguntas(categoria: string) {
    this.cargando = true;

    if (categoria === 'pokemon') {
      this.cargarPreguntasPokemon();
      return;
    }

    if (categoria === 'pokemon-inverso') {
      this.cargarPreguntasPokemonInverso();
      return;
    }

    this.triviaService.getQuestions(categoria).subscribe({
      next: (apiQuestions: ApiQuestion[]) => {
        this.preguntas = apiQuestions.map(q => {
          const opciones = [...q.incorrectAnswers, q.correctAnswer];
          // Mezclar opciones
          opciones.sort(() => Math.random() - 0.5);
          const opcionesOriginales = q.incorrectAnswersOriginal ? [...q.incorrectAnswersOriginal, q.correctAnswerOriginal || ''] : [];
          opcionesOriginales.sort(() => Math.random() - 0.5);

          return {
            pregunta: q.question.text,
            opciones: opciones,
            respuestaCorrecta: q.correctAnswer,
            espanol: {
              pregunta: q.question.text,
              opciones: opciones,
              respuestaCorrecta: q.correctAnswer
            },
            ingles: {
              pregunta: q.question.originalText || '',
              respuestaCorrecta: q.correctAnswerOriginal,
              opciones: opcionesOriginales
            }
          };
        });
        this.comenzarRonda();
      },
      error: (err) => {
        console.error('Error al obtener preguntas de la API', err);
        this.cargando = false;
      }
    });
  }

  cargarPreguntasPokemon() {
    this.cargando = true;
    this.triviaService.getPokemonQuestions().subscribe({
      next: (apiQuestions: ApiQuestion[]) => {
        this.preguntas = apiQuestions.map(q => {
          const opciones = [...q.incorrectAnswers, q.correctAnswer];
          opciones.sort(() => Math.random() - 0.5);

          return {
            pregunta: q.question.text, // La URL del sprite
            opciones: opciones.map(name => name.charAt(0).toUpperCase() + name.slice(1)), // Capitalizamos nombres
            respuestaCorrecta: q.correctAnswer.charAt(0).toUpperCase() + q.correctAnswer.slice(1),
            espanol: { pregunta: '', opciones: [], respuestaCorrecta: '' }, // No aplica para Pokémon
            ingles: { pregunta: '', opciones: undefined, respuestaCorrecta: undefined } // No aplica para Pokémon
          };
        });
        this.comenzarRonda();
      },
      error: (err) => {
        console.error('Error al obtener preguntas de Pokémon', err);
        this.cargando = false;
      }
    });
  }

  cargarPreguntasPokemonInverso() {
    this.cargando = true;
    this.triviaService.getPokemonReverseQuestions().subscribe({
      next: (apiQuestions: ApiQuestion[]) => {
        this.preguntas = apiQuestions.map(q => {
          const opciones = [...q.incorrectAnswers, q.correctAnswer];
          opciones.sort(() => Math.random() - 0.5);

          return {
            // La pregunta es el nombre del Pokémon
            pregunta: `¿Cuál de estos es ${q.question.text}?`,
            // Las opciones son las URLs de los sprites
            opciones: opciones,
            respuestaCorrecta: q.correctAnswer,
            espanol: { pregunta: '', opciones: [], respuestaCorrecta: '' },
            ingles: { pregunta: '', opciones: undefined, respuestaCorrecta: undefined }
          };
        });
        this.comenzarRonda();
      },
      error: (err) => {
        console.error('Error al obtener preguntas de Pokémon Sprites', err);
        this.cargando = false;
      }
    });
  }

  seleccionarCategoria(categoria: Categoria): void {
    this.categoriaSeleccionada = categoria.id;
    this.estadoJuego = 'jugando';
    this.indicePreguntaActual = 0;
    this.puntuacion = 0;
    this.juegoTerminado = false;
    this.cargarPreguntas(categoria.id);
  }

  comenzarRonda(): void {
    this.juegoTerminado = false;
    this.estadoJuego = 'jugando';
    this.respuestaSeleccionada = null;
    this.preguntaActual = this.preguntas[this.indicePreguntaActual];

    if (this.categoriaSeleccionada !== 'pokemon' && this.categoriaSeleccionada !== 'pokemon-inverso') {
      // Imprimimos en consola la pregunta y respuestas en inglés para la pregunta actual
      console.log('--- Pregunta Original (Inglés) ---');
      console.log('Pregunta:', this.preguntaActual?.ingles.pregunta);
      console.log('Respuesta Correcta:', this.preguntaActual?.ingles.respuestaCorrecta);
      console.log('Opciones:', this.preguntaActual?.ingles.opciones);
    }

    this.cargando = false;

  }

  seleccionarRespuesta(opcion: string): void {
    if (this.respuestaSeleccionada) return;

    this.respuestaSeleccionada = opcion;
    if (opcion === this.preguntaActual?.respuestaCorrecta) {
      this.puntuacion++;
    }

    let tiempoEspera = 1000; // Tiempo por defecto de 1 segundo
    if (opcion !== this.preguntaActual?.respuestaCorrecta) {
      tiempoEspera = 2000; // Esperar 2 segundos si la respuesta es incorrecta
    }
    setTimeout(() => this.siguientePregunta(), tiempoEspera);
  }

  siguientePregunta(): void {
    this.indicePreguntaActual++;
    if (this.indicePreguntaActual < this.preguntas.length) {

      this.comenzarRonda();
    } else {
      this.juegoTerminado = true;
      this.estadoJuego = 'terminado';
    }
  }

  volverASeleccion(): void {
    window.location.reload();
  }

}