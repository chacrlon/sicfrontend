import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';

export interface Auditoria {
  idAuditoria: number;
  descripcion: string;
  tipoAccion: string;
  usuarioAccion: string;
  fechaRegistro: string;
}

interface ApiResponse {
  code: number;
  message: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  private apiUrl = environment.sic; // Usa la URL de SIC desde environment

  constructor(private http: HttpClient) { }

  consultarTodo(): Observable<Auditoria[]> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/api/consultartodo`).pipe(
      map(response => {
        if (response.code === 1000) {
          // Mapea los campos para que coincidan con tu HTML
          return response.data.map((item: any) => ({
            idregistroauditoria: item.idAuditoria,
            accion: item.tipoAccion,
            descripcion: item.descripcion,
            usuario: item.usuarioAccion,
            fecharegistro: item.fechaRegistro
          }));
        } else {
          throw new Error(response.message);
        }
      })
    );
  }

  consultarPorFechas(fechaInicio: string, fechaFin: string): Observable<Auditoria[]> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);

    return this.http.get<ApiResponse>(`${this.apiUrl}/api/consultarporfechas`, { params }).pipe(
      map(response => {
        if (response.code === 1000) {
          // Mapea los campos para que coincidan con tu HTML
          return response.data.map((item: any) => ({
            idregistroauditoria: item.idAuditoria,
            accion: item.tipoAccion,
            descripcion: item.descripcion,
            usuario: item.usuarioAccion,
            fecharegistro: item.fechaRegistro
          }));
        } else {
          throw new Error(response.message);
        }
      })
    );
  }

  consultarPorPalabra(palabra: string): Observable<Auditoria[]> {
    const params = new HttpParams().set('palabra', palabra);
    return this.http.get<ApiResponse>(`${this.apiUrl}/api/consultarporpalabra`, { params }).pipe(
      map(response => {
        if (response.code === 1000) {
          // Mapea los campos para que coincidan con tu HTML
          return response.data.map((item: any) => ({
            idregistroauditoria: item.idAuditoria,
            accion: item.tipoAccion,
            descripcion: item.descripcion,
            usuario: item.usuarioAccion,
            fecharegistro: item.fechaRegistro
          }));
        } else {
          throw new Error(response.message);
        }
      })
    );
  }

  insertarBitacora(datos: any): Observable<any> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/api/insertarbitacora`, datos).pipe(
      map(response => {
        if (response.code === 1000) {
          return response;
        } else {
          throw new Error(response.message);
        }
      })
    );
  }
}
