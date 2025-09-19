import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <section class="container py-10">
      <h1 class="text-2xl font-bold mb-2">Bienvenue sur SocioJustice Lite</h1>
      <p class="text-gray-600">Base Angular prête à étendre (Header + Router + Tailwind).</p>
    </section>
  `
})
export class HomeComponent {}
