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

  constructor(private loginService: LoginService, private tokenService: TokenService) {}

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

  login(usuario : loginUsuario) {
    return this.loginService.login(usuario).pipe(

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
  return this.loginService.logout().pipe(
    tap(() => {
      this.tokenService.clear();
      this.check(); // Forzar la actualización de authStatus$
    }),
    map(() => !this.check())
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
