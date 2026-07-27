import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  readonly baseUrl: string = (() => {
    const env = (window as any).__env;
    if (env?.API_URL) return env.API_URL;
    return /localhost|127\.0\.0\.1|::1/.test(window.location.hostname)
      ? 'http://localhost:5000/api'
      : '/api';
  })();
}
