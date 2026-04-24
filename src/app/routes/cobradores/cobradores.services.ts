import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Auditoria } from './auditoria.model';
import { environment } from '@env/environment'; // Importa environment
import { catchError, retry } from 'rxjs/operators';
import { Configuracion, ResponseModel } from '../../models/configuracion.model';


@Injectable({ providedIn: 'root' })
export class CobradoresServices {
  private baseUrl = environment.sic;

    httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  // Listar todas las configuraciones
getAll(descValor: string): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${this.baseUrl}/api/mostrarconfiguraciones?descValor=${descValor}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
}

// Obtener configuración por ID (usando el nuevo endpoint)
getConfiguracionById(id: number): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${this.baseUrl}/api/configuracion/${id}`)
        .pipe(catchError(this.handleError));
}

// Búsqueda paginada (ya la tienes, pero verifica la URL)
buscarConfiguracionesPaginadas(descValor: string, modulo: string, page: number, pageSize: number): Observable<any> {
    let url = `${this.baseUrl}/api/buscarconfiguracionespaginado?descValor=${descValor}&page=${page}&pageSize=${pageSize}`;
    if (modulo && modulo.trim() !== '') {
        url += `&modulo=${encodeURIComponent(modulo)}`;
    }
    return this.http.get<any>(url).pipe(catchError(this.handleError));
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

  // Método actualizado para recibir ID original y datos
updateCobrador(idOriginal: number, cobradorData: any): Observable<any> {
  // ID original en la URL, datos completos en el body
  return this.http.put(`${this.baseUrl}/api/actualizarcobrador/${idOriginal}`, cobradorData);
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

