import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="border-b">
      <div class="container flex items-center justify-between py-4">
        <a routerLink="/" class="text-xl font-semibold">SocioJustice Lite</a>
        <nav class="flex gap-6">
          <a routerLink="/" class="hover:underline">Accueil</a>
          <a routerLink="/recherche" class="hover:underline">Recherche</a>
          <a routerLink="/decisions" class="hover:underline">Décisions</a>
        </nav>
      </div>
    </header>
  `
})
export class HeaderComponent {}
