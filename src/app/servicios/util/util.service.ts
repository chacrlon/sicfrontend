import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class UtilService{

    urlGet : string = ''; //endpoint general de servicios administrador
    urlSic :string;
    constructor(private http: HttpClient){
        this.urlGet = environment.diremURl;
        this.urlSic = environment.sic
    }

    obtenerEstatus(): Observable<any>{
        var url = this.urlGet + '/estatus';
        return this.http.post(url,"");
    }

    obtenerIdiomas(): Observable<any>{
        var url = this.urlGet + '/idiomas';
        return this.http.post(url,"");
    }

    obtenerNacionalidad(): Observable<any>{
        var url = this.urlGet + '/nacionalidad';
        return this.http.post(url,"");
    }

    obtenerEmpresas(): Observable<any>{
        var url = this.urlGet + '/empresas';
        return this.http.post(url,"");
    }

    obtenerGrupoPagos(): Observable<any>{
        var url = this.urlGet + '/gruposPagos';
        return this.http.post(url,"");
    }

    getActivo(): Observable<any>{
      var url = this.urlSic + "/api/activo";
      var envio = {
        estatus: 0,
          numeroCuenta: "01020107100000369824",
          contrato: "010234549",
          montoDeudaContrato: "200"
    }
      return this.http.get(url);

  }
}
