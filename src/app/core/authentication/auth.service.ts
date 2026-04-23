import { Injectable } from '@angular/core';
import { BehaviorSubject, iif, merge, of } from 'rxjs';
import { catchError, map, share, switchMap, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { LoginService } from './login.service';
import { filterObject, isEmptyObject } from './helpers';
import { User } from './interface';
import { loginUsuario } from 'app/models/usuarios';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { SessionMonitorService } from 'app/servicios/administrador/session-monitor.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new BehaviorSubject<User>({});
  private authStatus$ = new BehaviorSubject<boolean>(false);
  private change$ = merge(
    this.tokenService.change(),
    this.tokenService.refresh().pipe(switchMap(() => this.refresh()))
  ).pipe(
    switchMap(() => this.assignUser()),
    share()
  );

  constructor(private loginService: LoginService, private tokenService: TokenService, private sessionMonitor: SessionMonitorService,
    private http: HttpClient) {}

  init() {
    return new Promise<void>(resolve => this.change$.subscribe(() => resolve()));
  }

  change() {

    return this.change$;
  }

  check() {
    var verifi : any = sessionStorage.getItem('hasTokenV');
    var resp : boolean;
    if(verifi != undefined){
      ​var decrypted = CryptoJS.TripleDES.decrypt(verifi, "tkSecret");
      if(decrypted.toString(CryptoJS.enc.Utf8) == "success"){

        resp = true;
      }else{
        resp = false;
      }
    }else{
      resp = false;
    }

    this.authStatus$.next(resp); // <- Notificar cambio
    return resp;
  }

  getAuthStatus() { // <- Nuevo método
    return this.authStatus$.asObservable();
  }

  login(usuario: loginUsuario) {
  return this.loginService.login(usuario).pipe(
    tap((response: any) => {
      // Suponiendo que response contiene access_token
      if (response && response.access_token) {
        this.tokenService.set(response);
      }
    }),
    map(() => this.check())
  );
}

  refresh() {
    return this.loginService
      .refresh(filterObject({ refresh_token: this.tokenService.getRefreshToken() }))
      .pipe(
        catchError(() => of(undefined)),
        tap(token => this.tokenService.set(token)),
        map(() => this.check())
      );
  }

// Asegúrate de que el método logout emita el cambio de estado

  logout() {
  const sessionToken = localStorage.getItem('uniqueSessionToken');
  if (!sessionToken) {
    // si no hay token de sesión, solo limpia local
    this.tokenService.clear();
    sessionStorage.clear();
    return of(false);
  }
  const url = `${environment.sicApiUrl}/api/logout`;
  const headers = { Authorization: `Bearer ${sessionToken}` };
  return this.http.post(url, {}, { headers }).pipe(
    tap(() => {
      this.sessionMonitor.stopHeartbeat();
      this.tokenService.clear();
      sessionStorage.clear();
    }),
    map(() => false)
  );
}


  user() {

    return this.user$.pipe(share());
  }

  menu() {
    return iif(() => this.check(), this.loginService.menu(), of([]));
  }

  private assignUser() {
    if (!this.check()) {
      return of({}).pipe(tap(user => this.user$.next(user)));
    }

    if (!isEmptyObject(this.user$.getValue())) {
      return of(this.user$.getValue());
    }

    return this.loginService.me().pipe(tap(user => this.user$.next(user)));
  }
}
