import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

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

  {
    path: 'private',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/private/private-test.component').then(m => m.PrivateTestComponent),
    title: 'Zone privée — Test',
  },

  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    title: 'Accueil — SocioJustice Lite'
  },
  /*
    {
      path: 'recherche',
      loadComponent: () =>
        import('./pages/search/search.component').then(m => m.SearchComponent),
      title: 'Recherche — SocioJustice Lite',
      canActivate: [AuthGuard]
    },
    {
      path: 'decisions',
      loadComponent: () =>
        import('./pages/decisions/decisions.component').then(m => m.DecisionsComponent),
      title: 'Décisions — SocioJustice Lite',
      canActivate: [AuthGuard]
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'Home' }
    */
  { path: '**', redirectTo: 'auth/login' },
];
