import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CobradoresServices } from '../cobradores.services';

@Component({
  selector: 'app-modal-cobradores-component',
  templateUrl: './modal-cobradores-component.component.html',
  styleUrls: ['./modal-cobradores-component.component.scss']
})
export class ModalCobradoresComponentComponent {
  cobradorEditado: any;
  showErrorAlert: boolean = false;
  errorAlertMessage: string = "";

  // Opciones para el select
collectionTypeOptions = [
  { value: 1, label: 'Bloqueo por Cuenta' },
  { value: 2, label: 'Bloqueo por Cliente' }
];

  constructor(
    public dialogRef: MatDialogRef<ModalCobradoresComponentComponent>,
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
    console.log('=== MODAL: updateCobrador ===');
    console.log('Datos en el modal:', this.cobradorEditado);

    // Validación del ID
    if (!this.cobradorEditado.collector_id || this.cobradorEditado.collector_id <= 0) {
        console.error('ID inválido:', this.cobradorEditado.collector_id);
        this.showErrorAlert = true;
        this.errorAlertMessage = "El ID es requerido y debe ser mayor a 0";
        return;
    }

    // Validaciones de hora...
    let startTimeArr = this.cobradorEditado.start_time.split(":");
    let finalTimeArr = this.cobradorEditado.final_time.split(":");

    let validStartTime = parseInt(startTimeArr[0]) < 24 && parseInt(startTimeArr[1]) < 60 && parseInt(startTimeArr[2]) < 60;
    let validFinalTime = parseInt(finalTimeArr[0]) < 24 && parseInt(finalTimeArr[1]) < 60 && parseInt(finalTimeArr[2]) < 60;

    if (validStartTime && validFinalTime) {
        if (this.cobradorEditado.start_time < this.cobradorEditado.final_time) {
            console.log('Validaciones pasadas, cerrando modal...');
            this.showErrorAlert = false;
            this.dialogRef.close(this.cobradorEditado);
        } else {
            console.error('Hora inicial mayor que final');
            this.showErrorAlert = true;
            this.errorAlertMessage = "La hora inicial debe ser menor a la hora final";
        }
    } else {
        console.error('Formato de hora inválido');
        this.showErrorAlert = true;
        this.errorAlertMessage = "La hora ingresada no es válida";
    }
}

  deleteCobrador(collector_id: number): void {
    this.dialogRef.close({ collector_id, delete: true });
  }
}
