import { Component, OnDestroy, OnInit, isDevMode } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { Subject, interval, startWith, switchMap, takeUntil } from 'rxjs';
import { HealthService } from '../../core/health.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf],
  template: `
    <header class="border-b">
      <div class="container flex items-center justify-between py-4">
        <a routerLink="/" class="text-xl font-semibold">SocioJustice Lite</a>

        <nav class="flex items-center gap-6">
          <a routerLink="/" class="hover:underline">Accueil</a>
          <a routerLink="/recherche" class="hover:underline">Recherche</a>
          <a routerLink="/decisions" class="hover:underline">Décisions</a>
          <a routerLink="/auth" class="hover:underline">Connexion</a>

          <!-- Badge visible uniquement en DEV -->
          <ng-container *ngIf="showBadge">
            <span
              class="text-xs px-2 py-1 rounded-full border"
              [ngClass]="online
                ? 'border-green-600 text-green-700 bg-green-50'
                : 'border-red-600 text-red-700 bg-red-50'">
              API : {{ online ? 'Online' : 'Offline' }}
            </span>
          </ng-container>
        </nav>
      </div>
    </header>
  `
})
export class HeaderComponent implements OnInit, OnDestroy {
  online = false;
  showBadge = isDevMode();
  private readonly destroy$ = new Subject<void>();

  constructor(private health: HealthService) {}

  ngOnInit() {
    if (this.showBadge) {
      interval(10_000).pipe(
        startWith(0),
        switchMap(() => this.health.checkOnce()),
        takeUntil(this.destroy$)
      ).subscribe(isOk => this.online = isOk);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
