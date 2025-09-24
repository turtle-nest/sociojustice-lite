import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Accueil — SocioJustice Lite' },

  {
    path: 'auth/login',
    loadComponent: () =>
      import('./auth/pages/login/login.component').then(m => m.LoginComponent),
    title: 'Connexion — SocioJustice Lite'
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./auth/pages/register/register.component').then(m => m.RegisterComponent),
    title: 'Inscription — SocioJustice Lite'
  },
/*
  {
    path: 'recherche',
    loadComponent: () =>
      import('./pages/search/search.component').then(m => m.SearchComponent),
    title: 'Recherche — SocioJustice Lite'
  },
  {
    path: 'decisions',
    loadComponent: () =>
      import('./pages/decisions/decisions.component').then(m => m.DecisionsComponent),
    title: 'Décisions — SocioJustice Lite'
  },
*/
  { path: '**', redirectTo: 'auth/login' }
];
