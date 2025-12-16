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


const exampleData = [
  { idlote: '8:00 am'},
  { idlote: '2:00 pm'},

];

@Component({
  selector: 'app-estado-lote-reprocesado',
  templateUrl: './estado-lote-reprocesado.component.html',
  styleUrls: ['./estado-lote-reprocesado.component.scss']
})
export class EstadoLoteReprocesadoComponent implements OnInit {

// Agregar esta propiedad
estadoAnterior: string = 'W'; // Por defecto, asumir que viene de 'W'
  displayedColumns: string[] = ['idlote','acciones2','acciones'];
  positionOptions: TooltipPosition[] = ['above'];
  position = new FormControl(this.positionOptions[0]);
  dataSource: MatTableDataSource<any>;
  user: IusuarioLdap  = {} as IusuarioLdap; // Información de MS INT
  cedulas: IusuarioLdap  = {} as IusuarioLdap; // Información de MS INT

  override = {
    positionClass: 'toast-bottom-full-width',
    showDuration: 2000,
    timeOut: 2000,
    extendedTimeOut: 2000,
    closeButton: true,
    enableHtml: true,
  };



  protected _onDestroy = new Subject<void>();
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort = new MatSort;
  @ViewChild('container', {read: ViewContainerRef}) container2: any;
  private overlayRef!: OverlayRef;
  idlote: any;
  fecha: any;
  fecha2: any;
  nombre: any;
  total: any;
  total2: any;
  estados: any;

  registrosEnEspera: number = 0;
    montoPendiente: number = 0;
    montoRecuperado: number = 0;
  busquedaForm = new FormGroup({

    numero: new FormControl(''),
    //unidad: new FormControl(''),
    //montolote: new FormControl(''),
  });



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
  private dialogRef: MatDialogRef<EstadoLoteReprocesadoComponent>,
    private overlay: Overlay) {

      this.dataSource = new MatTableDataSource(exampleData);
      // this.dataSource = new MatTableDataSource(ELEMENT_DATA);
     }

  ngOnInit(): void {
    this.idlote = localStorage.getItem('idlote');
    var verifi2 : any = sessionStorage.getItem('hasToken');
    var decrypted2 = CryptoJS.TripleDES.decrypt(verifi2, "CiSecret")
    console.log("la cedula es:: ",decrypted2.toString(CryptoJS.enc.Utf8))

    var has : any =  sessionStorage.getItem("hasToken");
    ​var decrypted = CryptoJS.TripleDES.decrypt(has, "CiSecret");
    this.loginService.usuario(decrypted.toString(CryptoJS.enc.Utf8))
    this.loginService.usuario(decrypted.toString(CryptoJS.enc.Utf8))
      .subscribe(data => {
        this.user = data.usuario;
      });
        this.busquedaEstado(this.idlote);
        this.obtenerMontoRecuperado(this.idlote);
        this.obtenerMontoPendienteYRegistros(this.idlote);
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }



  async busquedaEstado2(xvalor:string){
    this.spinner.show("sp1");
    await  this.AdministradorService.consultarDetalleEstado2(xvalor).subscribe(
      (data) =>{
        this.total= data.data.totalregistros
        console.log(data,"detalles")
        this.spinner.hide("sp1");
      },
      (error) =>{
      }
    );
  }
  async busquedaEstado3(xvalor:string){
    this.spinner.show("sp1");
    await  this.AdministradorService.consultarDetalleEstado3(xvalor).subscribe(
      (data) =>{
        this.total2= data.data.monto2
        console.log(data,"detalles")
        this.spinner.hide("sp1");
      },
      (error) =>{
      }
    );
  }


