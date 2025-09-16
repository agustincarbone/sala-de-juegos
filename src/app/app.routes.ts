import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./page/login/login').then(m => m.Login) },
    { path: 'register', loadComponent: () => import('./page/register/register').then(m => m.Register) },
    { 
        path: 'home', 
        loadComponent: () => import('./page/inicio/inicio').then(m => m.Inicio),
        canActivate: [authGuard] // Protegemos la ruta home
    },
    { 
        path: 'chat', 
        loadComponent: () => import('./chat/chat').then(m => m.Chat),
        canActivate: [authGuard] // Protegemos la ruta del chat
    },
    { path: 'quien-soy', loadComponent: () => import('./quien-soy/quien-soy').then(m => m.QuienSoy) },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];