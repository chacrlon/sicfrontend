import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from './auth.service';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authenticate();
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    return this.authenticate();
  }

  private authenticate(): boolean | UrlTree {


    var verifi : any = sessionStorage.getItem('hasTokenV');
    var resp : boolean;
    if(verifi != undefined){
      ​var decrypted = CryptoJS.TripleDES.decrypt(verifi, "tkSecret");
      if(decrypted.toString(CryptoJS.enc.Utf8) == "success"){

        sessionStorage.setItem('urlOld', CryptoJS.TripleDES.encrypt(this.router.url,"urlOld").toString());


        resp = true;
      }else{
        resp = false;
      }
    }else{
      resp = false;
    }
    return resp ? true : this.router.parseUrl('/auth/login');

  }
}

