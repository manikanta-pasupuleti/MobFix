import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  apiUrl = 'http://localhost:5000/api';

  get token(): string | null {
    return localStorage.getItem('mf_token');
  }

  set token(value: string | null) {
    if (value) localStorage.setItem('mf_token', value);
    else localStorage.removeItem('mf_token');
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, credentials).pipe(
      tap((res: any) => {
        if (res && res.token) this.token = res.token;
      })
    );
  }

  register(payload: { name: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/users/register`, payload).pipe(
      tap((res: any) => {
        if (res && res.token) this.token = res.token;
      })
    );
  }

  logout() {
    this.token = null;
  }
}
