import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BasicDataSource } from '../material/table/table.component';
import { MatTableDataSource } from '@angular/material/table';
///import {ClipboardModule} from '@angular/cdk/clipboard';

const ELEMENT_DATA: any[] = [];

@Component({
  selector: 'app-dialog-show',
  templateUrl: './dialog-show.component.html',
  styleUrls: ['./dialog-show.component.scss']
})
export class DialogShowComponent implements OnInit {

  message: string = "¿Estás seguro de cerrar el servicio del comedor?"
  confirmButtonText = "Si, confirmo."
  cancelButtonText = "Listo"
  displayedColumns = ['cedulas'];
  dataSource!: MatTableDataSource<any>;
  dataSourceGuardados!: MatTableDataSource<any>;
  //value ='';

  datos:any[]=[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DialogShowComponent>,
   // private clipboard: Clipboard


    ) {
      this.dataSource = new MatTableDataSource(ELEMENT_DATA);
      this.dataSource = new MatTableDataSource(data.elementos);

      this.dataSourceGuardados = new MatTableDataSource(ELEMENT_DATA);
      this.dataSourceGuardados = new MatTableDataSource(data.elementosGuardados);
     // console.log("data", data);
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
