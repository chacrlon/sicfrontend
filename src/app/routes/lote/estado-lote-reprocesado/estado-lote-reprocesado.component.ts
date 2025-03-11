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
    .subscribe(data => {
      console.log(data.usuario.cedula, "trae")
          this.user = data.usuario;
          this.user.nombres = this.user.nombres.toUpperCase()+ " " +  this.user.apellidos.toUpperCase();
          this.user.apellidos = this.user.apellidos.toUpperCase();
          this.cedulas = data.usuario.cedula;
    });
      this.busquedaEstado(this.idlote);
      this.busquedaEstado2(this.idlote);
      this.busquedaEstado3(this.idlote);
    }


    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }


    async busquedaEstado(xvalor:string){
      this.spinner.show("sp1");
      await  this.AdministradorService.consultarDetalleEstado(xvalor).subscribe(
        (data) =>{
          this.fecha= data.data.fechaInicio
          this.fecha2= data.data.fechaFin
          this.nombre = data.data.nombrearchivo
          this.estados = data.data.estadolote // Asegúrate que esto sea 'W'
          console.log(data,"detalles")
          this.spinner.hide("sp1");
        },
        (error) =>{
        }
      );
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




    async submitLote(){
      this.spinner.show("sp1");
      if(this.busquedaForm.valid){
        this.spinner.show("sp1");
         this.AdministradorService.ModificarELoteReprocesado(this.busquedaForm.value,this.idlote,this.cedulas).subscribe(
          (data) =>{
            console.log('Formulario Hora:::',data)
        if (data.data != undefined){
          this.busquedaForm.value({
            numero: data.data.numero,
          });
        }  else if(data.code === 1000){
          this.toast.success( "Se ha cambiado el estado del lote" , "",this.override);
          this.redirigirSuccess();

          } else {
            this.toast.error( "Error de Red. Intente de Nuevo." , "",this.override);
          }
            this.spinner.hide("sp1");
          },
        (error) =>{
          this.spinner.hide("sp1");
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
