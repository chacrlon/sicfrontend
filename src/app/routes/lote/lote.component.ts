
import {ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators,} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { ActivatedRoute, Router, RouterLink, UrlSegment } from '@angular/router';
import { TooltipPosition} from '@angular/material/tooltip';
import { MatDialog} from '@angular/material/dialog';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Irol, LoginService } from 'app/servicios/util/login.service';
import { IusuarioLdap } from 'app/models/usuarioLdap';
import * as CryptoJS from 'crypto-js';
import { NgxSpinnerService } from "ngx-spinner";
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SpinnerComponent } from '../sessions/login/spinner.component';
import { SortDataSource } from '../material/table/table.component';
import { MatTableDataSource} from '@angular/material/table';
import { DateAdapter } from '@angular/material/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { AdministradorService } from 'app/servicios/administrador/administrador.service';
import { LotesConsulta } from 'app/models/administrador';
import { RegistroLoteComponent } from './registro-lote/registro-lote.component';
import { EstadoLoteComponent } from './estado-lote/estado-lote.component';
import { EstadoLoteReprocesadoComponent } from './estado-lote-reprocesado/estado-lote-reprocesado.component';
import { SeguimientoloteComponent } from './seguimientolote/seguimientolote.component';
import { DataSource } from '@angular/cdk/table';
import { EstadisticasLotesComponent } from './estadisticas-lotes/estadisticas-lotes.component';
import { CargarLoteComponent } from './cargar-lote/cargar-lote.component';
import * as moment from 'moment';
import { DepartamentosService } from 'app/servicios/util/Departamentos.service.';
import { environment } from '@env/environment';
import 'moment/locale/pt-br';
import { EditarLoteComponent } from './editar-lote/editar-lote.component';
import { ISelectUnidad } from 'app/models/administrador';
import { MatSelect } from '@angular/material/select';
import { HorarioLoteComponent } from './horario-lote/horario-lote.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { usuario } from '../../models/empleados';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
  },
};

const ELEMENT_DATA: LotesConsulta[] = [];
@Component({
  selector: 'app-lote',
  templateUrl: './lote.component.html',
  styleUrls: ['./lote.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
})
export class LoteComponent implements OnInit {

  cedulas: IusuarioLdap  = {} as IusuarioLdap; // Información de MSINT
  user: IusuarioLdap  = {} as IusuarioLdap; // Información de MSINT

  displayedColumns: string[] = ['idlote','unidad','nombrearchivo','fechaInicio','fechaFin','fechacreacion','accion','estadolote','acciones'];
  positionOptions: TooltipPosition[] = ['above'];
  position = new FormControl(this.positionOptions[0]);
  dataSource: MatTableDataSource<LotesConsulta>;
  rol : Irol = {} as Irol;


protected unidad : ISelectUnidad[] = [];
public unidadesCtrl  : FormControl = new FormControl('', [Validators.required]);
public unidadFiltroCtrl  : FormControl = new FormControl();
public filtroUnidad  : ReplaySubject<ISelectUnidad[]> = new ReplaySubject<ISelectUnidad[]>(1);


@ViewChild('singleSelect', { static: true })
singleSelect!: MatSelect;

  override = {
    positionClass: 'toast-bottom-full-width',
    showDuration: 4000,
    timeOut: 3000,
    extendedTimeOut: 2000,
    closeButton: true,
    enableHtml: true,
  };

  busquedaForm: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort = new MatSort;
  @ViewChild('container', {read: ViewContainerRef}) container2: any;
  private overlayRef!: OverlayRef;


  constructor(public dialog: MatDialog,
    private router: Router,
    private RouterLink : Router,
    private spinner: NgxSpinnerService,
    private AdministradorService : AdministradorService,
    private dateAdapter: DateAdapter<Date>,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdRef : ChangeDetectorRef,
    private formBuilder : FormBuilder,
    private loginService: LoginService,
    private toast: ToastrService,
    private overlay: Overlay,
    private activateRoute:ActivatedRoute )
 {

 this.busquedaForm = formBuilder.group({
  fechai: new FormControl('', { validators: [Validators.required]}) ,
  fechaf: new FormControl('', { validators: [Validators.required]}),
  numerolote: new FormControl(''),
  estadolote: new FormControl(''),
  codigoUnidad: new FormControl(''),
});

  this.dateAdapter.setLocale('es-ES');
  this.dataSource = new MatTableDataSource(ELEMENT_DATA);
 }

 protected _onDestroy = new Subject<void>();
 protected _onDestroyII = new Subject<void>();

  ngOnInit(): void {
   let laurlActual: String="";
    this.activateRoute.url.subscribe(url=>(
      laurlActual=url[0].path
      ))
      var verifi2 : any = sessionStorage.getItem('hasToken');
      var decrypted2 = CryptoJS.TripleDES.decrypt(verifi2, "CiSecret")
      this.rol.app = environment.app
      this.rol.cedula = decrypted2.toString(CryptoJS.enc.Utf8)
      this.loginService.unmetodo(laurlActual,this.rol)
        this.obtenerUnidades();
        this.unidadesCtrl.setValue(this.unidad);
        this.filtroUnidad.next(this.unidad);
        this.unidadFiltroCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filtroUnidadx();
        });
    var has : any =  sessionStorage.getItem("hasToken");
    ​var decrypted = CryptoJS.TripleDES.decrypt(has, "CiSecret");
    this.loginService.usuario(decrypted.toString(CryptoJS.enc.Utf8))
    .subscribe(data => {
          this.user = data.usuario;
          this.user.nombres = this.user.nombres.toUpperCase()+ " " +  this.user.apellidos.toUpperCase();
          this.user.apellidos = this.user.apellidos.toUpperCase();
          this.cedulas = data.usuario.cedula;
    });
    this.spinner.show("sp1");
     this.busquedaLote();
    this.spinner.hide("sp1");
  }
