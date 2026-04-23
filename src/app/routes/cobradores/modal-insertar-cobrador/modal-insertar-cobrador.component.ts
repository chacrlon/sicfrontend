import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CobradoresServices } from '../cobradores.services';

@Component({
  selector: 'app-modal-insertar-cobrador',
  templateUrl: './modal-insertar-cobrador.component.html',
  styleUrls: ['./modal-insertar-cobrador.component.scss']
})
export class ModalInsertarCobradorComponent {
  cobradorEditado: any;
  showErrorAlert: boolean = false;
  errorAlertMessage: string = "";

  // Opciones para el select
collectionTypeOptions = [
  { value: 1, label: 'Bloqueo por Cuenta' },
  { value: 2, label: 'Bloqueo por Cliente' }
];

  constructor(
    public dialogRef: MatDialogRef<ModalInsertarCobradorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cobradoresServices: CobradoresServices
  ) {
    this.cobradorEditado = {
  ...data,
  collection_type: 1 // Valor por defecto como número
    };
  }

  onClose(): void {
    this.dialogRef.close();
  }

  updateCobrador() {
    // Validar que el ID no sea nulo
    if (!this.cobradorEditado.collector_id || this.cobradorEditado.collector_id <= 0) {
      this.showErrorAlert = true;
      this.errorAlertMessage = "El ID es requerido y debe ser mayor a 0";
      return;
    }

    let startTimeArr = this.cobradorEditado.start_time.split(":");
    let finalTimeArr = this.cobradorEditado.final_time.split(":");

    let validStartTime = parseInt(startTimeArr[0]) < 24 && parseInt(startTimeArr[1]) < 60 && parseInt(startTimeArr[2]) < 60;
    let validFinalTime = parseInt(finalTimeArr[0]) < 24 && parseInt(finalTimeArr[1]) < 60 && parseInt(finalTimeArr[2]) < 60;

    if (validStartTime && validFinalTime) {
      if (this.cobradorEditado.start_time < this.cobradorEditado.final_time) {
        this.showErrorAlert = false;
        this.dialogRef.close(this.cobradorEditado);
      } else {
        this.showErrorAlert = true;
        this.errorAlertMessage = "La hora inicial debe ser menor a la hora final";
      }
    } else {
      this.showErrorAlert = true;
      this.errorAlertMessage = "La hora ingresada no es válida";
    }
  }

  deleteCobrador(collector_id: number): void {
    this.dialogRef.close({ collector_id, delete: true });
  }
}
