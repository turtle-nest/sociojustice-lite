import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Accueil — SocioJustice Lite' },
  { path: 'recherche', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent), title: 'Recherche — SocioJustice Lite' },
  { path: 'decisions', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent), title: 'Décisions — SocioJustice Lite' },
  { path: '**', redirectTo: '' }
];
