import { Component, Inject, OnInit } from '@angular/core';
import { AdministradorService } from 'app/servicios/administrador/administrador.service';
import { LoginService } from 'app/servicios/util/login.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { TooltipPosition} from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { Workbook } from 'exceljs'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { NgxSpinnerService } from "ngx-spinner";
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { registros } from 'app/models/empleados';
import { EmpleadoService } from 'app/servicios/empleados/empleado.service';
import {ChangeDetectorRef, VERSION ,  ComponentFactoryResolver, ViewChild, ViewContainerRef} from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { saveAs } from 'file-saver';
import { Console } from 'console';
import * as moment from 'moment';


@Component({
  selector: 'app-estadisticas-lotes',
  templateUrl: './estadisticas-lotes.component.html',
  styleUrls: ['./estadisticas-lotes.component.scss']
})
export class EstadisticasLotesComponent implements OnInit {

  constructor(    @Inject(MAT_DIALOG_DATA) private data: any,
  private dialogRef: MatDialogRef<EstadisticasLotesComponent>,) { }

  ngOnInit(): void {
  }


  volverEjecutado:boolean=false;

  regresar(): void {
    this.volverEjecutado=true;
    this.dialogRef.close();
  }

  redirigirSuccess(){
    this.dialogRef.close();
  }



}
