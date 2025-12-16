import { Injectable } from '@angular/core';
import { HttpHeaders,HttpErrorResponse,HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { json } from 'stream/consumers';
import { IMenu,  menu, IProveedor, proveedor,  IServicio, servicio, IProveedorObjeto } from 'app/models/administrador';
import * as moment from 'moment';
import { Observable, throwError, of } from 'rxjs'; // <-- Agregar 'of' aquí
import { tap } from 'rxjs/operators';

export interface IMenuServicio{
  idmenus: string,
  descripcionmenu: string
}

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
  urlGet : string = '';

  constructor(private http: HttpClient){
      this.urlGet = environment.ApiServicios;
  }

getLogs(): Observable<any> {
  const url = `${this.urlGet}/logs`;  // Quitar '/api/mainframe'
  return this.http.post(url, "");
}

triggerFtpProcess(): Observable<any> {
  const url = `${this.urlGet}/ejecutarFtp`;  // Usar 'ejecutarFtp' en lugar de 'ejecutar-ftp'
  return this.http.post(url, "");
}


 /*-----------------------------------------------------------------MODULO HORARIO-------------------------------------------------------------*/
  obtenerHorario(): Observable<any>{
    var url = this.urlGet + '/consultar-horas-activas';
    console.log('Solicitando horarios activos:', url);

    return this.http.post(url, "").pipe(
      tap(response => {
        console.log('Respuesta de obtenerHorario:', response);
      }),
      catchError(this.error)
    );
  }

  busquedaHoras(data : any): Observable<any>{
    let url = this.urlGet +'/consultar-configuracion';
    console.log('Solicitando configuración de horas:', url, 'con datos:', data);

    return this.http.post(url, data).pipe(
      tap(response => {
        console.log('Respuesta de busquedaHoras:', response);
      }),
      catchError(this.error)
    );
  }

 crearHora(data: any):Observable<any>{
  let url = this.urlGet +'/guardar-hora-configuracion';
  console.log("Crear hora::: ", url, "respuesta server", data)
  return this.http.post(url, data).pipe(catchError(this.error));
}

consultarHoraDetalle(data:any):Observable<any>{
  var url = this.urlGet + '/hora-detalle';
  console.log("Datos de la Hora:::",{idhora:data});
  return this.http.post(url, {idhora:data}).pipe(catchError(this.error));
}


consultarDetalleEstado(data:any):Observable<any>{
  var url = this.urlGet + '/lote-detalle';
  console.log("Datos de lote estado:::",{idlote:data});
  return this.http.post(url, {idlote:data}).pipe(catchError(this.error));
}

consultarDetalleEstado2(data:any):Observable<any>{
  var url = this.urlGet + '/lote-monto-recuperado';
  console.log("Datos de lote estado:::",{idlote:data});
  return this.http.post(url, {idlote:data}).pipe(catchError(this.error));
}
consultarDetalleEstado3(data:any):Observable<any>{
  var url = this.urlGet + '/lote-monto-no-recuperado';
  console.log("Datos de lote estado:::",{idlote:data});
  return this.http.post(url, {idlote:data}).pipe(catchError(this.error));
}


modificarHora(data: any, idhora: any):Observable<any>{
   var envio = {
    "idhora" : idhora,
     "horainicio" : data.horainicio,
   }
   console.log("Modificada Datos de la Hora:::",envio);
   let url = this.urlGet +'/modificar-hora-ejecucion';
   return this.http.post(url, envio).pipe(catchError(this.error));
 }

 ModificarLote(data: any, idlote: any):Observable<any>{
  var envio = {
   "idlote" : idlote,
    "fechaInicio": data.fechaInicio,
    "fechaFin":data.fechaFin,
    "unidad":data.unidad
  }
  console.log("Modificada Datos de la Hora:::",envio);
  let url = this.urlGet +'/modificar-datos-lote';
  return this.http.post(url, envio).pipe(catchError(this.error));
}

 modificarEstadoHora(data: any, idConfiguracion : any, usuario:any):Observable<any>{
  var envio = {
    "estado" : data,
    "usuario":usuario,
    "idConfiguracion" : idConfiguracion
  }
  console.log("Modificada Estado de la Hora:::",envio);
  let url = this.urlGet +'/cambio-estado-configuracion';
  return this.http.post(url, envio).pipe(catchError(this.error));
 }

 AuditoriaEstadoHora(data: any, idhora: any):Observable<any>{
  var envio = {
    "nombreoperador" : data,
    "tipooperador" : "ADMINISTRADOR",
    "idhora" : idhora,

  }
  let url = this.urlGet +'/consultar-hora-ejecucion';
  return this.http.post(url, envio).pipe(catchError(this.error));
}
 /*------------------------------------------------------------------MODULO LOTE-------------------------------------------------------------*/

 crearLote(data: any):Observable<any>{
  let formParams = new FormData();
  let url = this.urlGet +'/guardar-datos-lote';
  console.log("Crear Lote::: ", data)
  return this.http.post(url, data).pipe(catchError(this.error));
}

// Modificar ModificarELote para usar codigo de usuario
ModificarELote(data: any, idlote: any, codigoUsuario: string): Observable<any>{
  const envio = {
    idlote: idlote,
    numero: data.numero,
    usuario: codigoUsuario // Cambiado a 'usuario' y usando código
  };

  console.log("Modificar estado lote:", envio);
  return this.http.post(`${this.urlGet}/modificar-estados-lote`, envio);
}

ModificarELoteReprocesado(data: any, idlote: any, codigoUsuario: string): Observable<any> {
  const envio = {
    idlote: idlote,
    numero: data.numero,
    usuario: codigoUsuario // Cambiado a 'usuario' y usando código
  };

  console.log("Datos enviados al backend:", envio);

  return this.http.post(`${this.urlGet}/modificar-estados-lote-reprocesado`, envio);
}

// Método para extraer solo los números de la cédula
private extraerNumerosCedula(cedula: string): number {
  // Si la cédula es "CT25174", extraer "25174"
  const soloNumeros = cedula.replace(/\D/g, '');
  return Number(soloNumeros);
}

EliminarLote(idlote: string, codigoUsuario: string): Observable<any> {
  const payload = {
    idlote: idlote,
    usuario: codigoUsuario // Usar codigo en lugar de cedula
  };

  return this.http.post<any>(`${this.urlGet}/eliminar-lote`, payload);
}

cargarLote(archivos: any, nombrearchivo:any ,data: any):Observable<any>{
  let url = this.urlGet +'/leerArchivo-Gion'
  var envio:any = {
    idlote:data,
    file:archivos,
    nombrearchivo:nombrearchivo
  }
  console.log("Contenido del archivo en Base64:", archivos);
  console.log("estamos enviando al backend el siguiente json ",envio)
  return this.http.post(url,envio).pipe(catchError(this.error));
}

ConsultaLoteSegui(data: any):Observable<any>{
  var envio = {
   "idlote" : data,
  }
  console.log("preguntar segui de lote:::",envio);
  let url = this.urlGet +'/consultar-seguimiento';
  return this.http.post(url, envio).pipe(catchError(this.error));
}
consultarFechaLoteAvanzado(data: any): Observable<any> {
  let url = this.urlGet +'/consultar-rango-fecha-lote';
 console.log("Busqueda por fecha",data)
  return this.http.post(url, data).pipe(catchError(this.error));;
}
consultarTransacciones(): Observable<any>{
  let url = this.urlGet +'/consultar-transacciones-lista';
  return this.http.post(url, "").pipe(catchError(this.error));
}
consultarLotes(): Observable<any>{
  let url = this.urlGet +'/consultar-lote-lista';
  return this.http.post(url, "").pipe(catchError(this.error));
}
consultarLotesAprobacion(): Observable<any>{
  let url = this.urlGet +'/consultar-lote-aprobacion';
  return this.http.post(url, "").pipe(catchError(this.error));
}
obtenerUnidades(): Observable<any>{
  let url = this.urlGet +'/consultar-unidades';
  return this.http.post(url, "").pipe(catchError(this.error));
}
consultarLoteDetalle(data:any):Observable<any>{
  var url = this.urlGet + '/lote-detalle';
  console.log("Datos del lote:::",{idlote:data});
  return this.http.post(url, {idlote:data}).pipe(catchError(this.error));
}


consultarFechaTransacciones(data: any): Observable<any> {
  const url = this.urlGet + '/consultar-rango-fecha-transacciones';
  return this.http.post<any>(url, data).pipe(
    catchError(error => {
      console.error('Error en consulta de transacciones:', error);
      return of({
        code: 9999,
        message: 'Error al obtener transacciones',
        data: null
      });
    })
  );
}

 /*------------------------------------------------------------------MODIFICAR ESTADOS-------------------------------------------------------------*/

modificarEProveedor(data: any, idProveedor : any):Observable<any>{
  var envio = {
    "estatus" : data,
    "idregistro" : idProveedor
  }
  let url = this.urlGet +'/modificar-estatus-proveedores';
  return this.http.post(url, envio).pipe(catchError(this.error));
}

  modificarESerivcio(data: any, idServicio : any):Observable<any>{
    var envio = {
      "estatus" : data,
      "idregistro" : idServicio
    }
    let url = this.urlGet +'/modificar-estatus-servicio';
    return this.http.post(url, envio).pipe(catchError(this.error));
  }
  modificarVServicio(data: any):Observable<any>{
    var envio = {
      "valor" : data,
      "id" : "1"
    }
    let url = this.urlGet +'/modificar-estatus-cena';
    return this.http.post(url, envio).pipe(catchError(this.error));
  }

Aprobar(idlote: string, usuario: string): Observable<any> {
  const payload = {
    idlote: idlote,
    usuario: usuario // Enviar el nombre de usuario
  };

    return this.http.post<any>(`${this.urlGet}/aprobacion-lote`, payload);
}
/*----------------------------------------------------------CERRAR ITEMS DE GESTIONES----------------------------------------------------------------*/
cerrarServicio(): Observable<any>{
  var url = this.urlGet + '/terminar-servicio' ;
  return this.http.post(url,"");
}
cerrarProveedor(idProve : any):Observable<any>{
  var envio = {
    "idp" : idProve
  }
  let url = this.urlGet +'/guardar-fechafin-proveedor';
  return this.http.post(url, envio).pipe(catchError(this.error));
}
cerrarSComedor(idServ : any):Observable<any>{
  var envio = {
    "idp" : idServ
  }
  let url = this.urlGet +'/guardar-fechafin-servicio';
  return this.http.post(url, envio).pipe(catchError(this.error));
}

busquedaOficinas(): Observable<any>{
 // console.log(data,"consolaaa")
  let url = this.urlGet +'/consultar-oficinas';
  return this.http.post(url,"").pipe(catchError(this.error));
}
/*-----------------------------------------BUSQUEDAS DE HERRAMIENTAS ADMINISTRADOR------------------------------------------------------------------*/
      busquedaMenues(data : any): Observable<any>{
        let url = this.urlGet +'/consultar-menu';
        return this.http.post(url, data).pipe(catchError(this.error));
    }
    busquedaTservicios(data : any): Observable<any>{
      let url = this.urlGet +'/consultar-tipo-servicio';
      return this.http.post(url, data).pipe(catchError(this.error));
  }

  busquedaTserviciosUnique(data : any): Observable<any>{
    let url = this.urlGet +'/consultar-tipo-servicio';
    return this.http.post(url, data).pipe(catchError(this.error));
}

      busquedaProveedores(data : any): Observable<any>{
      let url = this.urlGet +'/consultar-proveedores';
      return this.http.post(url, data).pipe(catchError(this.error));
    }
      busquedaServicio(data : any): Observable<any>{
        let url = this.urlGet +'/consultar-servicio';
        return this.http.post(url, data).pipe(catchError(this.error));
      }
      obtenerMenues(): Observable<any>{
        var url = this.urlGet + '/consultar-menu';
        return this.http.post(url,"");
    }


      obtenerProveedores(): Observable<any>{
        var url = this.urlGet + '/consultar-proveedores';
        return this.http.post(url,"");
    }
/*-----------------------------------------OBTENER DATOS ESPECIFICOS------------------------------------------------------------------*/
    obtenerProveedoresActivo(): Observable<any>{
      var url = this.urlGet + '/consulta-estado-proveedor';
      return this.http.post(url,"");
    }
    obtenerMenuesActivo(): Observable<any>{
      var url = this.urlGet + '/consulta-estado-menu';
      return this.http.post(url,"");
    }
    obtenerTiposActivo(): Observable<any>{
      var url = this.urlGet + '/consultar-tipo';
      return this.http.post(url,"");
    }
/*-----------------------------------------VALIDACIONES------------------------------------------------------------------*/
  obtenerMenuActivo(xvalor : string): Observable<any>{
    var url = this.urlGet + '/consulta-estado-menu';
    return this.http.post(url,"");
}
    obtenerProveActivo(xvalor : string): Observable<any>{
      var url = this.urlGet + '/consulta-estado-proveedor';
      return this.http.post(url,"");
}

obtenerServEspecialActivo(): Observable<any>{

  var url = this.urlGet + '/consultar-estatus-cena' ;
  return this.http.post(url,"");
}
/*----------------------------------------------------------------------------------------------------------------------*/


      obtenerServicioActivo(xvalor : string): Observable<any>{
        var url = this.urlGet + '/consulta-estado-servicio';
       // var ids = { idservicio : xvalor };
        return this.http.post(url,"");
    }

          obtenerServActivo(): Observable<any>{
            var url = this.urlGet + '/consulta-estado-servicios-activos' ;
            return this.http.post(url,"");
        }


        obtenerRegistrosEmpleados(): Observable<any>{
          var url = this.urlGet + '/consultar-cantidad-platos-empleado' ;
          return this.http.post(url,"");
      }
      obtenerRegistrosInvitados(): Observable<any>{
        var url = this.urlGet + '/consultar-cantidad-platos-invitado' ;
        return this.http.post(url,"");
      }
      obtenerRegistrosInvitadosEx(): Observable<any>{
        var url = this.urlGet + '/consultar-cantidad-invitado' ;
        return this.http.post(url,"");
      }

      obtenerRegistrosTotales(): Observable<any>{
        var url = this.urlGet + '/consultar-cantidad-suma' ;
        return this.http.post(url,"");
    }

    MenuRegistrado(xvalor : string):Observable<any>{
      let url = this.urlGet +'/validar-menu';
      var ci = { descripcion : xvalor };
      return this.http.post(url, ci);
    }


/*----------------------------------------------------------EDITAR MENU------------------------------------------------------------------*/
     consultarMenuDetalle(idmenus: string):Observable<any>{
        var url = this.urlGet + '/menu-detalle';
        var p ={
          "idmenus" :idmenus
        }
        return this.http.post(url, p).pipe(catchError(this.error));
    }
/*-----------------------------------------EDITAR PROVEEDOR------------------------------------------------------------------*/
    consultarProveedorDetalle(idproveedor: string):Observable<any>{
      var url = this.urlGet + '/proveedor-detalle';
      var p ={
        "idproveedor" :idproveedor
      }
      return this.http.post(url, p).pipe(catchError(this.error));
  }

  consultarInvitadosDetalle(idf: string):Observable<any>{
    var url = this.urlGet + '/invitado-detalle';
    var p ={
      "idf" :idf
    }
    return this.http.post(url, p).pipe(catchError(this.error));
}
/*-----------------------------------------EDITAR SERVICIO------------------------------------------------------------------*/
  consultarServicioDetalle(idservicio: string):Observable<any>{
    var url = this.urlGet + '/servicio-detalle';
    var p ={
      "idservicio" :idservicio,
    }
    return this.http.post(url, p).pipe(catchError(this.error));
}

consultarMenues(): Observable<any>{
  let url = this.urlGet +'/consultar-menu';
  return this.http.post(url, "").pipe(catchError(this.error));
}

/*-----------------------------------------CREAR HERRAMIENTAS ADMINISTRADOR------------------------------------------------------------------*/
       crearMenu (data: any): Observable<any>{
          let url = this.urlGet +'/guardar-menu';
          return this.http.post(url, data).pipe(catchError(this.error));
      }
      crearServicio(data: any): Observable<any> {
        var envio = {
          "servicio" : data.tiposervicio,
          "nombres" : data.nombres,
          "tipooperador" : data.tipooperador,
          "idproveedores": data.idproveedores,
          "idmenus": data.idmenus
        }
       // console.log(envio,"consolaaa")
        let url = this.urlGet +'/guardar-servicio';
        return this.http.post(url, envio).pipe(catchError(this.error));

      }
      crearTipoServicio(data: any): Observable<any>{
        var envio = {
          "tiposervicio" : data.tiposervicio,
          "nombreoperador" : data.nombres,
          "tipooperador" : data.tipooperador,
          "descripcion" : data.descripcion,
        }
        let url = this.urlGet +'/guardar-tipo-servicio';
        return this.http.post(url, envio).pipe(catchError(this.error));
      }
       crearProveedor(data: any): Observable<any> {
         let url = this.urlGet +'/guardar-proveedor';
         return this.http.post(url, data).pipe(catchError(this.error));
      }
/*-----------------------------------------MODIFICAR DATOS ADMINISTRADOR------------------------------------------------------------------*/
        modificarMenu(data: any, idMenu : any):Observable<any>{
         // console.log(data + " enviar modificar")
         // console.log(data.descripcionmenu)
         // console.log(data.idmenus)
         // console.log(idMenu + " idMenu")
          var envio = {
            "estado" : data.estado,
            "descripcionmenu" : data.descripcionmenu,
            "idmenus" : idMenu
          }
          //console.log("le estamos enviando a lamodificacion menuesto:::: |")
          //console.log(envio);
          let url = this.urlGet +'/modificar-menus';
          return this.http.post(url, envio).pipe(catchError(this.error));
        }

        modificarProveedor(data: any, idProveedor : any):Observable<any>{
          var envio = {
            "nombrepro" : data.nombrepro,
            "descripcionpro" : data.descripcionpro,
            "telefono" : data.telefono,
            "correo": data.correo,
            "estado": data.estado,
            "idproveedor" : idProveedor
          }
          let url = this.urlGet +'/modificar-proveedores';
          return this.http.post(url, envio).pipe(catchError(this.error));
        }

        modificarInvitados(data: any, idfP : any):Observable<any>{
         // console.log("estamos actualizando al señor1",data)
         // console.log("estamos actualizando al señor2",idfP)
          var envio = {
            "fechaf" : data.fechaf,
            "fechai" : data.fechai,
            "observacion":data.observacion,
            "idf" : idfP
          }
          let url = this.urlGet +'/modificar-fechas-invitados';
          return this.http.post(url, envio).pipe(catchError(this.error));
        }

        modificarServicio(data: any, idServicio : any):Observable<any>{
          var envio = {
            "idservicio": idServicio,
            "servicio": data.tiposervicio,
            "idproveedores": data.idproveedores,
            "estado": data.estado,
            "idmenus": data.idmenus
          }
          let url = this.urlGet +'/modificar-servicio';
          return this.http.post(url, envio).pipe(catchError(this.error));
        }
/*--------------------------------------------------- GUARDAR AUDITORIA------------------------------------------------------------------*/
/*----------------------MODIFICACION Y ESTADO MENU----------------------------------*/
AuditoriaMenu(data: any, idMenus : any):Observable<any>{
  var envio = {
    "nombreoperador" : data.nombres,
    "tipooperador" : data.tipooperador,
    "idauditoria" : idMenus,
  }
  let url = this.urlGet +'/guardar-auditoria_menu';
  return this.http.post(url, envio).pipe(catchError(this.error));
}
AuditoriaMenuE(data: any):Observable<any>{
  var envio = {
    "nombreoperador" : data,
    "tipooperador" : "ADMINISTRADOR",
  }
  let url = this.urlGet +'/guardar-auditoria_estado_m';
  return this.http.post(url, envio).pipe(catchError(this.error));
}
/*----------------------MODIFICACION Y ESTADO PROVEEDOR----------------------------------*/
AuditoriaProveedor(data: any, idProves : any):Observable<any>{
  var envio = {
    "nombreoperador" : data.nombres,
    "tipooperador" : data.tipooperador,
    "idauditoria" : idProves,
  }
  let url = this.urlGet +'/guardar-auditoria_proveedor';
  return this.http.post(url, envio).pipe(catchError(this.error));
}
AuditoriaProveedorE(data: any):Observable<any>{
  var envio = {
    "nombreoperador" : data,
    "tipooperador" : "ADMINISTRADOR",
  }
  let url = this.urlGet +'/guardar-auditoria_estado_p';
  return this.http.post(url, envio).pipe(catchError(this.error));
}

AuditoriaCProveedor(data: any):Observable<any>{
  var envio = {
    "nombreoperador" : data,
    "tipooperador" : "ADMINISTRADOR",
  }
  let url = this.urlGet +'/guardar-auditoria_proveedor_cerrar';
  return this.http.post(url, envio).pipe(catchError(this.error));
}

/*----------------------MODIFICACION Y ESTADO SERVICIO----------------------------------*/
AuditoriaServicio (data: any, idServ : any):Observable<any>{
  var envio = {
    "nombreoperador" : data.nombres,
    "tipooperador" : data.tipooperador,
    "idauditoria" : idServ,
  }
  let url = this.urlGet +'/guardar-auditoria_servicio';
  return this.http.post(url, envio).pipe(catchError(this.error));
}
AuditoriaServicioE(data: any):Observable<any>{
  var envio = {
    "nombreoperador" : data,
    "tipooperador" : "ADMINISTRADOR",
  }
  let url = this.urlGet +'/guardar-auditoria_estado_s';
  return this.http.post(url, envio).pipe(catchError(this.error));
}
AuditoriaCServicio(data: any):Observable<any>{
  var envio = {
    "nombreoperador" : data,
    "tipooperador" : "ADMINISTRADOR",
  }
  let url = this.urlGet +'/guardar-auditoria_servicio_cerrar';
  return this.http.post(url, envio).pipe(catchError(this.error));
}
/*---------------------------------------**-----------------TIPO DE SERVICIO-----------------------**---------------------------------------------------------*/
/*AuditoriaServicioTE(data: any):Observable<any>{ //AUDITORIA ESTADO
  var envio = {
    "nombreoperador" : data,
    "tipooperador" : "Administrador",
  }
  let url = this.urlGet +'/guardar-auditoria_estado_ts';
  return this.http.post(url, envio).pipe(catchError(this.error));
}*/
modificarETServicio(data: any, idTServicio : any):Observable<any>{ //ESTADO
  var envio = {
    "estatus" : data,
    "idregistro" : idTServicio
  }
  //console.log("le estamos o:::: |")
  //console.log(envio);
  let url = this.urlGet +'/modificar-estatus-tipo-servicio';
  return this.http.post(url, envio).pipe(catchError(this.error));
}

AuditoriaTServicio(data: any, idTServicio : any):Observable<any>{ //AUDITORIA MODIFICACION
  var envio = {
    "nombreoperador" : data.nombres,
    "tipooperador" : data.tipooperador,
    "idauditoria" : idTServicio,
  }
  let url = this.urlGet +'/guardar-auditoria-modificar-tipo-s';
  return this.http.post(url, envio).pipe(catchError(this.error));
}
consultarTServicioDetalle(idtiposervicio: string):Observable<any>{ // DETALLES
  var url = this.urlGet + '/tipo-servicio-detalle';
  var ts ={
    "idtiposervicio" : idtiposervicio
  }
  return this.http.post(url, ts).pipe(catchError(this.error));
}
modificarTServicio(data: any, idTS : any):Observable<any>{
  var envio = {
     "descripcion": data.descripcion,
     "tiposervicio": data.tiposervicio,
     "tipooperador": data.tipooperador,
     "nombres": data.nombres,
     "idtiposervicio" : idTS
  }
 // console.log("le estamos enviando a lamodificacion menuesto:::: |")
 // console.log(envio);
  let url = this.urlGet +'/modificar-servicio-detalle';
  return this.http.post(url, envio).pipe(catchError(this.error));
}

/*-------------------------------------------------------------------**SEDES**---------------------------------------------------------------------*/

crearSedes(data: any): Observable<any>{ // CREAR
  //console.log("lo que lega es", data)
  var crear = {
   // "nombre_sedes": data.nombre_sedes,
    "codigoUnidad" : data.descripcionUnidad.codigoUnidad.slice(2),
    "descripcionUnidad" : data.descripcionUnidad.descripcionUnidad,
  }

let array:any[]=[]
array.push(crear)

//console.log(crear,"esto envia")

    let url = this.urlGet +'/guardar-oficinas';
    return this.http.post(url, array).pipe(catchError(this.error));
  }

  busquedaSedesPermitidas(data : any): Observable<any>{ // CONSULTAR
    let url = this.urlGet +'/consultar-sedes';
    return this.http.post(url, data).pipe(catchError(this.error));
  }

  busquedaSedesPermitidas2(): Observable<any>{ // CONSULTAR
    let url = this.urlGet +'/consulta-estado-sedes';
    return this.http.post(url, url).pipe(catchError(this.error));
  }


  consultarSedesDetalle(id_sedes: string):Observable<any>{ // DETALLES
    var url = this.urlGet + '/tipo-sede-detalle';
    var detalle ={
      "id_sedes" : id_sedes
    }
    return this.http.post(url, detalle).pipe(catchError(this.error));
  }

  modificarSedes(data: any, idsedes : any):Observable<any>{ // MODIFICAR
    var modificar = {
       "nombre_sedes": data.nombre_sedes,
       "descripcion_sede": data.descripcion_sede,
       "tipooperador": data.tipooperador,
       "nombres": data.nombres,
       "id_sedes" : idsedes
    }
    let url = this.urlGet +'/modificar-sede-detalle';
    return this.http.post(url, modificar).pipe(catchError(this.error));
  }
  AuditoriaSedes(data: any, id_sedes : any):Observable<any>{ //AUDITORIA MODIFICACION
    var envio = {
      "nombreoperador" : data.nombres,
      "tipooperador" : data.tipooperador,
      "idauditoria" : id_sedes,
    }
   // console.log(envio, "::::");
    let url = this.urlGet +'/guardar-auditoria_sedes';
    return this.http.post(url, envio).pipe(catchError(this.error));
  }
  AuditoriaSedesEstado(data: any, id_sedes: any):Observable<any>{
    var envio = {
      "nombreoperador" : data,
      "tipooperador" : "ADMINISTRADOR",
      "idauditoria" : id_sedes,
    }
   // console.log(envio, "aquiiii")
    let url = this.urlGet +'/guardar-auditoria_estado_sedes';
    return this.http.post(url, envio).pipe(catchError(this.error));
  }

  modificarSedeEstado(data: any, idsedes: any):Observable<any>{ // ESTADO
    var envio = {
      "estatus" : data,
      "idregistro" : idsedes
    }
   // console.log(envio, ":::::::::::::::::FORM")
    let url = this.urlGet +'/modificar-estatus-sede';
    return this.http.post(url, envio).pipe(catchError(this.error));
  }

  descargarTxt(fechaInicio:any, fechaFin:any){

    var url = this.urlGet +"/descargar-text?fechaInicio="+fechaInicio+"&fechaFinal="+fechaFin;

    const headersSendData= new HttpHeaders()

    .set('content-type','text/plain')



     this.http.get(url,{headers:headersSendData,responseType: 'text'}).subscribe((data)=>{

      let blob = new Blob([data],{type:'.txt'})

      let a = document.createElement("a")

      let url =URL.createObjectURL(blob)

      a.href = url;

      a.download = "Reporte"+ moment(new Date()).format("DD/MM/YYYY")+".txt"

      document.body.appendChild(a)

      a.click();

      setTimeout(() => {

        document.body.removeChild(a)

        window.URL.revokeObjectURL(url)

      }, 0);
     });
  }



/*---------------------------------------- VEFICACION DE ERRORES EN RED------------------------------------------------------------------*/
  error(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