// UNIDADES
  protected filtroUnidadx() {
    if (!this.unidad) {
      return;
    }

    let search = this.unidadFiltroCtrl.value;
    if (!search) {
      this.filtroUnidad.next(this.unidad.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filtroUnidad.next(
      this.unidad.filter(uni => uni.codigounidad.toLowerCase().indexOf(search) > -1 || uni.unidad.toLowerCase().indexOf(search) > -1)
    );
  }
  async obtenerUnidades(){
    await this.AdministradorService.obtenerUnidades().subscribe(
      (data) =>{
        for (const iterator of data.data) {
          this.unidad.push({codigounidad:  iterator.codigounidad, unidad: iterator.unidad});
        }
      },
      (error) =>{

      }
    );
  }
//

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    this._onDestroyII.next();
    this._onDestroyII.complete();
    }
// VALIDACION NUMERICA
    numberOnly(event: { which: any; keyCode: any; }): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }
// ELIMINAR LOTE
eliminarLote(idlote: string){
  localStorage.setItem('idlote', idlote);
  const dialogRef = this.dialog.open(ConfirmDialogComponent,{
    data:{
        message: '¿Estás seguro de eliminar el lote N°'+idlote+'?' ,
    }});
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
  if (confirmed) {
    this.spinner.show("sp1");
      this.AdministradorService.EliminarLote(idlote, this.cedulas).subscribe(
        (data) =>{
         if(data.code != 9999 ){
          this.toast.success( "El lote N° "+ idlote +" fue eliminado con Éxito." , "",this.override);
          this.busquedaLote();
          }else {
            this.toast.error( "No puedo realizar la eliminación.Verifique e intente más tarde." , "",this.override);
            this.busquedaLote();
          }
          this.spinner.hide("sp1");
        },
        (error) =>{
        }
    );
  }
  this.spinner.hide("sp1");
    });
}
// EDITAR LOTE
editarLote(idlote: string){
  localStorage.setItem('idlote', idlote);
   const dialogRef = this.dialog.open(EditarLoteComponent, {
     width: '30%',
     data: {
     }
   });
   dialogRef.afterClosed().subscribe(result => {
    this.busquedaLote();
  });
}
// REGISTRAR LOTE
  RegistrarLotes(): void {
    const dialogRef = this.dialog.open(RegistroLoteComponent, {
      width: '40%',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.busquedaLote();
    });
  }
