import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { environment } from '@env/environment';


@Injectable({
    providedIn: 'root'
})
export class DepartamentosService {
    urlGet : string = '';

    constructor(private http: HttpClient){
        this.urlGet = environment.diremURl;
    }

    obtenerDepartamentos(): Observable<any>{
        var url = this.urlGet + '/departamentos';        
        return this.http.post(url,"");
    }

    obtenerCargos(): Observable<any>{
        var url = this.urlGet + '/cargos';        
        return this.http.post(url,"");
    }
}