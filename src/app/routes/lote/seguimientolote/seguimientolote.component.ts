
import {ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {  Inject } from '@angular/core';
import { FormControl, FormGroup, Validators,} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { ActivatedRoute, Router, RouterLink, UrlSegment } from '@angular/router';
import { TooltipPosition} from '@angular/material/tooltip';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Irol, LoginService } from 'app/servicios/util/login.service';
import { IusuarioLdap } from 'app/models/usuarioLdap';
import * as CryptoJS from 'crypto-js';
import { NgxSpinnerService } from "ngx-spinner";
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SpinnerComponent } from '../../sessions/login/spinner.component';
import { MatTableDataSource} from '@angular/material/table';
//-------------------------------------------------------------------
import { DateAdapter } from '@angular/material/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { AdministradorService } from 'app/servicios/administrador/administrador.service';
import { LotesConsulta, LotesConsultaAprobacion } from 'app/models/administrador';
import { RegistroLoteComponent } from '../registro-lote/registro-lote.component';
import { EstadoLoteComponent } from '../estado-lote/estado-lote.component';
import { DataSource } from '@angular/cdk/table';
import * as moment from 'moment';
import { DepartamentosService } from 'app/servicios/util/Departamentos.service.';
import { environment } from '@env/environment';
import 'moment/locale/pt-br';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/routes/confirm-dialog/confirm-dialog.component';
import { Loteseguimiento } from 'app/models/administrador';

const ELEMENT_DATA: Loteseguimiento[] = [];

@Component({
  selector: 'app-seguimientolote',
  templateUrl: './seguimientolote.component.html',
  styleUrls: ['./seguimientolote.component.scss']
})
export class SeguimientoloteComponent implements OnInit {

  user: IusuarioLdap  = {} as IusuarioLdap; // Información de MS INT
  cedulas: IusuarioLdap  = {} as IusuarioLdap; // Información de MS INT
  rol : Irol = {} as Irol;

  displayedColumns: string[] = ['idGiomSeguimiento','descripcion','fechaCreacion'];
  positionOptions: TooltipPosition[] = ['above'];
  position = new FormControl(this.positionOptions[0]);
  dataSource: MatTableDataSource<Loteseguimiento>;

  override = {
    positionClass: 'toast-bottom-full-width',
    showDuration: 2000,
    timeOut: 2000,
    extendedTimeOut: 2000,
    closeButton: true,
    enableHtml: true,
  };

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort = new MatSort;
  @ViewChild('container', {read: ViewContainerRef}) container2: any;
  private overlayRef!: OverlayRef;

  idLoteGiom: any;
  idGiomSeguimiento: any;
  descripcion: any;
  fechaCreacion: any;

  constructor(public dialog: MatDialog,
    private router: Router,
    private RouterLink : Router,
    private spinner: NgxSpinnerService,
    private AdministradorService : AdministradorService,
    private dateAdapter: DateAdapter<Date>,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdRef : ChangeDetectorRef,
    private loginService: LoginService,
    private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<SeguimientoloteComponent>,
    private overlay: Overlay,
    private activateRoute:ActivatedRoute )
 {
  this.dateAdapter.setLocale('es-ES');
  this.dataSource = new MatTableDataSource(ELEMENT_DATA);
 }

 protected _onDestroy = new Subject<void>();
 protected _onDestroyII = new Subject<void>();

  ngOnInit(): void {
    this.idLoteGiom = localStorage.getItem('idlote');


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
    this.spinner.show("sp1");
    this.busquedaSeguimiento(this.idLoteGiom);
    this.spinner.hide("sp1");
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async busquedaSeguimiento(xvalor:string){
    this.spinner.show("sp1");
    await  this.AdministradorService.ConsultaLoteSegui(xvalor).subscribe(
      (data) =>{
        this.idLoteGiom= data.data[0].idLoteGiom
        this.idGiomSeguimiento= data.data[0].idGiomSeguimiento
        this.descripcion= data.data[0].descripcion
        this.fechaCreacion = data.data[0].fechaCreacion
        console.log(data.data,"detalles")
        this.dataSource=data.data;
        this.spinner.hide("sp1");
      },
      (error) =>{
      }
    );
  }

//------------------------------------------------------------------- BUSCADOR GENERAL
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
//------------------------------------------------------------------- SPINNER
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

  volverEjecutado:boolean=false;
  regresar(): void {
    this.volverEjecutado=true;
    this.dialogRef.close();
  }

  redirigirSuccess(){
    this.dialogRef.close();
  }
//------------------------------------------------------------------- VALIDAR FECHA
fechaFormat(data: any): string {
  let dia=data.slice(0,2)
  let mes=data.slice(3,5)
  let ano=data.slice(6,10)
  return  mes+"/"+dia+"/"+ano;
}

fechasValidar(row:any){
  let fecha21=Date.parse(this.fechaFormat(moment(new Date()).format("DD/MM/YYYY")))
  let fecha22=Date.parse(this.fechaFormat(row.slice(0,10)))
  if (fecha21 <= fecha22) {
    return "new-row-historial2"
  }else{
    return "new-row-historial"
  }
}
}
