// configuracion-details.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { Configuracion, ResponseModel } from '../../models/configuracion.model';
import { CobradoresServices } from '../cobradores/cobradores.services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { SessionService } from '../servicios/session.service';
import { Auditoria } from '../cobradores/auditoria.model';

@Component({
  selector: 'app-configuracion-details',
  templateUrl: './configuracion-details.component.html',
  styleUrls: ['./configuracion-details.component.scss']
})
export class ConfiguracionDetailsComponent implements OnInit {
  codUsuario: string | null = null;
  originalConfiguracion: Configuracion | null = null;
  currentConfiguracion: Configuracion = {
    id: 0,
    modulo: '',
    descValor: '',
    valor: '',
    tipoValor: '',
    longitud: 0
  };
  message = '';
  isSaving = false;
  isDeleting = false;
  onDelete = new EventEmitter<number>();

  constructor(
    private cobradoresServices: CobradoresServices,
    private dialogRef: MatDialogRef<ConfiguracionDetailsComponent>,
    private sessionService: SessionService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) { }

  ngOnInit(): void {
    this.sessionService.codUsuario$.subscribe(cod => {
      this.codUsuario = cod;
    });
    this.getConfiguracion(this.data.id);
  }

  getConfiguracion(id: number): void {
    this.cobradoresServices.getAll().subscribe({
      next: (res: ResponseModel) => {
        if (res.code === 1000) {
          const config = res.data.find((c: Configuracion) => c.id === id);
          if (config) {
            this.currentConfiguracion = { ...config };
            // Guardar una copia del original para comparar después
            this.originalConfiguracion = { ...config };
          } else {
            this.message = 'Configuración no encontrada';
          }
        } else {
          this.message = 'Error al cargar configuración: ' + res.message;
        }
      },
      error: (e: HttpErrorResponse) => {
        this.message = 'Error al cargar configuración';
        console.error(e);
      }
    });
  }

  updateConfiguracion(): void {
    this.message = '';
    this.isSaving = true;

    this.cobradoresServices.update(this.currentConfiguracion.id!, this.currentConfiguracion)
      .subscribe({
        next: (res: ResponseModel) => {
          this.isSaving = false;
          if (res.code === 1000) {
            this.message = '¡Configuración actualizada con éxito!';

            // Registrar auditoría comparando cambios
            const descripcion = this.generarDescripcionAuditoria();
            this.registrarAuditoria(descripcion, 'UPDATE');

            setTimeout(() => {
              this.dialogRef.close('updated');
            }, 1500);
          } else {
            this.message = `Error: ${res.message}`;
          }
        },
        error: (e: HttpErrorResponse) => {
          this.isSaving = false;
          this.message = 'Error al actualizar configuración';
          console.error(e);
        }
      });
  }

deleteConfiguracion(): void {
    if (confirm('¿Está seguro que desea eliminar esta configuración?')) {
        this.isDeleting = true;
        this.cobradoresServices.delete(this.currentConfiguracion.id!)
            .subscribe({
                next: (res: ResponseModel) => {
                    this.isDeleting = false;
                    if (res.code === 1000) {
                        this.message = 'Configuración eliminada exitosamente';

                        // Modificar el mensaje de auditoría para eliminación
                        this.registrarAuditoria(
                            `Eliminación del ${this.currentConfiguracion.descValor} ${this.currentConfiguracion.valor}`,
                            'DELETE'
                        );

                        this.onDelete.emit(this.currentConfiguracion.id!);

                        setTimeout(() => {
                            this.dialogRef.close('deleted');
                        }, 1500);
                    } else {
                        this.message = `Error al eliminar: ${res.message}`;
                    }
                },
                error: (e: HttpErrorResponse) => {
                    this.isDeleting = false;
                    console.error('Error en la solicitud:', e);
                    this.message = 'Error al intentar eliminar la configuración';
                }
            });
    }
}

  closeDialog(): void {
    this.dialogRef.close();
  }

private generarDescripcionAuditoria(): string {
    if (!this.originalConfiguracion) {
        return `Actualización del valor del ${this.currentConfiguracion.descValor} a ${this.currentConfiguracion.valor}`;
    }

    const valorOriginal = this.originalConfiguracion.valor;
    const valorActual = this.currentConfiguracion.valor;

    if (valorOriginal !== valorActual) {
        return `Actualización del valor del ${this.currentConfiguracion.descValor} de ${valorOriginal} -> ${valorActual}`;
    }

    return `Actualización de configuración: ${this.currentConfiguracion.descValor} (sin cambios en el valor)`;
}

  registrarAuditoria(descripcion: string, tipoAccion: string) {
    const usuario = this.codUsuario ?? '';
    const auditoria = new Auditoria(descripcion, tipoAccion, usuario);
    this.cobradoresServices.registrarAuditoria(auditoria).subscribe({
      next: () => console.log('Auditoría registrada'),
      error: (e) => console.error('Error al registrar auditoría', e)
    });
  }
}
