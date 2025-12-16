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
import { IusuarioLdap } from 'app/models/usuarioLdap';
import * as moment from 'moment';
import { Subject } from 'rxjs/internal/Subject';
import { HorarioEditarLoteComponent } from './horario-editar-lote/horario-editar-lote.component';
import { HorarioCrearLoteComponent } from './horario-crear-lote/horario-crear-lote.component';

import { HorarioConsulta } from 'app/models/administrador';
import { usuario } from '../../../models/empleados';


const ELEMENT_DATA: HorarioConsulta[] = [];

@Component({
  selector: 'app-horario-lote',
  templateUrl: './horario-lote.component.html',
  styleUrls: ['./horario-lote.component.scss']
})
export class HorarioLoteComponent implements OnInit {

  user: IusuarioLdap  = {} as IusuarioLdap; // Información de MSINT


  private total=0;
  displayedColumns: string[] = ['valorConfigurado','estado'];
  positionOptions: TooltipPosition[] = ['above'];
  position = new FormControl(this.positionOptions[0]);
  dataSource: MatTableDataSource<any>;

  override = {
    positionClass: 'toast-bottom-full-width',
    showDuration: 3000,
    timeOut: 5000,
    extendedTimeOut: 2000,
    closeButton: true,
    enableHtml: true,
  };

  protected _onDestroy = new Subject<void>();
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort = new MatSort;
  @ViewChild('container', {read: ViewContainerRef}) container2: any;
  private overlayRef!: OverlayRef;

  constructor(public dialog: MatDialog,

    private router: Router,
    private AdministradorService : AdministradorService,
    private spinner: NgxSpinnerService,
    private formBuilder : FormBuilder,
    private toast: ToastrService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdRef : ChangeDetectorRef,
    private loginService: LoginService,
    private EmpleadoService : EmpleadoService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<HorarioLoteComponent>,
    private overlay: Overlay) {
       this.dataSource = new MatTableDataSource(ELEMENT_DATA);
     }

  ngOnInit(): void {
    var has : any =  sessionStorage.getItem("hasToken");
    ​var decrypted = CryptoJS.TripleDES.decrypt(has, "CiSecret");
    this.loginService.usuario(decrypted.toString(CryptoJS.enc.Utf8))
    .subscribe(data => {
          this.user = data.usuario;
          this.user.nombres = this.user.nombres.toUpperCase()+ " " +  this.user.apellidos.toUpperCase();
          this.user.apellidos = this.user.apellidos.toUpperCase();
    });
    this.spinner.show("sp1");
    this.busquedaHora();
    this.spinner.hide("sp1");
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

//------------------------------------------------------------------------------------------------- ESTADO HORA

traductor(rowData:any){
  if (rowData.estado == 0) {
    return false;
  } else {
    return true;
  }
}

async cambiarEstado(rowData:any){
  let estado;
  if (rowData.estado == 0) {
    estado=1;
   }else if (rowData.estado == 1){
    estado=0
    }
    this.spinner.show("sp1");
    await  this.AdministradorService.modificarEstadoHora(estado, rowData.idGiomConfiguracion,this.user.codigo).subscribe(
      (data) =>{
         if(data.code != 9999){
          this.busquedaHora();
        }else{
          this.toast.error("Hora no Activada. Error en la red. Intente de Nuevo.", "", this.override);
        }
        this.spinner.hide("sp1");
      },
        (error) =>{

        }
      );
}

execute:boolean=false;



//------------------------------------------------------------------------------------------------- CONSULTAR DATOS DE REGIOSTROS DE HORAS
async busquedaHora(){

  this.spinner.show("sp1");
  await this.AdministradorService.busquedaHoras({descriptor :"H"}).subscribe(
    (data) =>{
      console.log('Consultar Horario',data)
      this.dataSource = new MatTableDataSource(data.data);
      this.ngAfterViewInit();
      this.spinner.hide("sp1");
    },
    (error) =>{
      this.spinner.hide;
      this.toast.error("No se encontro Datos. Error en la red.", "", this.override);
    }
  );
}
//------------------------------------------------------------------------------------------------- AUDITORIA POR ESTADO HORA
guardarModificacionEstadoAuditoria(rowData:any){
  this.AdministradorService.AuditoriaEstadoHora(this.user.nombres,rowData.idGiomConfiguracion).subscribe(
     (data) =>{
         },
     (error) =>{
     });
 }

//------------------------------------------------------------------------------------------------- REGISTRAR HORA
RegistrarHora(): void {
  const dialogRef = this.dialog.open(HorarioCrearLoteComponent, {
    width: '30%',
    data: {}
  });

  dialogRef.afterClosed().subscribe(result => {
    this.busquedaHora();
  });
}
//------------------------------------------------------------------------------------------------- EDITAR HORA
editarHora(idhora: string){
  localStorage.setItem('idhora', idhora);
   const dialogRef = this.dialog.open(HorarioEditarLoteComponent, {
     width: '30%',
     data: {
     }
   });
   dialogRef.afterClosed().subscribe(result => {
    this.busquedaHora();
  });
}
//------------------------------------------------------------------------------------------------- HORA FORMAT
transform(time: any): any {
     let hour = (time.split(':'))[0]
     let min = (time.split(':'))[1]
     let part = hour > 12 ? 'pm' : 'am';
     if(parseInt(hour) == 0)
      hour = 12;
     min = (min+'').length == 1 ? `0${min}` : min;
     hour = hour > 12 ? hour - 12 : hour;
     hour = (hour+'').length == 1 ? `0${hour}` : hour;
     return `${hour}:${min}`
   }

   regresar(): void {
    this.execute=true;
     this.dialogRef.close();
    }
}


