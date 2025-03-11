import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, OnInit, ViewChild, Input, Directive,AfterViewInit, ChangeDetectorRef, VERSION ,  ComponentFactoryResolver,  OnDestroy, ViewContainerRef, Inject } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerComponent } from 'app/routes/sessions/login/spinner.component';
/*................................................................................ */
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { IDatosTrabObj, IDatosTrab, IEmpleadoServicio, InviConsulta } from 'app/models/empleados';
import { MatTableDataSource} from '@angular/material/table';
import { ISelect } from 'app/models/departamentos';
import { ISelectServicio } from 'app/models/administrador';
import { AdministradorService } from 'app/servicios/administrador/administrador.service';
import { EmpleadoService } from 'app/servicios/empleados/empleado.service';
import { LoginService } from 'app/servicios/util/login.service';
import { IusuarioLdap } from 'app/models/usuarioLdap';
import * as CryptoJS from 'crypto-js';
import { TooltipPosition} from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs'
import { DepartamentosService } from 'app/servicios/util/Departamentos.service.';
import { NgxSpinnerService } from 'ngx-spinner';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject, take, takeUntil, timeout } from 'rxjs';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DialogUploadComponent } from 'app/routes/dialog-upload/dialog-upload.component';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { DialogShowComponent } from 'app/routes/dialog-show/dialog-show.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LotesConsulta } from 'app/models/administrador';
import { DateAdapter } from '@angular/material/core';
import { ISelectUnidad } from 'app/models/administrador';
import { MAT_DATE_LOCALE } from '@angular/material/core'
import 'moment/locale/pt-br';



const ELEMENT_DATA: LotesConsulta[] = [];

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
  },
};

@Component({
  selector: 'app-editar-lote',
  templateUrl: './editar-lote.component.html',
  styleUrls: ['./editar-lote.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
})
export class EditarLoteComponent implements OnInit {
  idlote:any = '';
  user: IusuarioLdap  = {} as IusuarioLdap; // Información de MSINT
  execute:boolean=false;

  override = {
    positionClass: 'toast-bottom-full-width',
    showDuration: 2000,
    timeOut: 2000,
    extendedTimeOut: 2000,
    closeButton: true,
    enableHtml: true,
  };

  override2 = {
    positionClass: 'toast-bottom-full-width',
    closeButton: true,
    showDuration: 3000,
    timeOut: 5000,
    extendedTimeOut: 2000,
    enableHtml: true,
  };

protected unidad : ISelectUnidad[] = [];
public unidadesCtrl  : FormControl = new FormControl('', [Validators.required]);
public unidadFiltroCtrl  : FormControl = new FormControl();
public filtroUnidad  : ReplaySubject<ISelectUnidad[]> = new ReplaySubject<ISelectUnidad[]>(1);


@ViewChild('singleSelect', { static: true })
singleSelect!: MatSelect;


  loteFormulario: FormGroup;

  constructor(private router: Router,
    public dialog: MatDialog,
    private formBuilder : FormBuilder,
    private spinner: NgxSpinnerService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdRef : ChangeDetectorRef,
    private loginService: LoginService,
    private dateAdapter: DateAdapter<Date>,
    private AdministradorService : AdministradorService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<EditarLoteComponent>,
    private toast: ToastrService,
    private overlay: Overlay,
     ) {

   this.dateAdapter.setLocale('es-ES');
//------------------------------------------------------------------------------------------------- FORM HORA
  this.loteFormulario = formBuilder.group({
  unidad :  new FormControl('',[Validators.required]),
  fechaInicio: new FormControl(null, { validators: [Validators.required]}),
  fechaFin: new FormControl(null, { validators: [Validators.required]})
});
//------------------------------------------------------------------------------------------------- FORM HORA
    }

    protected _onDestroy = new Subject<void>();
    protected _onDestroyII = new Subject<void>();

  ngOnInit() {

    this.idlote = localStorage.getItem('idlote');
    this.busquedaLote(this.idlote);

    var has : any =  sessionStorage.getItem("hasToken");
    ​var decrypted = CryptoJS.TripleDES.decrypt(has, "CiSecret");
    this.loginService.usuario(decrypted.toString(CryptoJS.enc.Utf8))

    .subscribe(data => {
          this.user = data.usuario;
          this.user.nombres = this.user.nombres.toUpperCase()+ " " +  this.user.apellidos.toUpperCase();
          this.user.apellidos = this.user.apellidos.toUpperCase();
    });

    this.obtenerUnidades();
    this.unidadesCtrl.setValue(this.unidad);
    this.filtroUnidad.next(this.unidad);
    this.unidadFiltroCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filtroUnidadx();
    });
  }

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
      this.unidad.filter(uni => uni.codigounidad.toLowerCase().indexOf(search) > -1)
    );
  }

  async obtenerUnidades(){
    await this.AdministradorService.obtenerUnidades().subscribe(
      (data) =>{
        for (const iterator of data.data) {
          this.unidad.push({codigounidad:  iterator.codUnidad, unidad: iterator.unidad});
        }
      },
      (error) =>{

      }
    );
  }


  //------------------------------------------------------------------------------------------------- DETALLE HORA
async busquedaLote(xvalor:string){
  this.spinner.show("sp1");
  await  this.AdministradorService.consultarLoteDetalle(xvalor).subscribe(
    (data) =>{
      this.loteFormulario.patchValue({
        unidad: data.data.unidad,
        fechaInicio:new Date(this.formatFecha(data.data.fechaInicio)),
        fechaFin:new Date(this.formatFecha(data.data.fechaFin))
      });
      this.spinner.hide("sp1");
    },
    (error) =>{
    }
  );
}

formatFecha(data:any){


  let dia=data.slice(0,2)
  let mes=data.slice(3,5)
  let ano=data.slice(6,10)
  return  mes+"/"+dia+"/"+ano

}
//------------------------------------------------------------------------------------------------- GUARDAR HORA
async changeLote(){
  this.spinner.show("sp1");
  if(this.loteFormulario.valid){
    this.spinner.show("sp1");
    this.loteFormulario.patchValue({
      fechaInicio: moment(this.loteFormulario.value.fechaInicio).format("DD/MM/YYYY"),
      fechaFin: moment(this.loteFormulario.value.fechaFin).format("DD/MM/YYYY"),
      })
    await  this.AdministradorService.ModificarLote(this.loteFormulario.value,this.idlote).subscribe(
      (data) =>{
        console.log('Formulario Lote:::',data)
    if (data.data != undefined){
      this.loteFormulario.value({
        unidad: data.data.unidad,
        fechaInicio: moment(this.loteFormulario.value.fechaInicio).format("DD/MM/YYYY"),
        fechaFin: moment(this.loteFormulario.value.fechaFin).format("DD/MM/YYYY"),
       // fechaFin: data.data.fechaFin,
      });
       } else if(data.code === 1007){
       this.toast.error( "El Registro se encuentra en Uso. Por favor, hacer uso del mismo." , "",this.override);
       } else if  (data.code === 1000) {
        this.toast.success( "El Lote ha sido Modificado con Éxito" , "",this.override);
        this.redirigir();
      }else {
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
//------------------------------------------------------------------------------------------------- OBTENER UNIDADES



ngOnDestroy() {
  this._onDestroy.next();
  this._onDestroy.complete();
  this._onDestroyII.next();
  this._onDestroyII.complete();
  }


  //------------------------------------------------------------------------------------------------- REGRESAR POPUP

  regresar(): void {
    this.execute=true;
     this.dialogRef.close();
    }
    redirigir(){
      this.dialogRef.close();
  }


}
