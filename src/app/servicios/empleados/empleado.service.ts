import { Injectable } from '@angular/core';
import { HttpHeaders,HttpErrorResponse,HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { json } from 'stream/consumers';
import { IDatosTrabObj } from 'app/models/empleados';

export interface IDatosTrab{
  cedula : string,
  nombre: string,
  descrDepto: string,
  descrCargo: string
}

@Injectable({
  providedIn: 'root'
})

export class EmpleadoService {
  urlGet : string = '';
  urlServ : string = '';

  constructor(private http: HttpClient){
      this.urlGet = environment.peopleUrl;
      this.urlServ = environment.ApiServicios;
  }

  /*utilidad1(xvalor : string){

    let jota:string="1"
    return jota;
  }*/

/*----------------------------------VERIFICACION USUARIO-------------------------------------------------------*/
                consultarDatosTrabajador(xvalor : string):Observable<any>{
                  let url = this.urlGet +'/DatosTrabajador';
                  var ci = { cedula : xvalor };
                  return this.http.post(url, ci);
                }
/*----------------------------------VERIFICACION USUARIO SERVICIO COMEDOR-------------------------------------------------------*/
                 consultarDatosComedor(xvalor : string):Observable<any>{
                  let url = this.urlServ +'/validar-cedula';
                  var ci = { cedula : xvalor };
                  return this.http.post(url, ci);
                }
 /*----------------------------------VERIFICACION INVITADO-------------------------------------------------------*/
                consultarDatosInvitados(xvalor : string):Observable<any>{
                  let url = this.urlServ +'/validar-invitados';
                  var ci = { cedulainv : xvalor };
                  return this.http.post(url, ci);
                }
                InvitadoRegistrado(xvalor : string):Observable<any>{
                  let url = this.urlServ +'/validar-cedulai';
                  var ci = { cedulainv : xvalor };
                  return this.http.post(url, ci);
                }
/*-------------------------------------------CREAR REGISTRO EMPLEADO----------------------------------------*/
                crearEmpleado(data: any): Observable<any> {
                  let url = this.urlServ +'/guardar-empleado';
                  return this.http.post(url, data).pipe(catchError(this.error));;
                }

                crearEmpleadoMasivo(data: any):Observable<any>{


                   let url = this.urlServ +'/guardar-empleado';
                   return this.http.post(url, data).pipe(catchError(this.error));
                 }

      /*          crearInvi(data: any):Observable<any>{

                  console.log(data, "::::::::::invitados tabla guardados");
                   let url = this.urlServ +'/guardar-invitados';
                   return this.http.post(url, data).pipe(catchError(this.error));
                 }  */
/*-------------------------------------------CREAR REGISTRO INVITADO----------------------------------------*/
              crearInvitadoComedor(data: any):Observable<any>{
                var envio = {
                  "cedula": data.cedulainv,
                  "nombre": data.nombreinv,
                  "descrCargo": data.descrCargo,
                  "descrDepto": data.descrDepto,
                  "observacion": data.observacion,
                  "nombres": data.nombres,
                  "tipooperador": data.tipooperador,
                  "idservicio": data.idservicio,
                  "tiporegistro": "INVITADO",
                }
              //  console.log(envio);
                let url = this.urlServ +'/guardar-empleado';
                return this.http.post(url, envio).pipe(catchError(this.error));
              }
/*-------------------------------------------CREAR------------------------------------*/
                crearInvitadoTemporal(data: any): Observable<any> {
                  let url = this.urlServ +'/guardar-invitados';
                  return this.http.post(url, data).pipe(catchError(this.error));;
                }

                crearInvitadoTemporalMasiva(data: any): Observable<any> {
                  let url = this.urlServ +'/guardar-invitados';
                  return this.http.post(url, data).pipe(catchError(this.error));;
                }

/*----------------------------------------CONSULTAR -----------------------------------------*/
                consultarEmpleado(data: any): Observable<any> {
                  let url = this.urlServ +'/consultar-empleado';
                  return this.http.post(url, data).pipe(catchError(this.error));;
                }

                /*----------------------------------------CONSULTAR -----------------------------------------*/
                consultarEstadisticas(data: any): Observable<any> {
                  let url = this.urlServ +'/consultar-estadistica';
                  return this.http.post(url, data).pipe(catchError(this.error));;
                }
                /*----------------------------------------CONSULTAR -----------------------------------------*/
                consultarAuditorias(data: any): Observable<any> {
                  let url = this.urlServ +'/consultar-auditorias';
                  return this.http.post(url, data).pipe(catchError(this.error));;
                }
  /*----------------------------------------CONSULTAR-----------------------------------------*/
              consultarEmpleadoFecha(data: any): Observable<any> {
                let url = this.urlServ +'/consultar-rango-fecha';
            //  console.log(data,"AQUIII")
                return this.http.post(url, data).pipe(catchError(this.error));;
              }
                /*----------------------------------------CONSULTAR-----------------------------------------*/
                consultarEstadisticaFecha(data: any): Observable<any> {
                  let url = this.urlServ +'/consultar-estadistica-total';
                // console.log(data,"AQUIII")
                  return this.http.post(url, data).pipe(catchError(this.error));;
                }
  /*----------------------------------------CONSULTAR-----------------------------------------*/
              consultarEmpleadoFechaMenu(data: any): Observable<any> {
                let url = this.urlServ +'/consultar-rango-menu';
                //console.log(data,"AQUIII")
                return this.http.post(url, data).pipe(catchError(this.error));;
              }
          /*----------------------------------------CONSULTAR-----------------------------------------*/
          consultarEmpleadoFechaTemporal(data: any): Observable<any> {
            let url = this.urlServ +'/consultar-rango-invitados';
            //console.log(data,"AQUIII")
            return this.http.post(url, data).pipe(catchError(this.error));;
          }
   /*----------------------------------------CONSULTAR-----------------------------------------*/
              consultarEmpleadoFechaPro(data: any): Observable<any> {
                let url = this.urlServ +'/consultar-rango-proveedor';
                return this.http.post(url, data).pipe(catchError(this.error));;
              }
    /*----------------------------------------CONSULTAR-----------------------------------------*/
              consultarEmpleadoFechaServ(data: any): Observable<any> {
                let url = this.urlServ +'/consultar-rango-servicio';
                return this.http.post(url, data).pipe(catchError(this.error));;
              }
  /*----------------------------------------CONSULTAR-----------------------------------------*/
              consultarAuditoriaFecha(data: any): Observable<any> {
                let url = this.urlServ +'/consultar-rango-fecha-auditoria';
                return this.http.post(url, data).pipe(catchError(this.error));;
              }
  /*----------------------------------------CONSULTAR REGISTRO EMPLEADO-----------------------------------------*/
              /*  consultarEmpleadoTP(data: any): Observable<any> {
                  let url = this.urlServ +'/consultar-datos-servicio-actual';
                  return this.http.post(url, data).pipe(catchError(this.error));
                }*/

                // consultarEmpleadoActual(data: any): Observable<any> {
                //   let url = this.urlServ +'/consultar-empleado';
                //   return this.http.post(url, data).pipe(catchError(this.error));
                // }
/*----------------------------------------CONSULTAR REGISTRO EMPLEADO TEMPORAL-----------------------------------------*/
                consultarInvitadoTemporal(data: any): Observable<any> {
                  let url = this.urlServ +'/consultar-invitados';
                  return this.http.post(url, data).pipe(catchError(this.error));;
                }

/*----------------------------------------DESCARGAR LOG-----------------------------------------*/
               descargar(){

                var url = this.urlServ +"/descargar-log";

                const headersSendData= new HttpHeaders()

                .set('content-type','text/plain')

                .set('Content-Disposition','attachment:fileName=scbdv-comedor-servicios.log')

                 this.http.get(url,{headers:headersSendData,responseType: 'text'}).subscribe((data)=>{

                  let blob = new Blob([data],{type:'.txt'})

                  let a = document.createElement("a")

                  let url =URL.createObjectURL(blob)

                  a.href = url;

                  a.download = "GIOM.txt"

                  document.body.appendChild(a)

                  a.click();

                  setTimeout(() => {

                    document.body.removeChild(a)

                    window.URL.revokeObjectURL(url)

                  }, 0);
                 });
              }
/*---------------------------------------- VEFICACION DE ERRORES EN RED-------------------------------------------*/
            error(error: HttpErrorResponse) {
              let errorMessage = '';
              if (error.error instanceof ErrorEvent) {
                errorMessage = error.error.message;
              } else {
                errorMessage = `Código de Error: ${error.status}\nMensaje: ${error.message}`;
              }
            //  console.log(errorMessage);
              return throwError(() => {
                return errorMessage;
              });
            }
}
