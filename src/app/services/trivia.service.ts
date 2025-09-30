import { Injectable } from '@angular/core';
import { from, Observable, switchMap, of, map } from 'rxjs';

export interface ApiQuestion {
  id: string;
  correctAnswer: string;
  correctAnswerOriginal?: string;
  incorrectAnswers: string[];
  incorrectAnswersOriginal?: string[];
  question: {
    text: string;
    originalText?: string;
  };
}

export interface ApiCategories {
  [key: string]: string[];
}

export interface Categoria {
  id: string;
  nombre: string;
  nombreOriginal?: string;
}

export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export interface PokemonDetails {
  name: string;
  sprites: {
    front_default: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TriviaService {
  private apiUrl = 'https://the-trivia-api.com/v2/questions';
  private categoriesUrl = 'https://the-trivia-api.com/v2/categories';
  private pokemonApiUrl = 'https://pokeapi.co/api/v2/';

  constructor() { }

  getCategories(): Observable<Categoria[]> {
    const categoriesPromise = fetch(this.categoriesUrl).then(res => {
      if (!res.ok) {
        throw new Error('Error al obtener las categorías.');
      }
      return res.json() as Promise<ApiCategories>;
    }).then(async apiCategories => {
      const categoriesToTranslate = Object.keys(apiCategories).map(nombre => ({
        id: apiCategories[nombre][0],
        nombre: nombre
      }));

      const translatedCategories = await Promise.all(categoriesToTranslate.map(async cat => ({
        ...cat,
        nombre: await this.translateText(cat.nombre),
        nombreOriginal: cat.nombre
      })));
      return translatedCategories;
    });
    return from(categoriesPromise);
  }

  getQuestions(category?: string): Observable<ApiQuestion[]> {
    const url = category ? `${this.apiUrl}?categories=${category}` : this.apiUrl;
    // 1. Obtenemos las preguntas de la API de Trivia
    return from(fetch(url).then(res => {
      if (!res.ok) {
        throw new Error('La respuesta de la red no fue satisfactoria.');
      }

      return res.json() as Promise<ApiQuestion[]>;
    })).pipe(
      // 2. Usamos switchMap para encadenar con la operación de traducción
      switchMap(questions => {
        // 3. Creamos un array de promesas, donde cada una traduce una pregunta completa
        const translationPromises = questions.map(q => this.translateQuestion(q));
        // 4. `Promise.all` espera a que todas las traducciones se completen
        return from(Promise.all(translationPromises));
      })
    );
  }

  getPokemonQuestions(count: number = 10): Observable<ApiQuestion[]> {
    // Usamos 'of' para iniciar un stream de RxJS y encadenar operadores
    return of(null).pipe(
      switchMap(() => {
        // 1. Obtenemos la lista de todos los Pokémon para tener nombres para las opciones
        return from(
          fetch(`${this.pokemonApiUrl}pokemon?limit=1025`).then(res => res.json() as Promise<PokemonListResponse>)
        );
      }),
      switchMap((pokemonListResponse: PokemonListResponse) => {
        const allPokemon = pokemonListResponse.results;
        const questionPromises: Promise<ApiQuestion>[] = [];

        for (let i = 0; i < count; i++) {
          // 2. Para cada pregunta, elegimos 4 Pokémon al azar
          const optionsPokemon: Pokemon[] = [];
          const usedIndexes = new Set<number>();
          while (optionsPokemon.length < 4) {
            const randomIndex = Math.floor(Math.random() * allPokemon.length);
            if (!usedIndexes.has(randomIndex)) {
              optionsPokemon.push(allPokemon[randomIndex]);
              usedIndexes.add(randomIndex);
            }
          }

          const correctPokemon = optionsPokemon[0]; // El primero será el correcto
          const incorrectPokemon = optionsPokemon.slice(1);

          // 3. Obtenemos los detalles del Pokémon correcto para su sprite
          const questionPromise = fetch(correctPokemon.url)
            .then(res => res.json() as Promise<PokemonDetails>)
            .then(details => ({
              id: `pokemon_${details.name}`,
              correctAnswer: correctPokemon.name,
              incorrectAnswers: incorrectPokemon.map(p => p.name),
              question: { text: details.sprites.front_default }
            }));
          questionPromises.push(questionPromise);
        }
        // 4. Esperamos a que todas las promesas de preguntas se resuelvan
        return from(Promise.all(questionPromises));
      })
    );
  }

  getPokemonReverseQuestions(count: number = 10): Observable<ApiQuestion[]> {
    // 1. Obtenemos la lista completa de Pokémon
    return from(fetch(`${this.pokemonApiUrl}pokemon?limit=1025`).then(res => res.json() as Promise<PokemonListResponse>)).pipe(
      switchMap((pokemonListResponse: PokemonListResponse) => {
        const allPokemon = pokemonListResponse.results;
        const questionPromises: Promise<ApiQuestion>[] = [];

        for (let i = 0; i < count; i++) {
          // 2. Para cada pregunta, elegimos 4 Pokémon al azar
          const optionsPokemon: Pokemon[] = [];
          const usedIndexes = new Set<number>();
          while (optionsPokemon.length < 4) {
            const randomIndex = Math.floor(Math.random() * allPokemon.length);
            if (!usedIndexes.has(randomIndex)) {
              optionsPokemon.push(allPokemon[randomIndex]);
              usedIndexes.add(randomIndex);
            }
          }

          // 3. Obtenemos los detalles (y sprites) de los 4 Pokémon
          const detailPromises = optionsPokemon.map(p =>
            fetch(p.url).then(res => res.json() as Promise<PokemonDetails>)
          );

          const questionPromise = Promise.all(detailPromises).then(details => {
            // 4. Construimos la pregunta en el formato esperado
            const correctPokemonDetails = details[0];
            const incorrectPokemonDetails = details.slice(1);

            return {
              id: `pokemon_reverse_${correctPokemonDetails.name}`,
              // La pregunta es el nombre del Pokémon
              question: { text: correctPokemonDetails.name.charAt(0).toUpperCase() + correctPokemonDetails.name.slice(1) },
              // La respuesta correcta es la URL del sprite
              correctAnswer: correctPokemonDetails.sprites.front_default,
              // Las respuestas incorrectas son las URLs de los otros sprites
              incorrectAnswers: incorrectPokemonDetails.map(d => d.sprites.front_default),
            };
          });
          questionPromises.push(questionPromise);
        }
        return from(Promise.all(questionPromises));
      })
    );
  }
 
  /**
   * Traduce el texto de una pregunta y sus respuestas de inglés a español.
   */
  private async translateQuestion(question: ApiQuestion): Promise<ApiQuestion> {
    const [translatedQuestionText, translatedCorrectAnswer, ...translatedIncorrectAnswers] = await Promise.all([
      this.translateText(question.question.text),
      this.translateText(question.correctAnswer),
      ...question.incorrectAnswers.map(ans => this.translateText(ans))
    ]);
 
    return {
      ...question,
      question: { text: translatedQuestionText, originalText: question.question.text },
      correctAnswer: translatedCorrectAnswer,
      incorrectAnswers: translatedIncorrectAnswers,
      // Guardamos los originales en nuevas propiedades
      correctAnswerOriginal: question.correctAnswer,
      incorrectAnswersOriginal: question.incorrectAnswers
    };
  }
 
  /**
   * Llama a la API de Google Translate para un texto específico.
   */
  private async translateText(text: string, sourceLang: string = 'en', targetLang: string = 'es'): Promise<string> {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      // La respuesta de Google es un array anidado. La traducción principal está en la primera posición.
      const translatedText = data[0]?.[0]?.[0];
      return translatedText || text;
    } catch (error) {
      console.error('Error en la traducción:', error);
      // Si hay un error en la petición (ej. CORS, red), devolvemos el texto original.
      return text;
    }
  }
}