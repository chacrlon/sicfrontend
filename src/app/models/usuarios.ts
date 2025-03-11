/*----------------------------------------------------------CODIGO VIEJO-------------------------------------------------------*/
export interface IUsuarioObj{
    cn: string,
    estado: string,
    cedula: string,
    apellidos: string,
    nombres: string,
    grupoPago: string,
    idCargo: string,
    idDepartamento: string,
    sede: string,
    email: string,
    nivelCargo: string,
    idEmpresa: string,
    descEmpresa: string,
    fechaActivacion: string,
    fechaIngreso: string,
    fechaCreacion: string,
    fechaEgreso: string,
    descDepartamentto: string,
    descCargo: string,
    nombreSupervisor: string,
    apellidoSupervisor: string,
    dnSupervisor: string,
    emailSupervisor: string,
    nacionalidad: string,
    idioma: string,
    tlfHab: string,
    tlfCel: string,
    tlfOf: string,
    direccionHab: string,
    direccionEmp: string,
    codUnidadSup: string,
    descUnidadSup: string,
    fax: string,
    fechaNacimineto : string,
    clave : string,
    login : string,
    flagFecha : boolean
}

export interface usuario {
    cn: string;
    cedula: string;
    nombre : string,
    apellido: string;
    email: string;
    unidad: string;
    status : string;
    desc_DEPARTAMENTO :string;
  }

  export interface IUsuario  {
    codUsuario: string,
    nombre : string,
    Apellido : string,
    cedula : string,
    correo : string,
    dpto : string,
    cargo : string,
    codSupervisor : string
  };

  export interface IUsuario  {
    codUsuario: string,
    nombre : string,
    Apellido : string,
    cedula : string,
    correo : string,
    dpto : string,
    cargo : string,
    codSupervisor :string
  };

  export interface IUsuarioServico{
    CN: string,
    CEDULA: string,
    STATUS: string,
    GRUPOPAGO: string,
    NOMBRE: string,
    APELLIDO: string,
    IDCARGO: string,
    IDDEPARTAMENTO: string,
    FACTIVACION: string,
    FINGRESO: string,
    FCREACION: string,
    SEDE: string,
    EMAIL: string,
    IDEMPRESA: string,
    DESC_EMPRESA: string,
    NIVEL: string,
    DESC_DEPARTAMENTO: string,
    FEGRESO: string,
    DESC_CARGO: string,
    NOMBRE_SUPERVISOR: string,
    APELLIDO_SUPERVISOR: string,
    DN_SUPERVISOR: string,
    EMAIL_SUPERVISOR: string,
  }

  export interface loginUsuario {
    codUsuario : string,
    clave : string
  }

  /* borrar extras y editar conexiones*/
