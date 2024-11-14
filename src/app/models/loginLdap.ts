import { StringLiteralType } from "typescript";
import { IusuarioLdap } from "./usuarioLdap";

export interface loginLdap{
    status: string,
    mensaje: string,
    usuario : IusuarioLdap
}
