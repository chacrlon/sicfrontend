/*
--------- LOCALHOST ---------
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Estadistica1Service {

  constructor(private http: HttpClient) { }

  // Método existente para obtener los datos
  getMorososData(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/estadistica1');
  }

  // Nuevo método para obtener estadísticas por fecha
  getEstadisticasPorFecha(fecha: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/estadistica?fecha=${fecha}`);
  }

    // Nuevo método para obtener estadísticas por fecha
    getEstadisticasPorFechaPIC(fecha: string): Observable<any> {
      return this.http.get<any>(`http://localhost:8080/api/estadistica2pic?fecha=${fecha}`);
    }

    // Nuevo método para obtener estadísticas por fecha
    getEstadisticasPorFechaPCP(fecha: string): Observable<any> {
      return this.http.get<any>(`http://localhost:8080/api/estadistica2pcp?fecha=${fecha}`);
    }

}
*/

/*
--------- DESARROLLO ---------
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Estadistica1Service {

  constructor(private http: HttpClient) { }

  // Método existente para obtener los datos
  getMorososData(): Observable<any[]> {
    return this.http.get<any[]>('http://180.183.174.156:7004/sic/api/estadistica1');
  }

  // Nuevo método para obtener estadísticas por fecha
  getEstadisticasPorFecha(fecha: string): Observable<any> {
    return this.http.get<any>(`http://180.183.174.156:7004/sic/api/estadistica?fecha=${fecha}`);
  }

    // Nuevo método para obtener estadísticas por fecha
    getEstadisticasPorFechaPIC(fecha: string): Observable<any> {
      return this.http.get<any>(`http://180.183.174.156:7004/sic/api/estadistica2pic?fecha=${fecha}`);
    }

    // Nuevo método para obtener estadísticas por fecha
    getEstadisticasPorFechaPCP(fecha: string): Observable<any> {
      return this.http.get<any>(`http://180.183.174.156:7004/sic/api/estadistica2pcp?fecha=${fecha}`);
    }

}
*/
/*
--------- CALIDAD ---------
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Estadistica1Service {

  constructor(private http: HttpClient) { }

  // Método existente para obtener los datos
  getMorososData(): Observable<any[]> {
    return this.http.get<any[]>('http://180.183.171.164:7004/sic/api/estadistica1');
  }

  // Nuevo método para obtener estadísticas por fecha
  getEstadisticasPorFecha(fecha: string): Observable<any> {
    return this.http.get<any>(`http://180.183.171.164:7004/sic/api/estadistica?fecha=${fecha}`);
  }

    // Nuevo método para obtener estadísticas por fecha
    getEstadisticasPorFechaPIC(fecha: string): Observable<any> {
      return this.http.get<any>(`http://180.183.171.164:7004/sic/api/estadistica2pic?fecha=${fecha}`);
    }

    // Nuevo método para obtener estadísticas por fecha
    getEstadisticasPorFechaPCP(fecha: string): Observable<any> {
      return this.http.get<any>(`http://180.183.171.164:7004/sic/api/estadistica2pcp?fecha=${fecha}`);
    }

}
*/


/*
--------- PRODUCCION ---------

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Estadistica1Service {

  constructor(private http: HttpClient) { }

  // Método existente para obtener los datos
  getMorososData(): Observable<any[]> {
    return this.http.get<any[]>('http://172.27.66.165:7003/sic/api/estadistica1');
  }

  // Nuevo método para obtener estadísticas por fecha
  getEstadisticasPorFecha(fecha: string): Observable<any> {
    return this.http.get<any>(`http://172.27.66.165:7003/sic/api/estadistica?fecha=${fecha}`);
  }

    // Nuevo método para obtener estadísticas por fecha
    getEstadisticasPorFechaPIC(fecha: string): Observable<any> {
      return this.http.get<any>(`http://172.27.66.165:7003/sic/api/estadistica2pic?fecha=${fecha}`);
    }

    // Nuevo método para obtener estadísticas por fecha
    getEstadisticasPorFechaPCP(fecha: string): Observable<any> {
      return this.http.get<any>(`http://172.27.66.165:7003/sic/api/estadistica2pcp?fecha=${fecha}`);
    }

}

*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Estadistica1Service {

  constructor(private http: HttpClient) { }

  // Método existente para obtener los datos
  getMorososData(): Observable<any[]> {
    return this.http.get<any[]>('http://180.183.174.156:7004/sic/api/estadistica1');
  }

  // Nuevo método para obtener estadísticas por fecha
  getEstadisticasPorFecha(fecha: string): Observable<any> {
    return this.http.get<any>(`http://180.183.174.156:7004/sic/api/estadistica?fecha=${fecha}`);
  }

    // Nuevo método para obtener estadísticas por fecha
    getEstadisticasPorFechaPIC(fecha: string): Observable<any> {
      return this.http.get<any>(`http://180.183.174.156:7004/sic/api/estadistica2pic?fecha=${fecha}`);
    }

    // Nuevo método para obtener estadísticas por fecha
    getEstadisticasPorFechaPCP(fecha: string): Observable<any> {
      return this.http.get<any>(`http://180.183.174.156:7004/sic/api/estadistica2pcp?fecha=${fecha}`);
    }

}
