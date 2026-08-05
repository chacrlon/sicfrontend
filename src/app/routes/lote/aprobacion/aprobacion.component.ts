import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Irol, LoginService } from 'app/servicios/util/login.service';
import { IusuarioLdap } from 'app/models/usuarioLdap';
import * as CryptoJS from 'crypto-js';
import { NgxSpinnerService } from 'ngx-spinner';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SpinnerComponent } from '../../sessions/login/spinner.component';
import { MatTableDataSource } from '@angular/material/table';
import { DateAdapter } from '@angular/material/core';
import { AdministradorService } from 'app/servicios/administrador/administrador.service';
import { LotesConsultaAprobacion } from 'app/models/administrador';
import * as moment from 'moment';
import { environment } from '@env/environment';
import { ConfirmDialogComponent } from 'app/routes/confirm-dialog/confirm-dialog.component';

const ELEMENT_DATA: LotesConsultaAprobacion[] = [];

@Component({
  selector: 'app-aprobacion',
  templateUrl: './aprobacion.component.html',
  styleUrls: ['./aprobacion.component.scss']
})
export class AprobacionComponent implements OnInit {

  user: IusuarioLdap = {} as IusuarioLdap;
  cedulas: IusuarioLdap = {} as IusuarioLdap;
  rol: Irol = {} as Irol;

  // Columnas ajustadas según el nuevo diseño
  displayedColumns: string[] = [
    'idlote', 'nombrearchivo', 'montoTotal', 'totalRegistros',
    'rangoFechas', 'unidad', 'fechacreacion', 'estadolote', 'acciones'
  ];

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
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild('container', { read: ViewContainerRef }) container2: any;
  private overlayRef!: OverlayRef;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private spinner: NgxSpinnerService,
    private administradorService: AdministradorService,
    private dateAdapter: DateAdapter<Date>,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdRef: ChangeDetectorRef,
    private loginService: LoginService,
    private toast: ToastrService,
    private overlay: Overlay,
    private activateRoute: ActivatedRoute
  ) {
    this.dateAdapter.setLocale('es-ES');
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  protected _onDestroy = new Subject<void>();
  protected _onDestroyII = new Subject<void>();

  ngOnInit(): void {
  let laurlActual = '';
  this.activateRoute.url.subscribe(url => (laurlActual = url[0].path));

  const verifi2 = sessionStorage.getItem('hasToken');
  if (verifi2) {
    const decrypted2 = CryptoJS.TripleDES.decrypt(verifi2, 'CiSecret');
    this.rol.app = environment.app;
    this.rol.cedula = decrypted2.toString(CryptoJS.enc.Utf8);
    this.loginService.unmetodo(laurlActual, this.rol);
  }

  const has = sessionStorage.getItem('hasToken');
  if (has) {
    const decrypted = CryptoJS.TripleDES.decrypt(has, 'CiSecret');
    this.loginService.usuario(decrypted.toString(CryptoJS.enc.Utf8)).subscribe(data => {
      this.user = data.usuario;
      this.user.nombres = this.user.nombres.toUpperCase() + ' ' + this.user.apellidos.toUpperCase();
      this.user.apellidos = this.user.apellidos.toUpperCase();
      this.cedulas = data.usuario.cedula;
    });
  }

  this.spinner.show('sp1');
  this.busquedaLote();
  this.spinner.hide('sp1');
}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Consulta lotes con estado 'X'
  busquedaLote() {
  this.spinner.show('sp1');
  this.administradorService.consultarLotesAprobacion().subscribe(
    (data) => {
      console.log('📦 Respuesta completa del backend:', data); // 👈 Log del objeto completo

      if (data.code === 1000 && Array.isArray(data.data) && data.data.length > 0) {
        // Transformar los datos: dividir montoTotal entre 100
        const datosTransformados = data.data.map((item: any) => ({
          ...item,
          montoTotal: Number(item.montoTotal) / 100  // Asegurar que es número
        }));

        console.log('✅ Datos transformados:', datosTransformados);
        this.dataSource.data = datosTransformados;  // Mantener la misma instancia
        this.ngAfterViewInit(); // Reasignar paginator y sort
      } else {
        console.warn('⚠️ No hay datos válidos para transformar:', data);
        // Si no hay datos, limpiar la tabla
        this.dataSource.data = [];
      }
      this.spinner.hide('sp1');
    },
    (error) => {
      console.error('❌ Error en la consulta:', error);
      this.spinner.hide('sp1');
    }
  );
}

  // Confirmación de aprobación con datos detallados
  confirmarAprobacion(row: any) {
    const mensaje = `¿Está seguro de aprobar el lote N° ${row.idlote}?
                     ${row.nombrearchivo}
                     Monto: ${this.formatCurrency(row.montoTotal)}
                     Registros: ${row.totalRegistros}`;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: mensaje, buttonText: { ok: 'Aprobar', cancel: 'Cancelar' } }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) this.aprobarLote(row);
    });
  }

  // Confirmación de rechazo
  confirmarRechazo(row: any) {
    const mensaje = `¿Está seguro de RECHAZAR el lote N° ${row.idlote}?
                     Esta acción cancelará permanentemente el lote.`;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: mensaje, buttonText: { ok: 'Rechazar', cancel: 'Volver' } }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) this.rechazarLote(row);
    });
  }

  // Llamada al servicio de aprobación
  aprobarLote(row: any) {
  this.spinner.show('sp1');
  this.administradorService.Aprobar(row.idlote, this.user.codigo).subscribe({
    next: (data) => {
      if (data.code === 1000) {
        this.toast.success(`Lote ${row.idlote} aprobado correctamente`);
        this.busquedaLote();
      } else {
        this.toast.error(data.message);
      }
      this.spinner.hide('sp1');
    },
    error: () => {
      this.toast.error('Error al aprobar');
      this.spinner.hide('sp1');
    }
  });
}

rechazarLote(row: any) {
  this.spinner.show('sp1');
  this.administradorService.rechazarLote(row.idlote, this.user.codigo).subscribe({
    next: (data) => {
      if (data.code === 1000) {
        this.toast.success(`Lote ${row.idlote} rechazado`);
        this.busquedaLote();
      } else {
        this.toast.error(data.message);
      }
      this.spinner.hide('sp1');
    },
    error: () => {
      this.toast.error('Error al rechazar');
      this.spinner.hide('sp1');
    }
  });
}

  // Formateador de moneda
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(value || 0);
  }

  // Buscador general
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Spinner overlay (no es necesario pero se conserva)
  public show(message = '') {
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create();
    }
    const spinnerOverlayPortal = new ComponentPortal(SpinnerComponent);
    this.overlayRef.attach(spinnerOverlayPortal);
  }

  public hide() {
    if (!!this.overlayRef) {
      this.overlayRef.detach();
    }
  }

  // Métodos auxiliares (pueden conservarse o eliminarse si no se usan)
  fechaFormat(data: any): string {
    let dia = data.slice(0, 2);
    let mes = data.slice(3, 5);
    let ano = data.slice(6, 10);
    return mes + '/' + dia + '/' + ano;
  }

  fechasValidar(row: any) {
    let fecha21 = Date.parse(this.fechaFormat(moment(new Date()).format('DD/MM/YYYY')));
    let fecha22 = Date.parse(this.fechaFormat(row.slice(0, 10)));
    if (fecha21 <= fecha22) {
      return 'new-row-historial2';
    } else {
      return 'new-row-historial';
    }
  }
}
