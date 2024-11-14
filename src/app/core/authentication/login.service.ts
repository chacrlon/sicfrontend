import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Token, User } from './interface';
import { base64, currentTimestamp, filterObject, Menu, STATUS } from '@core';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { loginUsuario } from 'app/models/usuarios';
import { Observable } from 'rxjs';
import { loginLdap } from 'app/models/loginLdap';

class JWT {
  generate(user: loginLdap) {
    const expiresIn = 3600;
    const refreshTokenExpiresIn = 86400;

    return filterObject({
      access_token: this.createToken(user, expiresIn),
      token_type: 'bearer',

    });
  }

  getUser(req: HttpRequest<any>) {
    let token = '';

    if (req.body?.refresh_token) {
      token = req.body.refresh_token;
    } else if (req.headers.has('Authorization')) {
      const authorization = req.headers.get('Authorization');
      const result = (authorization as string).split(' ');
      token = result[1];
    }

    try {
      const now = new Date();
      const data = JWT.parseToken(token);

      return JWT.isExpired(data, now) ? null : data.user;
    } catch (e) {
      return null;
    }
  }

  createToken(user: User, expiresIn = 0) {
    const exp = user.refresh_token ? currentTimestamp() + expiresIn : undefined;

    return [
      base64.encode(JSON.stringify({ typ: 'JWT', alg: 'HS256' })),
      base64.encode(JSON.stringify(filterObject(Object.assign({ exp, user })))),
      base64.encode('ng-matero'),
    ].join('.');
  }

  private static parseToken(accessToken: string) {
    const [, payload] = accessToken.split('.');

    return JSON.parse(base64.decode(payload));
  }

  private static isExpired(data: any, now: Date) {
    const expiresIn = new Date();
    expiresIn.setTime(data.exp * 1000);
    const diff = this.dateToSeconds(expiresIn) - this.dateToSeconds(now);

    return diff <= 0;
  }

  private static dateToSeconds(date: Date) {
    return Math.ceil(date.getTime() / 1000);
  }
}
const jwt = new JWT();

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  urlGet : string = ''; // Agregar enlace de http para extraer datos de usuarios administradores.

  constructor(protected http: HttpClient) {
    this.urlGet = environment.ldapUrl;
  }

  login(usuario : loginUsuario): any{
    var url = this.urlGet + '/validarCredenciales';
     return this.http.post<loginLdap>(url, usuario).subscribe(
      (data) =>{
        const currentUser = Object.assign({}, data);
        return { Headers , url, body: jwt.generate(currentUser) };
            }
    );
}

  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/auth/refresh', params);
  }

  logout() {
    // cierre de sesion
    return this.http.post<any>('/auth/logout', {});
  }

  me() {
    // obtener menu por micro servicios
  //  console.log("menu fue")
    return this.http.get<{ menu: Menu[] }>('/me');
  }

  menu() {
    //console.log("menu fue 2")
    return this.http.get<{ menu: Menu[] }>('/me/menu').pipe(map(res => res.menu));
  }
}
