import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BasicDataSource } from '../material/table/table.component';
import { MatTableDataSource } from '@angular/material/table';
const ELEMENT_DATA: any[] = [];

@Component({
  selector: 'app-dialog-upload',
  templateUrl: './dialog-upload.component.html',
  styleUrls: ['./dialog-upload.component.scss']
})
export class DialogUploadComponent implements OnInit {

  message: string = "¿Estás seguro de cerrar el servicio del comedor?"
  confirmButtonText = "Si, confirmo."
  cancelButtonText = "Volver"
  displayedColumns = ['cedulas'];
  dataSource!: MatTableDataSource<any>;

  datos:any[]=[];
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any, 
    private dialogRef: MatDialogRef<DialogUploadComponent>
   
    ) {
      this.dataSource = new MatTableDataSource(ELEMENT_DATA);
      this.dataSource = new MatTableDataSource(data.elementos);
      if(data){
          this.message = data.message || this.message;
          if (data.buttonText) {
              this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
              this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
          }
      }

    }
  ngOnInit() {
  }

    onConfirmClick(): void {
      this.dialogRef.close(true);
  }
}
