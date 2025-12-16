export class Auditoria {
  descripcion: string;
  tipoAccion: string;
  usuarioAccion: string;

  constructor(descripcion: string, tipoAccion: string, usuarioAccion: string) {
      this.descripcion = descripcion;
      this.tipoAccion = tipoAccion;
      this.usuarioAccion = usuarioAccion;
  }
}
