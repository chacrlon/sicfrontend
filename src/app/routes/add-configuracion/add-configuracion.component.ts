import { Component, OnInit } from '@angular/core';
import { Configuracion, ResponseModel } from '../../models/configuracion.model';
import { CobradoresServices } from '../cobradores/cobradores.services';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SessionService } from '../servicios/session.service';
import { Auditoria } from '../cobradores/auditoria.model'; // Ajusta la ruta

@Component({
  selector: 'app-add-configuracion',
  templateUrl: './add-configuracion.component.html',
  styleUrls: ['./add-configuracion.component.scss']
})
export class AddConfiguracionComponent implements OnInit {
  codUsuario: string | null = null;
  configForm: FormGroup;
  configuracion: Configuracion = {
    modulo: 'EXC', // Valor por defecto hardcodeado
    descValor: 'codigo_operacion', // Valor por defecto hardcodeado
    valor: '',
    tipoValor: 'numerico', // Valor por defecto hardcodeado
    longitud: 4 // Valor por defecto hardcodeado
  };
  isSaving = false;
  errorMessage = '';
  configuracionesDisponibles: Configuracion[] = [];
  selectedConfig: Configuracion | null = null;

    // Getter seguro para longitud
  get longitud(): number {
    return this.configuracion.longitud || 0;
  }

  // Getter seguro para valor
  get valor(): string {
    return this.configuracion.valor || '';
  }

  constructor(
    private cobradoresServices: CobradoresServices,
    private dialogRef: MatDialogRef<AddConfiguracionComponent>,
    private fb: FormBuilder,
    private sessionService: SessionService
  ) {
    this.configForm = this.fb.group({
      selectedConfig: ['', Validators.required],
      valor: ['', Validators.required]
    });
  }

  ngOnInit(): void {
      this.sessionService.codUsuario$.subscribe(cod => {
      this.codUsuario = cod;
    });
    this.loadAvailableConfigurations();
  }

  loadAvailableConfigurations(): void {
    this.cobradoresServices.getAll().subscribe({
      next: (res: ResponseModel) => {
        if (res.code === 1000) {
          this.configuracionesDisponibles = res.data;
        }
      },
      error: (e) => {
        console.error('Error al cargar configuraciones disponibles:', e);
      }
    });
  }

  onConfigSelect(event: any): void {
    const configId = event.value;
    this.selectedConfig = this.configuracionesDisponibles.find(c => c.id === configId) || null;

    if (this.selectedConfig) {
      this.configuracion = { ...this.selectedConfig };
      this.configForm.patchValue({ valor: this.selectedConfig.valor });
    }
  }


saveConfiguracion(): void {
    this.errorMessage = '';

    if (!this.configuracion.valor || this.configuracion.valor.trim() === '') {
        this.errorMessage = 'El valor es requerido.';
        return;
    }

    if (this.longitud > 0 && this.valor.length > this.longitud) {
        this.errorMessage = `El valor excede la longitud permitida (${this.longitud} caracteres)`;
        return;
    }

    this.isSaving = true;
    this.cobradoresServices.create(this.configuracion)
        .subscribe({
            next: (res: ResponseModel) => {
                this.isSaving = false;
                if (res.code === 1000) {
                    // Mejorar el mensaje de auditoría para inserción
                    this.registrarAuditoria(
                        `Inserción del ${this.configuracion.descValor} ${this.configuracion.valor}`,
                        'INSERT'
                    );
                    this.dialogRef.close('success');
                } else {
                    this.errorMessage = res.message || 'Error desconocido al crear configuración';
                }
            },
            error: (e) => {
                this.isSaving = false;
                this.errorMessage = 'Error al crear configuración: ' + (e.error?.message || e.message || 'Error desconocido');
            }
        });
}

  cancel(): void {
    this.dialogRef.close();
  }

    registrarAuditoria(descripcion: string, tipoAccion: string) {
    const usuario = this.codUsuario ?? '';
    const auditoria = new Auditoria(descripcion, tipoAccion, usuario);
    this.cobradoresServices.registrarAuditoria(auditoria).subscribe();
  }

}