// RESUMEN ESTADO LOTE
EstadoLote(idlote: string): void {
  localStorage.setItem('idlote', idlote);
  const dialogRef = this.dialog.open(EstadoLoteComponent, {
    width: '30%',
    data: {}
  });

  dialogRef.afterClosed().subscribe(result => {
    this.busquedaLote();
  });
}

// En LoteComponent
EstadoLoteReprocesado(row: any): void {
  localStorage.setItem('idlote', row.idlote);

  if (row.estadolote === 'W') {  // Si el estado es 'W' (Reprocesado)
    this.dialog.open(EstadoLoteReprocesadoComponent, {  // Abre componente de reprocesado
      width: '30%',
      data: {}
    });
  } else {  // Para otros estados
    this.dialog.open(EstadoLoteComponent, {  // Abre componente normal
      width: '30%',
      data: {}
    });
  }
}

  // RESUMEN SEGUIMIENTO LOTE
  SeguiLote(idlote: string): void {
    localStorage.setItem('idlote', idlote);
    const dialogRef = this.dialog.open(SeguimientoloteComponent, {
      width: '50%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.busquedaLote();
    });
  }
// IR A CARGAR LOTE
  CargarLote(idlote: string): void {
    localStorage.setItem('idlote', idlote);
   const dialogRef = this.dialog.open(CargarLoteComponent, {
     width: '30%',
     data: {

     }
   });
   dialogRef.afterClosed().subscribe(result => {
    this.busquedaLote();
  });

  }
// IR A REGISTRAR HORARIO LOTE
HorarioLote(): void {
 const dialogRef = this.dialog.open(HorarioLoteComponent, {
   width: '50%',
   data: {

   }
 });
 dialogRef.afterClosed().subscribe(result => {
  this.busquedaLote();
});
}
// BUSCAR POR FECHA Y OTRAS INDICADORES LOS LOTES

async busquedaLotesAvanzado(){
    this.spinner.show("sp1");
    await this.AdministradorService.consultarFechaLoteAvanzado({
      fechai: moment(this.busquedaForm.value.fechai).format("DD/MM/YYYY"),
      fechaf: moment(this.busquedaForm.value.fechaf).format("DD/MM/YYYY"),
      numerolote: (this.busquedaForm.value.numerolote),
      estadolote: (this.busquedaForm.value.estadolote),
      codigoUnidad: (this.busquedaForm.value.codigoUnidad),
    }).subscribe(
      (data) =>{
        if (data.code != 9999) {
        this.dataSource = new MatTableDataSource(data.data);
        this.ngAfterViewInit();
        } else{
          this.toast.error( "No se puedo realizar la consulta correctamente. Verificar en la consulta que el campo Fecha no se encuentre vacío." , "",this.override);
        }
        this.spinner.hide("sp1");
      },
      (error) =>{
      }
    );
  }

// LIMPIAR FORMULARIO AVANZADO
clear(){
 this.busquedaForm.patchValue({
  fechai : "",
  fechaf:  "",
  numerolote:  "",
  estadolote:  "",
  codigoUnidad:  ""
});
this.busquedaLote();
}
// CONSULTAR LOTES
async busquedaLote(){
  this.spinner.show("sp1");
    await this.AdministradorService.consultarLotes().subscribe(
    (data) =>{
      console.log("Datos recibidos:", data.data); // 👈 Verifica aquí
      if (data.code != 9999) {
      this.dataSource = new MatTableDataSource(data.data);
      this.ngAfterViewInit();
      }
      this.spinner.hide("sp1");
    },
    (error) =>{
    }
  );
}
// CONSULTA GENERAL
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue!="") {
    }else{
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
// SPINNER
  public show(message = '') {
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create();
    }
    const spinnerOverlayPortal = new ComponentPortal(SpinnerComponent);
    const component = this.overlayRef.attach(spinnerOverlayPortal);
  }
  public hide() {
    if (!!this.overlayRef) {
      this.overlayRef.detach();
    }
  }
}
