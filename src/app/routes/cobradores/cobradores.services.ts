
/*
------------ LOCALHOST -------------
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auditoria } from './auditoria.model'; // Asegúrate de que la ruta es correcta

@Injectable({ providedIn: 'root' })
export class CobradoresServices {

  constructor(private http: HttpClient) { }

  getCobradoresData(): Observable<any> {
    return this.http.get('http://localhost:8080/api/mostrarcobradores');
  }

  insertCobrador(cobradorData: any): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/insertarcobrador', cobradorData);
  }

  updateCobrador(collector_id: number, cobradorData: any): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/api/actualizarcobrador/${collector_id}`, cobradorData);
  }

  deleteCobrador(collector_id: number, datos: any): Observable<any> {
    return this.http.delete<any>(`http://localhost:8080/api/eliminarcobrador/${collector_id}`, { body: datos });
  }

  getCobradoresByName(nombre: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/cobrador/nombre/${nombre}`);
  }

   // Método para registrar auditoría
   registrarAuditoria(auditoria: Auditoria): Observable<any> {
    return this.http.post('http://localhost:8080/api/insertarbitacora', auditoria);
  }

}
*/

/*
------------ DESARROLLO -------------
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auditoria } from './auditoria.model'; // Asegúrate de que la ruta es correcta

@Injectable({ providedIn: 'root' })
export class CobradoresServices {

  constructor(private http: HttpClient) { }

  getCobradoresData(): Observable<any> {
    return this.http.get('http://180.183.174.156:7004/sic/api/mostrarcobradores');
  }

  insertCobrador(cobradorData: any): Observable<any> {
    return this.http.post<any>('http://180.183.174.156:7004/sic/api/insertarcobrador', cobradorData);
  }

  updateCobrador(collector_id: number, cobradorData: any): Observable<any> {
    return this.http.put<any>(`http://180.183.174.156:7004/sic/api/actualizarcobrador/${collector_id}`, cobradorData);
  }

  deleteCobrador(collector_id: number, datos: any): Observable<any> {
    return this.http.delete<any>(`http://180.183.174.156:7004/sic/api/eliminarcobrador/${collector_id}`, { body: datos });
  }

  getCobradoresByName(nombre: string): Observable<any[]> {
    return this.http.get<any[]>(`http://180.183.174.156:7004/sic/api/cobrador/nombre/${nombre}`);
  }

   // Método para registrar auditoría
   registrarAuditoria(auditoria: Auditoria): Observable<any> {
    return this.http.post('http://180.183.174.156:7004/sic/api/insertarbitacora', auditoria);
  }

}
*/

/*

------------ CALIDAD -------------
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auditoria } from './auditoria.model';

@Injectable({ providedIn: 'root' })
export class CobradoresServices {

  constructor(private http: HttpClient) { }

  getCobradoresData(): Observable<any> {
    return this.http.get('http://180.183.171.164:7004/sic/api/mostrarcobradores');
  }

  insertCobrador(cobradorData: any): Observable<any> {
    return this.http.post<any>('http://180.183.171.164:7004/sic/api/insertarcobrador', cobradorData);
  }

  updateCobrador(collector_id: number, cobradorData: any): Observable<any> {
    return this.http.put<any>(`http://180.183.171.164:7004/sic/api/actualizarcobrador/${collector_id}`, cobradorData);
  }

  deleteCobrador(collector_id: number, datos: any): Observable<any> {
    return this.http.delete<any>(`http://180.183.171.164:7004/sic/api/eliminarcobrador/${collector_id}`, { body: datos });
  }

  getCobradoresByName(nombre: string): Observable<any[]> {
    return this.http.get<any[]>(`http://180.183.171.164:7004/sic/api/cobrador/nombre/${nombre}`);
  }

   // Método para registrar auditoría
   registrarAuditoria(auditoria: Auditoria): Observable<any> {
    return this.http.post('http://180.183.171.164:7004/sic/api/insertarbitacora', auditoria);
  }

}
*/


/*

------------ PRODUCCION -------------

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auditoria } from './auditoria.model';

@Injectable({ providedIn: 'root' })
export class CobradoresServices {

  constructor(private http: HttpClient) { }

  getCobradoresData(): Observable<any> {
    return this.http.get('http://172.27.66.165:7003/sic/api/mostrarcobradores');
  }

  insertCobrador(cobradorData: any): Observable<any> {
    return this.http.post<any>('http://172.27.66.165:7003/sic/api/insertarcobrador', cobradorData);
  }

  updateCobrador(collector_id: number, cobradorData: any): Observable<any> {
    return this.http.put<any>(`http://172.27.66.165:7003/sic/api/actualizarcobrador/${collector_id}`, cobradorData);
  }

  deleteCobrador(collector_id: number, datos: any): Observable<any> {
    return this.http.delete<any>(`http://172.27.66.165:7003/sic/api/eliminarcobrador/${collector_id}`, { body: datos });
  }

  getCobradoresByName(nombre: string): Observable<any[]> {
    return this.http.get<any[]>(`http://172.27.66.165:7003/sic/api/cobrador/nombre/${nombre}`);
  }

   // Método para registrar auditoría
   registrarAuditoria(auditoria: Auditoria): Observable<any> {
    return this.http.post('http://172.27.66.165:7003/sic/api/insertarbitacora', auditoria);
  }

}
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Auditoria } from './auditoria.model';
import { environment } from '@env/environment'; // Importa environment
import { catchError, retry } from 'rxjs/operators';
import { Configuracion, ResponseModel } from '../../models/configuracion.model';


@Injectable({ providedIn: 'root' })
export class CobradoresServices {
  private baseUrl = environment.sic; // Usa la URL base de environment

    httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  // Listar todas las configuraciones
  getAll(): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${this.baseUrl}/api/mostrarconfiguraciones`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  // Buscar por módulo
  findByModulo(modulo: string): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${this.baseUrl}/api/buscarconfiguracionbymodulo/${modulo}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  // Crear nueva configuración
  create(configuracion: Configuracion): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.baseUrl}/api/insertarconfiguracion`, configuracion, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar configuración
  update(id: number, configuracion: Configuracion): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(`${this.baseUrl}/api/actualizarconfiguracion/${id}`, configuracion, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar configuración
  delete(id: number): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.baseUrl}/api/eliminarconfiguracion/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error('Algo malo sucedió; por favor, inténtelo de nuevo más tarde.'));
  }





  getCobradoresData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/mostrarcobradores`);
  }

  insertCobrador(cobradorData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/insertarcobrador`, cobradorData);
  }

  updateCobrador(collector_id: number, cobradorData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/actualizarcobrador/${collector_id}`, cobradorData);
  }

  deleteCobrador(collector_id: number, datos: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/eliminarcobrador/${collector_id}`, { body: datos });
  }

  getCobradoresByName(nombre: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/cobrador/nombre/${nombre}`);
  }

  registrarAuditoria(auditoria: Auditoria): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/insertarbitacora`, auditoria);
  }

}

