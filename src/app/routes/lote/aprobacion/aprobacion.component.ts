
import {ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { FormControl, FormGroup, Validators,} from '@angular/forms';
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
import { ConfirmDialogComponent } from 'app/routes/confirm-dialog/confirm-dialog.component';


const ELEMENT_DATA: LotesConsultaAprobacion[] = [];

@Component({
  selector: 'app-aprobacion',
  templateUrl: './aprobacion.component.html',
  styleUrls: ['./aprobacion.component.scss']
})
export class AprobacionComponent implements OnInit {

  user: IusuarioLdap  = {} as IusuarioLdap; // Información de MS INT
  cedulas: IusuarioLdap  = {} as IusuarioLdap; // Información de MS INT
  rol : Irol = {} as Irol;


  displayedColumns: string[] = ['idlote','unidad','fechaInicio','fechaFin','fechacreacion','estadolote','acciones'];
  positionOptions: TooltipPosition[] = ['above'];
  position = new FormControl(this.positionOptions[0]);
  dataSource: MatTableDataSource<LotesConsultaAprobacion>;

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
    private overlay: Overlay,
    private activateRoute:ActivatedRoute )
 {
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
      console.log("la cedula es:: ",decrypted2.toString(CryptoJS.enc.Utf8))
      this.rol.app = environment.app
      this.rol.cedula = decrypted2.toString(CryptoJS.enc.Utf8)
      this.loginService.unmetodo(laurlActual,this.rol)
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
     this.busquedaLote();
    this.spinner.hide("sp1");
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

//------------------------------------------------------------------- CONSULTAR LOTES CON ESTADO X
async busquedaLote(){
  this.spinner.show("sp1");
    await this.AdministradorService.consultarLotesAprobacion().subscribe(
    (data) =>{
      if (data.code != 9999) {
      this.dataSource = new MatTableDataSource(data.data);
      this.ngAfterViewInit();
      this.spinner.hide("sp1");
      }
    },
    (error) =>{
    }
  );
}
//------------------------------------------------------------------- APROBACION LOTES
async AprobarLote(row:any){
  const dialogRef = this.dialog.open(ConfirmDialogComponent,{
    data:{
        message: '¿Estás seguro de aprobar el lote N° ' +  row.idlote + '?' ,
    }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
  if (confirmed) {
    this.spinner.show("sp1");
        // Log de información antes de enviar la solicitud
        console.log("Aprobando lote:", {
          idlote: row.idlote,
          cedula: this.cedulas,
          mensaje: 'Aprobando el lote N° ' + row.idlote
        });
      this.AdministradorService.Aprobar(row.idlote,this.cedulas).subscribe(
        (data) =>{
         // Log de la respuesta del servidor
         console.log("Respuesta del servidor al aprobar el lote:", data);
         if(data.code != 9999 ){
          this.toast.success( "Lote "  +  row.idlote +  " Aprobado con Éxito." , "",this.override);
          this.busquedaLote();
          }else {
            this.toast.error( "Error de Conexión" , "",this.override);
            this.busquedaLote();
          }
        },
        (error) =>{
          // Log de error en caso de fallo en la solicitud
          console.error("Error al aprobar el lote:", error);
        }
        );
  }
  this.spinner.hide("sp1");
    });
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
//------------------------------------------------------------------- Spinner
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

//------------------------------------------------------------------- Validar Fecha

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
