export class Auditoria {
  descripcion: string;
  tipoAccion: string; // Puede ser "INSERT", "UPDATE", "DELETE"
  usuarioAccion: string;
  fechaRegistro: Date;

  constructor(descripcion: string, tipoAccion: string, usuarioAccion: string) {
      this.descripcion = descripcion;
      this.tipoAccion = tipoAccion;
      this.usuarioAccion = usuarioAccion;
      this.fechaRegistro = new Date(); // Establecer fecha automáticamente
  }
}
