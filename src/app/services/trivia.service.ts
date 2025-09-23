import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class TriviaService {
  private apiUrl = 'https://the-trivia-api.com/v2/questions';
  private categoriesUrl = 'https://the-trivia-api.com/v2/categories';

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