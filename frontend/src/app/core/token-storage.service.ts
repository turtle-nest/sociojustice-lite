import { Injectable } from '@angular/core';

const KEY = 'sj_token';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  // Switch to sessionStorage() if you prefer session-only auth
  private storage = localStorage;

  set(token: string): void {
    this.storage.setItem(KEY, token);
  }

  get(): string | null {
    return this.storage.getItem(KEY);
  }

  clear(): void {
    this.storage.removeItem(KEY);
  }
}
