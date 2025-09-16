import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { authState } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';
import { time } from 'console';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  // Usamos el observable authState para manejar la asincronía
  return authState(auth).pipe(
    take(1),
    map(user => {
      if (user) {
        return true; // Si hay un usuario, permite el acceso.
      }
      else
      {
        return router.createUrlTree(['/login']); // Si no hay usuario, redirige a login.
      }
    })
  );
};
