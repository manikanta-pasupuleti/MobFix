import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptorFn: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  try {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('mf_token') : null;
    const request = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

    return next(request).pipe(
      catchError((err: unknown) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          try { localStorage.removeItem('mf_token'); } catch (_) {}
          try { window.location.href = '/login'; } catch (_) {}
        }
        return throwError(() => err);
      })
    );
  } catch (e) {
    return next(req);
  }
};
