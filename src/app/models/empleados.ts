export interface IDatosTrabObj{
  cedula : string,
  nombre: string,
  descrDepto: string,
  descrCargo: string,
  tiporegistro: string,
  nombres: string,
  sede: string
}
/*--------------------------------------------------DATOS TRABAJADOR EXTEND---------------------------------------------------------------*/
export interface IDatosTrab {
  cedula : string,
  nombre: string,
  descrDepto: string,
  descrCargo: string,
  sede: string,
}
/*--------------------------------------------------DATOS TRABAJADOR EXTEND---------------------------------------------------------------*/
export interface IDatosTrab{
  cedula : string,
  nombre: string,
  descrDepto: string,
  descrCargo: string,
  sede: string,
}
/*--------------------------------------------------DATOS USUARIO PEOPLE SOFT---------------------------------------------------------------*/
export interface usuario {
  cedula : string,
  nombre: string,
  descrDepto: string,
  descrCargo: string
}
/*--------------------------------------------------DATOS EMPLEADOS BDV--------------------------------------------------------------*/
export interface IEmpleadoServicio{
  cedula : string,
  nombre: string,
  descrDepto: string,
  descrCargo: string,
  idservicio: string,
	numeroticket: string,
  idproveedor: string,
  tiporegistro: string,
  observacion: string,
  nombres:  string,
}

export interface registros{
  nombre: string,
  cedula : string,
  fechaem: string,
  descrDepto: string,
  descrCargo: string,
  idservicio2: string,
  tiporegistro:  string
  nombres:  string,
  tipooperador:  string,
  servicio:  string,
  menu: string,
  nombreproveedor:  string
}

export interface estadisticas{
  idestadistica: string,
  cantidad:string,
  fecha: string,
  servicio: string,
  }

export interface IcomedorActivo{
  cedula : string,
  estado: string,
}

/*--------------------------------------------------DATOS EMPLEADOS BDV--------------------------------------------------------------*/
export interface Invitados {
  cedulainv : string,
  nombreinv: string,
idservicio: string,
fechai: string,
fechaf: string,
tipooperador: string,
nombres: string,
tiporegistro: string,
observacion: string,
}
export interface InviConsulta {
  nombreinv: string,
  cedulainv:string,
  fechai: string,
  descrDepto: string,
  descrCargo: string,
  fechaf: string,
  tipooperador: string,
  nombreoperador:string,
  tiporegistro:string,
  observacion:string,
  nombres:string
}
/*--------------------------------------------GESTION AUDITORIA----------------------------------------------------------*/
export interface auditoria{
  nombreoperador: string,
  tipooperador: string,
  idauditoria: string,
  fechaaccion: string,
  accion: string,
  idregistro: string,
}


