import { Routes, RouterModule } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const routes: Routes = [
    {
        path: '', redirectTo: 'login', pathMatch: 'full'
    },
    {
        path: 'login', loadComponent: () => import('./page/login/login').then(m => m.Login)
    },
    {
        path: 'register', loadComponent: () => import('./page/register/register').then(m => m.Register)
    },
    {
        path: 'home', loadComponent: () => import('./page/inicio/inicio').then(m => m.Inicio), canActivate: [authGuard]
    },
    {
        path: 'chat', loadComponent: () => import('./chat/chat').then(m => m.Chat), canActivate: [authGuard]
    },
    {
        path: 'quien-soy', loadComponent: () => import('./quien-soy/quien-soy').then(m => m.QuienSoy)
    },
    {
        path: 'ahorcado',
        loadChildren: () => import('./juegos/ahorcado/ahorcado.module').then(m => m.AhorcadoModule),
        canActivate: [authGuard],
        providers: [provideHttpClient()]
    },
    {
        path: 'mayor-menor',
        loadChildren: () => import('./juegos/mayor-menor/mayor-menor.module').then(m => m.MayorMenorModule),
        canActivate: [authGuard],
        providers: [provideHttpClient()]
    },
    {
        path: 'preguntados',
        loadChildren: () => import('./juegos/preguntados/preguntados.module').then(m => m.PreguntadosModule),
        canActivate: [authGuard],
        providers: [provideHttpClient()]
    }


];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutes { }