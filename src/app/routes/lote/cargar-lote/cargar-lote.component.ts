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

   // 🆕 Bandera para controlar el estado del botón
   isSubmitting: boolean = false;

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
    private cdRef : ChangeDetectorRef,  // ✅ Inyectado correctamente
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
    // Al iniciar, aseguramos que el botón esté habilitado
    this.isSubmitting = false;
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
    // 🚫 Si ya está en proceso, no hacer nada
    if (this.isSubmitting) {
      console.warn('⛔ El envío ya está en progreso. Ignorando nuevo clic.');
      return;
    }

    // Validar que haya un archivo seleccionado
    if (!this.archivos) {
      this.toast.error("Debe seleccionar un archivo antes de guardar.", "", this.override);
      return;
    }

    // 🔒 Bloquear el botón inmediatamente (atómico)
    this.isSubmitting = true;
    // ✅ Forzar la detección de cambios para que la vista se actualice
    this.cdRef.detectChanges();

    // Mostrar spinner
    this.spinner.show("sp1");

    console.log("Contenido del archivo en Base64:", this.archivos);

    this.AdministradorService.cargarLote(this.archivos, this.nombrearchivo, this.id_lote).subscribe({
      next: (data) => {
        // Ocultar spinner
        this.spinner.hide("sp1");

        if (data.code === 1000) {
          this.toast.success(data.message, "", this.override);
          // 🔓 Desbloquear solo si el usuario cierra el modal manualmente
          // En este caso, redirigimos y cerramos el modal
          setTimeout(() => {
            this.redirigir();
          }, 1000);
        } else {
          // Si hubo error del backend, mostramos mensaje y desbloqueamos
          this.toast.error(data.message || "Error al cargar el archivo", "", this.override);
          // 🔓 Desbloquear para permitir reintento
          this.isSubmitting = false;
          this.cdRef.detectChanges();
        }
      },
      error: (error) => {
        // Ocultar spinner
        this.spinner.hide("sp1");
        this.toast.error("Error de conexión con el servidor", "", this.override);
        // 🔓 Desbloquear para permitir reintento
        this.isSubmitting = false;
        this.cdRef.detectChanges();
        console.error('Error al cargar lote:', error);
      },
      complete: () => {
        // Si la suscripción se completa sin errores, aseguramos que el spinner se oculte
        this.spinner.hide("sp1");
      }
    });
  }

  //------------------------------------------------------------------------------------------------- ENLACE EXTERNO
  regresar(): void {
    // Si está en proceso, no permitir regresar (opcional)
    if (this.isSubmitting) {
      this.toast.warning("Espere a que termine la carga antes de regresar.", "", this.override);
      return;
    }
    this.execute=true;
    this.dialogRef.close();
  }

  redirigir(){
    // Al cerrar el diálogo, liberamos el estado para futuras cargas (si se vuelve a abrir el modal)
    this.isSubmitting = false;
    this.dialogRef.close();
  }

  clear(){
    this.cargaFormulario.patchValue({
      file : "",
      nombrearchivo:"",
    });
  }
}
