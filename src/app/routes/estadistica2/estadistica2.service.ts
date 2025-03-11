/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Estadistica2Service {

  constructor(private http: HttpClient) { }

  // Nuevo método para obtener estadísticas por fecha
  getEstadisticasPorFechaPIC(fecha: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/estadistica2pic?fecha=${fecha}`);
  }

  // Nuevo método para obtener estadísticas por fecha
  getEstadisticasPorFechaPCP(fecha: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/estadistica2pcp?fecha=${fecha}`);
  }
}
/*
*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Estadistica2Service {

  constructor(private http: HttpClient) { }

  getEstadisticasPorFechaPIC(fecha: string): Observable<any> {
    return this.http.get<any>(`http://180.183.174.156:7004/sic/api/estadistica2pic?fecha=${fecha}`);
  }

  getEstadisticasPorFechaPCP(fecha: string): Observable<any> {
    return this.http.get<any>(`http://180.183.174.156:7004/sic/api/estadistica2pcp?fecha=${fecha}`);
  }
}

