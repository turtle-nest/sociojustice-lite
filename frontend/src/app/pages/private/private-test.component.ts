import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-private-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen grid place-items-center bg-gray-950 text-white">
      <div class="bg-gray-900 border border-gray-700 p-8 rounded-xl">
        <h1 class="text-2xl font-bold">Zone privée</h1>
        <p class="text-gray-400">Si tu vois ceci, le guard a laissé passer (token présent).</p>
      </div>
    </div>
  `
})
export class PrivateTestComponent {}