async obtenerMontoRecuperado(xvalor: string) {
    this.spinner.show("sp1");

    console.log('=== SOLICITANDO MONTO RECUPERADO ===');
    console.log('ID Lote:', xvalor);

    await this.AdministradorService.consultarDetalleEstado2(xvalor).subscribe(
        (data) => {
            console.log('=== RESPUESTA CRUDA BACKEND ===');
            console.log('Respuesta completa:', data);
            console.log('data.code:', data.code);
            console.log('data.data:', data.data);

            if (data.code === 1000 && data.data) {
                console.log('✅ Servicio respondió correctamente');
                console.log('Estructura del data.data:', Object.keys(data.data));

                // CORRECCIÓN: Usar el nombre exacto que viene del backend
                this.montoRecuperado = Number(data.data.montorecuperado) || 0;
                console.log('💰 Monto recuperado (montorecuperado):', data.data.montorecuperado);
                console.log('💰 Monto recuperado convertido a número:', this.montoRecuperado);
            } else {
                console.log('❌ El servicio no devolvió datos válidos');
                this.montoRecuperado = 0;
            }

            this.spinner.hide("sp1");
        },
        (error) => {
            console.error('💥 Error en la petición:', error);
            this.spinner.hide("sp1");
        }
    );
}

async obtenerMontoPendienteYRegistros(xvalor: string) {
    this.spinner.show("sp1");

    console.log('=== SOLICITANDO REGISTROS EN ESPERA ===');
    console.log('ID Lote:', xvalor);

    await this.AdministradorService.consultarDetalleEstado3(xvalor).subscribe(
        (data) => {
            console.log('=== RESPUESTA CRUDA BACKEND consultarDetalleEstado3 ===');
            console.log('Respuesta completa:', data);

            if (data.code === 1000 && data.data) {
                console.log('✅ Servicio respondió correctamente');
                console.log('Estructura del data.data:', Object.keys(data.data));

                // CORRECCIÓN: El servicio devuelve monto2 que representa la cantidad de registros
                this.registrosEnEspera = Number(data.data.monto2) || 0;
                console.log('📊 Registros en espera (monto2):', data.data.monto2);
                console.log('📊 Registros en espera convertido a número:', this.registrosEnEspera);
            } else {
                console.log('❌ El servicio no devolvió datos válidos');
                this.registrosEnEspera = 0;
            }

            this.spinner.hide("sp1");
        },
        (error) => {
            console.error('💥 Error en la petición:', error);
            this.spinner.hide("sp1");
        }
    );
}


async busquedaEstado(xvalor: string) {
    this.spinner.show("sp1");
    await this.AdministradorService.consultarDetalleEstado(xvalor).subscribe(
        (data) => {
            this.fecha = data.data.fechaInicio;
            this.fecha2 = data.data.fechaFin;
            this.nombre = data.data.nombrearchivo;
            this.estados = data.data.estadolote;

            // Guardar el estado anterior cuando no está detenido
            if (this.estados !== 'D') {
                this.estadoAnterior = this.estados;
            }

            console.log('Estado actual:', this.estados, 'Estado anterior guardado:', this.estadoAnterior);
            this.spinner.hide("sp1");
        },
        (error) => {
            console.error('Error en busquedaEstado:', error);
            this.spinner.hide("sp1");
        }
    );
}

async submitLote(){
  this.spinner.show("sp1");
  if(this.busquedaForm.valid){
    console.log('=== DATOS DEL FORMULARIO ===');
    console.log('Form value:', this.busquedaForm.value);

    let numeroEnviar = this.busquedaForm.value.numero;

    // Si estamos reanudando un lote detenido y queremos volver a W
    if (this.estados === 'D' && numeroEnviar === '1') {
        // En lugar de enviar 1 (que pone A), enviar un valor específico para W
        // Esto requeriría modificar el backend para aceptar un nuevo valor
        numeroEnviar = '4'; // Valor temporal para indicar "reanudar a W"
        console.log('🔄 Reanudando lote detenido hacia estado W');
    }

    const idLoteNumerico = Number(this.idlote);

    this.AdministradorService.ModificarELoteReprocesado(
      { numero: numeroEnviar }, // Enviar el número modificado
      idLoteNumerico,
      this.user.codigo
    ).subscribe(
      (data) =>{
        console.log('Respuesta cambio estado:', data);
        if(data.code === 1000){
          this.toast.success("Se ha cambiado el estado del lote", "", this.override);
          this.redirigirSuccess();
        } else {
          this.toast.error("Error al cambiar el estado: " + (data.message || 'Desconocido'), "", this.override);
        }
        this.spinner.hide("sp1");
      },
      (error) =>{
        console.error('Error completo:', error);
        this.spinner.hide("sp1");
        this.toast.error("Error de conexión", "", this.override);
      }
    );
  }
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
