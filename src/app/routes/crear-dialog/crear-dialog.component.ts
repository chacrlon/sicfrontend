import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crear-dialog',
  templateUrl: './crear-dialog.component.html',
  styleUrls: ['./crear-dialog.component.scss']
})
export class CrearDialogComponent implements OnInit {

constructor(@Inject(MAT_DIALOG_DATA) private data: any, private dialogRef: MatDialogRef<CrearDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
