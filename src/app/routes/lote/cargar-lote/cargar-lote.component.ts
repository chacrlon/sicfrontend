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
  selector: 'app-cargar-lote',
  templateUrl: './cargar-lote.component.html',
  styleUrls: ['./cargar-lote.component.scss']
})
export class CargarLoteComponent implements OnInit {

   execute:boolean=false;
   id_lote: any;
   nombrearchivo: any;
   archivos:any;

   cargaFormulario : FormGroup;

   override = {
    positionClass: 'toast-bottom-full-width',
    showDuration: 3000,
    timeOut: 5000,
    extendedTimeOut: 2000,
    closeButton: true,
    enableHtml: true,
  };

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
   private dialogRef: MatDialogRef< CargarLoteComponent>,
    private overlay: Overlay)
    {
//------------------------------------------------------------------------------------------------- ARCHIVO
this.cargaFormulario = formBuilder.group({
  file: new FormControl( '', [Validators.required]),
  nombrearchivo: new FormControl( '', [Validators.required])
});
}

//------------------------------------------------------------------------------------------------- ARCHIVO
  ngOnInit(): void {
    this.id_lote = localStorage.getItem('idlote');
  }

  handleUpload(event:any) {
    if (event.target.files[0].size == 0){
      this.clear();
      this.toast.error("El Archivo se encuenra vacío. Por favor, revisar e intente nuevamente.","", this.override);
      return;
    }else{
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const name = event.target.files[0].name;
    reader.onload = () => {
        this.nombrearchivo = name;
        this.archivos =reader.result;
    };
  }
    var envio:any = {
      idlote:this.id_lote,
      file:this.archivos,
      nombrearchivo:this.nombrearchivo

    }
  }
        async submitFile(){
          if (!this.execute) {
          this.spinner.show("sp1");
          var envio:any = {
            idlote:this.id_lote,
            file:this.archivos,
            nombrearchivo:this.nombrearchivo
          }
          console.log("Contenido del archivo en Base64:", this.archivos);
             await  this.AdministradorService.cargarLote(this.archivos,this.nombrearchivo,this.id_lote).subscribe(
              (data) =>{
                if(data.data != undefined){
                }else{
                  if (data.code === 1000) {
                    this.toast.success("El documento ha sido cargado con éxito.","", this.override);
                    setTimeout(()=>{
                      this.redirigir()
                  },1000)
                  } else {
                    this.toast.error("El documento no fue cargado con éxito. Por favor, intente de nuevo.","", this.override);
                  }
                  this.spinner.hide("sp1");
                }
              },
              (error) =>{
              }
             );

        }else{
          this.toast.error("Ingrese una Información Válida.", "", this.override);
        }

}
//------------------------------------------------------------------------------------------------- ENLACE EXTERNO
regresar(): void {
  this.execute=true;
   this.dialogRef.close();
  }
  redirigir(){
    this.dialogRef.close();
}
clear(){
  this.cargaFormulario.patchValue({
    file : "",
    nombrearchivo:"",

 });
 }

}
