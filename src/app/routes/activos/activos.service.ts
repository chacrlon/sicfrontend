/*
------------ LOCALHOST -------------
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivosService {
  private urlEndPoint = 'http://localhost:8080/api/credito/morosos';

  constructor(private http: HttpClient) { }

  getActivos(): Observable<any> {
    return this.http.get<any>(this.urlEndPoint);
  }

  getCreditByIdCustomerOrAccountNumber(consulta: string): Observable<any[]> {
    console.log(consulta);
    return this.http.get<any[]>(`http://localhost:8080/api/credito/consultar_moroso/${consulta}`);
  }

}
*/

/*
------------ DESARROLLO -------------
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivosService {
  private urlEndPoint = 'http://180.183.174.156:7004/sic/api/credito/morosos';

  constructor(private http: HttpClient) { }

  getActivos(): Observable<any> {
    return this.http.get<any>(this.urlEndPoint);
  }

  getCreditByIdCustomerOrAccountNumber(consulta: string): Observable<any[]> {
    console.log(consulta);
    return this.http.get<any[]>(`http://180.183.174.156:7004/sic/api/credito/consultar_moroso/${consulta}`);
  }

}
*/


/*
------------ CALIDAD -------------
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivosService {
  private urlEndPoint = 'http://180.183.171.164:7004/sic/api/credito/morosos';

  constructor(private http: HttpClient) { }

  getActivos(): Observable<any> {
    return this.http.get<any>(this.urlEndPoint);
  }

  getCreditByIdCustomerOrAccountNumber(consulta: string): Observable<any[]> {
    console.log(consulta);
    return this.http.get<any[]>(`http://180.183.171.164:7004/sic/api/credito/consultar_moroso/${consulta}`);
  }
}
*/



/*
------------ PRODUCCION -------------
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivosService {
  private urlEndPoint = 'http://172.27.66.165:7003/sic/api/credito/morosos';

  constructor(private http: HttpClient) { }

  getActivos(): Observable<any> {
    return this.http.get<any>(this.urlEndPoint);
  }

  getCreditByIdCustomerOrAccountNumber(consulta: string): Observable<any[]> {
    console.log(consulta);
    return this.http.get<any[]>(`http://172.27.66.165:7003/sic/api/credito/consultar_moroso/${consulta}`);
  }

}

*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivosService {
  private urlEndPoint = 'http://180.183.174.156:7004/sic/api/credito/morosos';

  constructor(private http: HttpClient) { }

  getActivos(): Observable<any> {
    return this.http.get<any>(this.urlEndPoint);
  }

  getCreditByIdCustomerOrAccountNumber(consulta: string): Observable<any[]> {
    console.log(consulta);
    return this.http.get<any[]>(`http://180.183.174.156:7004/sic/api/credito/consultar_moroso/${consulta}`);
  }

}
