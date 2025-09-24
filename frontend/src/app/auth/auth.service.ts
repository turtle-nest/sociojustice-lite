import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, delay } from 'rxjs';
import { TokenStorage } from '../core/token-storage.service';
import { environment } from '../../environments/environment';

export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { email: string; password: string; confirmPassword: string; }
export interface AuthResponse { token: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  // TODO: move to environment.ts
  private readonly API = '/api/auth';

  // Expose auth state to the app (navbar, guards, etc.)
  private readonly _isAuthenticated$ = new BehaviorSubject<boolean>(false);
  readonly isAuthenticated$ = this._isAuthenticated$.asObservable();

  // Tell the app if the user is currently logged in (sync check)
  public isLoggedIn(): boolean {
    const token = this.getToken();
    return this.isValidJwt(token);
  }

  constructor(private http: HttpClient, private storage: TokenStorage) {
    const token = this.storage.get();
    this._isAuthenticated$.next(this.isValidJwt(token));
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    // MOCK MODE
    if (environment.mockAuth) {
      const b64u = (s: string) => btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const header = b64u(JSON.stringify({ alg: 'none', typ: 'JWT' }));
      const body = b64u(JSON.stringify({
        sub: payload.email,
        exp: Math.floor(Date.now() / 1000) + 24 * 3600
      }));
      const token = `${header}.${body}.x`;

      return of({ token }).pipe(
        delay(300),
        tap(res => {
          this.storage.set(res.token);
          this._isAuthenticated$.next(this.isValidJwt(res.token));
        })
      );
    }

    // BACKEND READY
    return this.http.post<AuthResponse>(`${this.API}/login`, payload).pipe(
      tap(res => {
        this.storage.set(res.token);
        this._isAuthenticated$.next(this.isValidJwt(res.token));
      })
    );
  }

  register(payload: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.API}/register`, payload);
  }

  logout(): void {
    this.storage.clear();
    this._isAuthenticated$.next(false);
  }

  getToken(): string | null {
    return this.storage.get();
  }

  /** Optionally used by interceptors */
  getAuthHeader(): { Authorization?: string } {
    const t = this.getToken();
    return t ? { Authorization: `Bearer ${t}` } : {};
  }

  /** Basic JWT check: has 3 parts and not expired */
  private isValidJwt(token: string | null): boolean {
    if (!token) return false;
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const b64urlToB64 = (s: string) => {
      // convert base64url to base64 + add padding
      s = s.replace(/-/g, '+').replace(/_/g, '/');
      const pad = s.length % 4;
      if (pad === 2) s += '==';
      else if (pad === 3) s += '=';
      else if (pad !== 0) return ''; // invalid length
      return s;
    };

    try {
      const payloadB64 = b64urlToB64(parts[1]);
      if (!payloadB64) return false;
      const payload = JSON.parse(atob(payloadB64));

      if (payload?.exp && typeof payload.exp === 'number') {
        const nowSec = Math.floor(Date.now() / 1000);
        return payload.exp > nowSec;
      }
      // No exp → consider valid in mock mode
      return true;
    } catch {
      return false;
    }
  }
}
