import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { json } from 'stream/consumers';
import { loginUsuario } from 'app/models/usuarios';
import { loginLdap } from 'app/models/loginLdap';
import { ajax } from 'rxjs/ajax';
import { Menu } from '@core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';


export  interface Irol{
  cedula : string,
  app: string
}

export interface Isesion{
    codUsuario: String,
    codAplicativo : String
}


@Injectable({
    providedIn: 'root'
})

export class LoginService{
    urlGet : string = '';
    urlInt : string = '';

    constructor(private http: HttpClient,
      private router: Router,){
        this.urlGet = environment.ldapUrl;
        this.urlInt = environment.intServiciosUrl;
    }

    validarUsuario(usuario : loginUsuario): Observable<any>{
        var url = this.urlGet + '/validarCredenciales';
      return  this.http.post<loginLdap>(url, usuario);
    }


    usuario(cedula : string): Observable<any>{
        var envio = {
            cedula :cedula
        }
        var url = this.urlGet + '/obtenerUsuario';
        var jsonEnvio = JSON.stringify(envio);
        return  this.http.post<loginLdap>(url, jsonEnvio);
    }

    obtenerMenu(rol : Irol) : Observable<any> {
        var url =  this.urlInt + '/obtenerMenu';
        return this.http.post(url, rol);

    }

    crearSesion(codUsuario : string):Observable<any>{
        var url =  this.urlInt + '/crearSesion';
        var session : Isesion = {
            codUsuario :codUsuario,
            codAplicativo : environment.app
        } as Isesion;
        var jsonEnvio = JSON.stringify(session);
        return this.http.post(url, jsonEnvio);
    }

    cerrarSesion(codUsuario : string):Observable<any>{
        var url = this.urlInt + '/cerrarSesion';
        var session : Isesion = {
            codUsuario :codUsuario,
            codAplicativo : environment.app
        } as Isesion;
        var jsonEnvio = JSON.stringify(session);
        return this.http.post(url, jsonEnvio);
    }

    extenderSesion(codUsuario : string):Observable<any>{
        var url = this.urlInt + '/extenderSesion';
        var session : Isesion = {
            codUsuario :codUsuario,
            codAplicativo : environment.app
        } as Isesion;
        var jsonEnvio = JSON.stringify(session);
        return this.http.post(url, jsonEnvio);
    }


        unmetodo(laurl:any,rol:any){ // ESTADO

         // console.log("la url actual tiene como valor",laurl)
          let laurlActual: String;
          laurlActual=laurl
          let tienesMenu:boolean=false;
          let unarray:any[]=[]
           var verifi2 : any = sessionStorage.getItem('hasToken');
            var decrypted2 = CryptoJS.TripleDES.decrypt(verifi2, "CiSecret");
          //  console.log("la cedula es:: ",decrypted2.toString(CryptoJS.enc.Utf8))

            rol.app = environment.app;
            rol.cedula = decrypted2.toString(CryptoJS.enc.Utf8);

          this.obtenerMenu(rol).subscribe(
              (data) =>{
             //   console.log(data)
                data.lstMenu.menu.forEach((element:any) => {
               //   console.log("estoy recorriendo, ",element)
                  element.children.forEach((dataRecorrer:any) => {
                //    console.log("el children es:: ", dataRecorrer)
                 //   console.log("el route es:: ",dataRecorrer.route)
                    unarray.push(dataRecorrer.route);
                  });

                });

                unarray.forEach(element => {
               //   console.log(element)

                  if (element==laurlActual) {
                 //   console.log("si tienes la url señor")
                    tienesMenu=true;
                  }
                });
                 // console.log("el booleano es:: ",tienesMenu)

                if (!tienesMenu) {

                  var has : any =  sessionStorage.getItem("hasTokenN");
                  ​var decrypted = CryptoJS.TripleDES.decrypt(has, "tkcodSecret");
                   this.cerrarSesion(decrypted.toString(CryptoJS.enc.Utf8)).subscribe(
                    (data) => {
                        if(data.status == "sucess"){
                          sessionStorage.clear();
                          this.router.navigateByUrl('/auth/login');
                        }else{
                          sessionStorage.clear();
                          this.router.navigateByUrl('/auth/login');
                        }
                    });

                }

              }
          )

        }
}
