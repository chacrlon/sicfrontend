import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { json } from 'stream/consumers';
import { IUsuarioObj } from 'app/models/usuarios';



export interface IUsuario{
    codUsuario : string,
    nombre : string,
    Apellido : string,
    cedula : string,
    correo : string,
    dpto : string,
    cargo : string,
    codSupervisor : string
}

export  interface Iclave{
    codUsuario : string,
    clave: string
}

@Injectable({
    providedIn: 'root'
})
export class ConsultaUsuarioService {
    urlGet : string = '';


    constructor(private http: HttpClient){
        this.urlGet = environment.diremURl;
    }


    busquedaUsuario(usuario : IUsuario): Observable<any>{
        var url = this.urlGet + '/busquedaUsuarios';
        var jsonEnvio = JSON.stringify(usuario);
        return this.http.post(url, usuario);
    }

    cambioClave(cambio :Iclave):Observable<any>{
        var url = this.urlGet + '/cambioClave';
        var jsonEnvio = JSON.stringify(cambio);
        return this.http.post(url, cambio);
    }
/*----------------------------------VERIFICACION USUARIO-------------------------------------------------------*/
    consultarUsuarioFull(codUsuario : string):Observable<any>{
        var url = this.urlGet + '/consultarUsuarioFull';
        var jsonEnvio = JSON.stringify(codUsuario);
        return this.http.post(url, codUsuario);
    }
/*---------------------------------------------FIN--------------------------------------------------------------*/
    consultarUsuarioDetalle(codUsuario : string):Observable<any>{
        var url = this.urlGet + '/consultarUsuarioEdit';
        var jsonEnvio = JSON.stringify(codUsuario);
        return this.http.post(url, codUsuario);
    }

    modificar(emp : IUsuarioObj):Observable<any>{
        var url = this.urlGet + '/editarUsuario';
        var jsonEnvio = JSON.stringify(emp);
        return this.http.post(url, emp);
    }


    crear(emp : IUsuarioObj):Observable<any>{
        var url = this.urlGet + '/crearUsuario';
        var jsonEnvio = JSON.stringify(emp);
        return this.http.post(url, emp);
    }
}
