/*
 ------------- LOCALHOST -------------
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MorosoService {

  constructor(private http: HttpClient) { }

  // Método existente para obtener los datos de morosos
  getMorososData(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/deuda/morosos');
  }

  // Método para obtener registros por número de cuenta
  getByIdCustomerOrAccountNumber(accountNumber: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/deuda/consultar_moroso/${accountNumber}`);
  }

  // Método para obtener otros tipos de registros por el mismo número de cuenta
  getByIdCustomerOrAccountNumber2(accountNumber: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/deuda/consultar_moroso2/${accountNumber}`);
  }
}

*/

/*
 ------------- DESARROLLO -------------
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MorosoService {

  constructor(private http: HttpClient) { }

  // Método existente para obtener los datos de morosos
  getMorososData(): Observable<any[]> {
    return this.http.get<any[]>('http://180.183.174.156:7004/sic/api/deuda/morosos');
  }

  // Método para obtener registros por número de cuenta
  getByIdCustomerOrAccountNumber(accountNumber: string): Observable<any> {
    return this.http.get<any>(`http://180.183.174.156:7004/sic/api/deuda/consultar_moroso/${accountNumber}`);
  }

  // Método para obtener otros tipos de registros por el mismo número de cuenta
  getByIdCustomerOrAccountNumber2(accountNumber: string): Observable<any> {
    return this.http.get<any>(`http://180.183.174.156:7004/sic/api/deuda/consultar_moroso2/${accountNumber}`);
  }
}
*/


/*
 ------------- CALIDAD -------------
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MorosoService {

  constructor(private http: HttpClient) { }

  // Método existente para obtener los datos de morosos
  getMorososData(): Observable<any[]> {
    return this.http.get<any[]>('http://180.183.171.164:7004/sic/api/deuda/morosos');
  }

  // Método para obtener registros por número de cuenta
  getByIdCustomerOrAccountNumber(accountNumber: string): Observable<any> {
    return this.http.get<any>(`http://180.183.171.164:7004/sic/api/deuda/consultar_moroso/${accountNumber}`);
  }

  // Método para obtener otros tipos de registros por el mismo número de cuenta
  getByIdCustomerOrAccountNumber2(accountNumber: string): Observable<any> {
    return this.http.get<any>(`http://180.183.171.164:7004/sic/api/deuda/consultar_moroso2/${accountNumber}`);
  }
}
*/


/*

 ------------- PRODUCCION -------------

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MorosoService {

  constructor(private http: HttpClient) { }

  // Método existente para obtener los datos de morosos
  getMorososData(): Observable<any[]> {
    return this.http.get<any[]>('http://172.27.66.165:7003/sic/api/deuda/morosos');
  }

  // Método para obtener registros por número de cuenta
  getByIdCustomerOrAccountNumber(accountNumber: string): Observable<any> {
    return this.http.get<any>(`http://172.27.66.165:7003/sic/api/deuda/consultar_moroso/${accountNumber}`);
  }

  // Método para obtener otros tipos de registros por el mismo número de cuenta
  getByIdCustomerOrAccountNumber2(accountNumber: string): Observable<any> {
    return this.http.get<any>(`http://172.27.66.165:7003/sic/api/deuda/consultar_moroso2/${accountNumber}`);
  }
}

*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MorosoService {

  constructor(private http: HttpClient) { }

  // Método existente para obtener los datos de morosos
  getMorososData(): Observable<any[]> {
    return this.http.get<any[]>('http://180.183.174.156:7004/sic/api/deuda/morosos');
  }

  // Método para obtener registros por número de cuenta
  getByIdCustomerOrAccountNumber(accountNumber: string): Observable<any> {
    return this.http.get<any>(`http://180.183.174.156:7004/sic/api/deuda/consultar_moroso/${accountNumber}`);
  }

  // Método para obtener otros tipos de registros por el mismo número de cuenta
  getByIdCustomerOrAccountNumber2(accountNumber: string): Observable<any> {
    return this.http.get<any>(`http://180.183.174.156:7004/sic/api/deuda/consultar_moroso2/${accountNumber}`);
  }
}
