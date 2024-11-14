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
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-horario-crear-lote',
  templateUrl: './horario-crear-lote.component.html',
  styleUrls: ['./horario-crear-lote.component.scss']
})
export class HorarioCrearLoteComponent implements OnInit {

  user: IusuarioLdap  = {} as IusuarioLdap; // Información de MSINT
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
    private dialogRef: MatDialogRef<HorarioCrearLoteComponent>,
    private overlay: Overlay) {
//------------------------------------------------------------------------------------------------- FORM HORA
this.horaFormulario = formBuilder.group({
  horaconfiguracion :  new FormControl('', [Validators.required]),
  horaconfiguracion2 :  new FormControl('', [Validators.required])
});
//------------------------------------------------------------------------------------------------- FORM HORA
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
  }

 /* metodoHoras(horaconfiguracion: any) {
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
//------------------------------------------------------------------------------------------------- GUARDAR HORA
  async submitHorario(){
 //  let horas1= this.metodoHoras(this.horaFormulario.value.horaconfiguracion);
 //  let horas2= this.metodoHoras(this.horaFormulario.value.horaconfiguracion2);
    this.spinner.show("sp1");
      await  this.AdministradorService.crearHora(this.horaFormulario.value).subscribe(
        (data) =>{
          console.log('Formulario Hora:::',data)
        if (data.data != undefined){
        this.horaFormulario.value({
          horaconfiguracion: data.horaconfiguracion,
          horaconfiguracion2: data.horaconfiguracion2,
        });
        } else if(data.code === 1007){
          this.toast.error( "El Registro se encuentra en Uso. Por favor, hacer uso del mismo." , "",this.override);
         }else if(data.code === 1000){
          this.toast.success( "La Hora ha sido Registrada con Éxito" , "",this.override);
          this. redirigir();
        }
          this.spinner.hide("sp1");
        },
      (error) =>{
        this.spinner.hide("sp1");
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
   // console.log("laimpresion",time)
     let hour = (time.split(':'))[0]
     let min = (time.split(':'))[1]
     let part = hour > 12 ? 'pm' : 'am';
     if(parseInt(hour) == 0)
      hour = 12;
     min = (min+'').length == 1 ? `0${min}` : min;
     hour = hour > 12 ? hour - 12 : hour;
     hour = (hour+'').length == 1 ? `0${hour}` : hour;
     return `${hour}:${min} ${part}`
   }*/

}
