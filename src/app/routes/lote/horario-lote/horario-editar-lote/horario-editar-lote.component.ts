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

@Component({
  selector: 'app-horario-editar-lote',
  templateUrl: './horario-editar-lote.component.html',
  styleUrls: ['./horario-editar-lote.component.scss']
})
export class HorarioEditarLoteComponent implements OnInit {

  idhora :any = '';
  execute:boolean=false;

  override = {
    positionClass: 'toast-bottom-full-width',
    showDuration: 3000,
    timeOut: 5000,
    extendedTimeOut: 2000,
    closeButton: true,
    enableHtml: true,
  };

  horaFormulario: FormGroup;


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
   private dialogRef: MatDialogRef< HorarioEditarLoteComponent>,
    private overlay: Overlay) {

    this.horaFormulario = formBuilder.group({
      horainicio :  new FormControl(''),
      horafin :  new FormControl(''),

    });
   }

  ngOnInit(): void {
    this.idhora = localStorage.getItem('idhora');
    this.busquedaHora(this.idhora);
  }

  /*metodoHoras(horaconfiguracion: any) {
    let hour = (horaconfiguracion.split(':'))[0]
    let min = (horaconfiguracion.split(':'))[1]
    let part = hour > 12 ? 'PM' : 'AM';
    if(parseInt(hour) == 0)
     hour = 12;
    min = (min+'').length == 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour+'').length == 1 ? `0${hour}` : hour;
    return `${hour}:${min} ${part}`
  }*/
//------------------------------------------------------------------------------------------------- MODIFICAR HORA
  async changeHorario(){
   // let horas1= this.metodoHoras(this.horaFormulario.value.horainicio);
   // let horas2= this.metodoHoras(this.horaFormulario.value.horafin);
    this.spinner.show("sp1");
      await  this.AdministradorService.modificarHora(this.horaFormulario.value, this.idhora).subscribe(
        (data) =>{
          console.log('Formulario Hora:::',data)
      if (data.data != undefined){
        this.horaFormulario.value({
          horainicio: data.horainicio,
          horafin: data.horafin
        });
      } else if(data.code === 1007){
        this.toast.error( "El Registro se encuentra en Uso. Por favor, hacer uso del mismo." , "",this.override);
       }else if(data.code === 1000){
        this.toast.success( "La Hora ha sido Modificada con Éxito" , "",this.override);
      }
          this.spinner.hide("sp1");
        },
      (error) =>{
        this.spinner.hide("sp1");
      }
   );
}

//------------------------------------------------------------------------------------------------- DETALLE HORA
async busquedaHora(xvalor:string){
  this.spinner.show("sp1");
  await  this.AdministradorService.consultarHoraDetalle(xvalor).subscribe(
    (data) =>{
      console.log(data)
      console.log(data.data.horainicio,":::::::::::::")
      console.log(data.data.horafin,":::::::::::::")
      this.horaFormulario.patchValue({
        horainicio:  data.data.horainicio.split(" ")[0],
        horafin:  data.data.horafin.split(" ")[0],
      });
      this.spinner.hide("sp1");
    },
    (error) =>{
    }
  );
}
//------------------------------------------------------------------------------------------------- ENLACE EXTERNO
regresar(): void {
  this.execute=true;
   this.dialogRef.close();
  }
  redirigir(){
    this.dialogRef.close();
}
//------------------------------------------------------------------------------------------------- HORA FORMAT
/*transform(time: any): any {
     let hour = (time.split(':'))[0]
     let min = (time.split(':'))[1]
     let part = hour > 12 ? 'pm' : 'am';
     if(parseInt(hour) == 0)
      hour = 12;
     min = (min+'').length == 1 ? `0${min}` : min;
     hour = hour > 12 ? hour - 12 : hour;
     hour = (hour+'').length == 1 ? `0${hour}` : hour;
     return `${hour}:${min} ${part}`
   }¨*/

}
