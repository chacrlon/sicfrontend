// src/app/models/configuracion.model.ts
export interface Configuracion {
  id?: number;
  modulo: string;
  descValor: string;
  valor: string;
  tipoValor: string;
  longitud: number;
}

export interface ResponseModel {
  code: number;
  status: number;
  message: string;
  data: any;
}
