import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})

export class ConfirmDialogComponent{

  message: string = "¿Estás seguro de cerrar el servicio del comedor?"
  confirmButtonText = "Si, confirmo."
  cancelButtonText = "Volver"
  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private dialogRef: MatDialogRef<ConfirmDialogComponent>) {

      if(data){

          this.message = data.message || this.message;
          if (data.buttonText) {
              this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
              this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
          }
      }

    }

    onConfirmClick(): void {
      this.dialogRef.close(true);
  }

}
