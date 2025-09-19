import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development'; // dev for ng serve
import { catchError, map, of, timeout } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HealthService {
  private readonly healthUrl = `${environment.apiBaseUrl}/health`;

  constructor(private http: HttpClient) {}

  /**
   * Ping backend /health and return boolean availability.
   * - times out fast (1.5s) to keep UI responsive
   * - any error -> false (offline)
   */
  checkOnce() {
    return this.http.get<{ status: string }>(this.healthUrl).pipe(
      timeout(1500),
      map(res => res?.status?.toLowerCase() === 'ok'),
      catchError(() => of(false))
    );
  }
}
