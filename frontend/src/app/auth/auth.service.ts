import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginRequest { email: string; password: string; }
interface RegisterRequest { email: string; password: string; confirmPassword: string; }
interface AuthResponse { token: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  // TODO: move to environment.ts
  private readonly API = '/api/auth';

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/login`, payload);
  }

  register(payload: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.API}/register`, payload);
  }
}
