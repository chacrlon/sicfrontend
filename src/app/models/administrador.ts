/*---------------------------------------------USO EN MENU CREAR---------------------------------------------------------*/
export interface IMenu{
  descripcionmenu: string,
	tipooperador: string,
	nombres:string,
	estado: string
}
/*---------------------------------------------USO EN MENU EDITAR---------------------------------------------------------*/
export interface IMenuServicio{
  idmenus: string,
  descripcionmenu: string,
  estado: string,
  tipooperador: string,
  nombres:string
}
export interface ISelectOficina{
  codigoUnidad: string;
  descripcionUnidad: string;
}

/*---------------------------------------------USO EN CONSULTA DE MENU-----------------------------------------------------*/
export interface menu {
  descripcionmenu: string,
  idmenus: string,
  estado: string,
  fecham: string,
  nombres: string,
  tipooperador: string
}
/*---------------------------------------------USO EN MENU ACTIVO---------------------------------------------------------*/
export interface ISelectMenu{
  idmenus: string,
  descripcionmenu: string
}
export interface ISelectTipo{
  tiposervicio: string,
  idtiposervicio: string,
}

export interface IEstadoMenu{
  estado : string
}

/*---------------------------------------------USO EN PROVEEDOR CREAR---------------------------------------------------------*/
export interface IProveedorObjeto{
  nombrepro : string,
  descripcionpro : string,
  telefono: string,
  correo: string,
  estado: string
}
export interface IProveedor{
  nombrepro : string,
  descripcionpro : string,
  telefono: string,
  correo: string,
  estado: string,
  tipooperador: string,
  nombres: string
}
/*---------------------------------------------USO EN PROVEEDOR EDITAR---------------------------------------------------------*/
export interface proveedor {
  nombrepro : string,
  descripcionpro : string,
  idproveedor: string,
  estado: string,
  telefono: string,
  correo: string,
  nombres: string,
  tipooperador: string,
  fechap: string,
  fechaf: string
}
/*---------------------------------------------USO EN PROVEEDOR ACTIVO---------------------------------------------------------*/
export interface ISelectProveedor{
  nombrepro : string,
  idproveedor: string,
}
export interface IEstadoProveedor{
  estado : string
}

/*---------------------------------------------USO EN PROVEEDOR EDITAR---------------------------------------------------------*/
export interface IProveedorServicio{
  idproveedor: string,
  nombrepro : string,
  descripcionpro : string,
  telefono: string,
  correo: string,
  tipooperador:string,
  nombres: string,
  estado: string,
}

/*---------------------------------------------USO EN CREAR SERVICIO--------------------------------------------------------*/
export interface IServicio{
  idservicio: string,
  servicio : string,
  idmenus : string
  idproveedores: string,
  estado: string,
  nombres: string,
  tipooperador: string
}

/*-------------------------------------------USO EN CONSULTAR SERVICIOS----------------------------------------------------*/
export interface servicio{
  idservicio : string,
  servicio: string,
  idproveedores: string,
  estado: string,
  idmenus: string,
  nombres: string,
  tipooperador: string,
  fechas: string,
  fechafins: string
}

export interface IComedorServicio{
  idservicio : string,
  servicio: string,
  idproveedores: string,
  idmenus: string,
}

export interface ISelectServicio{
  idservicio : string
}
export interface tservicios{
  tiposervicio : string,
  tipooperador : string,
  nombreoperador : string,
  descripcion : string,
  estado : string,
}


/*--------------------------------------------------------------------------------------------------------*/

export interface ItipoServicio{
  tiposervicio : string,
  tipooperador : string,
  nombreoperador : string,
  descripcion : string,
}


/*-----------------------------------------------SEDES---------------------------------------------------------*/
export interface SedesConsulta{ // CONSULTA
  id_sedes: string,
  nombre_sedes: string,
  descripcion_sede: string,
  status: string,
  tipooperador: string,
  nombres: string,
  fecha: string,
  codigounidad: string,
}

export interface EditarSedes{
  nombre_sedes: string,
  descripcion_sede: string,
  tipooperador: string,
  nombres: string,
}

/*---------------------------------------------LOTES---------------------------------------------------------*/
export interface  LotesConsulta { // CONSULTA
  idlote: string,
  lote: string,
  estadolote: string,
  fechaInicio: string,
  fechaFin: string,
  unidad: string,
  fechacreacion: string,
  nombrearchivo: string

}
export interface ISelectUnidad{
  unidad: string,
  codigounidad: string
}

/*---------------------------------------------HORARIO LOTE--------------------------------------------------------*/
export interface  HorarioConsulta { // CONSULTA
  horainicio: string,
  horafin: string,
  estado: string,
}
/*---------------------------------------------APROBACION--------------------------------------------------------*/
export interface  LotesConsultaAprobacion { // CONSULTA
  idlote: string,
  estadolote: string,
  fechaInicio: string,
  fechaFin: string,
  unidad: string,
  fechacreacion: string,
}
/*---------------------------------------------REGISTROS TRANSACCIONES-------------------------------------------------------*/
export interface  TransaccionesConsulta { // CONSULTA
  numeroCuenta: string
  vef: string
  montoTransaccion: string
  tipoMovimiento: string
  serialOperacion: string
  referencia: string
  codigoOperacion: string
  referencia2: string
  tipoDocumento: string
  numeroCedula: string
  id_lote: string
  id_lotefk: string
  fechacarga: string
  estado: string
  montorecuperado: string
}
export interface  Loteseguimiento { // CONSULTA
  idLoteGiom: string,
  idGiomSeguimiento: string,
  descripcion: string,
  fechaCreacion: string,
}
