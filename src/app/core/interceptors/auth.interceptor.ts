import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const sessionToken = localStorage.getItem('uniqueSessionToken');
    const excludedUrls = ['/api/registerSession', '/api/heartbeat', '/api/logout', '/validarCredenciales', '/crearSesion'];
    const isExcluded = excludedUrls.some(url => req.url.includes(url));

    let authReq = req;
    if (sessionToken && !isExcluded) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${sessionToken}` }
      });
    }
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          sessionStorage.clear();
          localStorage.removeItem('uniqueSessionToken');
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
