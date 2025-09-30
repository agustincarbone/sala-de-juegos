import { Injectable, inject } from '@angular/core';
import { from, Observable } from 'rxjs';

export interface GithubProfile {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string | null;
  blog: string;
  location: string;
  email: string | null;
  bio: string;
  public_repos: number;
  followers: number;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private apiUrl = 'https://api.github.com/users/';

  getProfile(username: string): Observable<GithubProfile> {
    // Usamos `from` para convertir la Promise de fetch en un Observable,
    // manteniendo la consistencia con otros servicios como TriviaService.
    const profilePromise = fetch(`${this.apiUrl}${username}`).then(res => {
      if (!res.ok) {
        throw new Error('No se pudo obtener el perfil de GitHub.');
      }
      return res.json() as Promise<GithubProfile>;
    });

    return from(profilePromise);
  }
}