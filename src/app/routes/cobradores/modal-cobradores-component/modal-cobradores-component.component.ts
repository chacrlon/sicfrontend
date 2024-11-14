
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

  constructor(
    public dialogRef: MatDialogRef<ModalCobradoresComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cobradoresServices: CobradoresServices  // Agrega esta línea
) {
    this.cobradorEditado = { ...data };
}

  onClose(): void {
    this.dialogRef.close();
  }



  updateCobrador() {
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
