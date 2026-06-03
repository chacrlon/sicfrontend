import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Configuracion, ResponseModel } from '../../models/configuracion.model';
import { CobradoresServices } from '../cobradores/cobradores.services';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SessionService } from '../servicios/session.service';
import { Auditoria } from '../cobradores/auditoria.model';

@Component({
  selector: 'app-add-configuracion',
  templateUrl: './add-configuracion.component.html',
  styleUrls: ['./add-configuracion.component.scss']
})
export class AddConfiguracionComponent implements OnInit {
  codUsuario: string | null = null;
  configForm: FormGroup;
  configuracion: Configuracion = {
    modulo: 'EXC',
    descValor: 'codigo_operacion', // valor por defecto, se sobreescribirá con data.descValor
    valor: '',
    tipoValor: 'numerico',
    longitud: 4
  };
  isSaving = false;
  errorMessage = '';

  get longitud(): number {
    return this.configuracion.longitud || 0;
  }

  get valor(): string {
    return this.configuracion.valor || '';
  }

  constructor(
    private cobradoresServices: CobradoresServices,
    private dialogRef: MatDialogRef<AddConfiguracionComponent>,
    private fb: FormBuilder,
    private sessionService: SessionService,
    @Inject(MAT_DIALOG_DATA) public data: { descValor: string }
  ) {
    this.configForm = this.fb.group({
      valor: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.sessionService.codUsuario$.subscribe(cod => {
        this.codUsuario = cod;
    });
    // Asigna descValor y longitud dinámica
    this.configuracion.descValor = this.data.descValor;
    if (this.data.descValor === 'codigo_operacion') {
    this.configuracion.longitud = 4;
} else if (this.data.descValor === 'cuenta_piloto1') {
    this.configuracion.longitud = 20;
}
    // También puedes mantener otros valores por defecto (modulo, tipoValor)
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
    this.cobradoresServices.create(this.configuracion).subscribe({
      next: (res: ResponseModel) => {
        this.isSaving = false;
        if (res.code === 1000) {
          this.registrarAuditoria(
            `Inserción de ${this.configuracion.descValor} con valor ${this.configuracion.valor}`,
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
