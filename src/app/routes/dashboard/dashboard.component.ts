import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  NgZone,
  HostListener,
} from '@angular/core';
import { SettingsService } from '@core';
import { Subscription } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { UserIdleService } from 'angular-user-idle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from 'app/servicios/util/login.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { TooltipPosition} from '@angular/material/tooltip';
import { MatDialog} from '@angular/material/dialog';
import { NgxSpinnerService } from "ngx-spinner";
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { registros } from 'app/models/empleados';
import { IusuarioLdap } from 'app/models/usuarioLdap';
import { EmpleadoService } from 'app/servicios/empleados/empleado.service';
import { SpinnerComponent } from '../sessions/login/spinner.component';
import {ChangeDetectorRef, VERSION ,  ComponentFactoryResolver, ViewChild, ViewContainerRef} from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { AdministradorService } from 'app/servicios/administrador/administrador.service';
import * as CryptoJS from 'crypto-js';

const ELEMENT_DATA: registros[] = [];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
    `
.mat-raised-button {
  margin-right: 8px;
  margin-top: 8px;
}

.width30{
  margin-top: 5px;
  width: 40% !important;
  margin-bottom: 10px;
}

.row-info{
  background-color: rgb(250, 250, 250);
  display: flex;
  justify-content: center;
  text-align: center ;
  color: #0067b1;
  margin: 0px;
}
.row-data{
    display: flex;
    flex-wrap: wrap;
    margin-right: -8px;
    margin-left: -8px;
    width: 60%;
}

.material-icons {
  font-family: 'Material Icons';
  font-size: 26px;
  line-height: 0;
  font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  margin: 0;
}
.material-icon-2 {
  font-family: 'Material Icons';
  font-size: 24px;
  line-height: 0.8;
  font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  margin: 0;
}
.subtitle {
  font-size: 18px;
  color: #373736;
  font-weight: 600;
  margin-top: -18px;
}
.text-service{
  font-size: 16px;
  color: #373736;
  font-weight: 400;
  margin-top: -10px;
  margin-bottom: 0px;
  text-transform: uppercase!important;
  margin-bottom: 20px;
}
.mat-cell, .mat-footer-cell {
  color: #2e2e2e!important;
  font-family: nunito;
}
::ng-deep .mat-form-field-appearance-outline.mat-focused .mat-form-field-outline-thick {
  color: #0067b1!important;
  opacity: 1!important;
}
:host ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline {
  color: #d1d1d1;
}
::ng-deep .mat-form-field.mat-focused .mat-form-field-label {
  color: #0067b1!important;
  font-size: 14px!important;
  font-family: nunito!important;
}
::ng-deep .mat-select-panel .mat-option.mat-selected:not(.mat-option-multiple) {
  background: #0067b1!important;
  color: white;
  font-family: nunito!important;
}
::ng-deep .mat-primary .mat-option.mat-selected:not(.mat-option-disabled) {
  color: #fff!important;
}


mat-label{
  font-size:16px;
  font-family:nunito;
}
mat-card-subtitle{
  font-size:14px;
  font-family:nunito;
  color: #2e2e2e;
}
p {
  font-family: nunito;
}
.bg-bluebdv{
  padding-top: 5px;
  background-color: #0067b1 ;
  display: flex;
  color: white;
}

.sort-header-content {
  font-size: 12px;
  font-family: nunito;
  color: #0067b1;
}

.right-section{
  display: flex;
  justify-content: end;
  text-align: right;
}

.bg-redbdv{
  padding-top: 5px;
  background-color: #DB0032 ;
  display: flex;
  color: white;
  font-family: nunito;
}
.margen-item{
  margin-top: 25px;
  margin-bottom: 25px;
}

.btn-redbdv{
  background-color: #DB0032;
  color: white;
  font-size: 18px;
  font-family: nunito;
  margin-left: 5px;

  margin-right: 5px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
}
.mat-card-title{
  display: flex;
  color: white;
  font-family: nunito;
  font-size: 18px;
  text-align: left;
  font-size: 14px !important;
}
.card-info-bdv{
  text-align: left;
  font-family: nunito;
}
.text-info-bdv{
  font-family: nunito;
  margin-bottom: 5px;
  margin-top: -5px;
}
.text-data-json {
  color: #2e2e2e;
  font-size: 12px;
  font-family: nunito;
  text-transform: uppercase;
  padding-left: 5px;
  padding-right: 5px;
}
.mat-card .mat-divider-horizontal {
  position: absolute;
  left: 0;
  width: 100%;
  background-color: white;
}
.text-small{
  font-family: nunito;
  font-size:12px;
}
::-webkit-input-placeholder {
  color: #2e2e2e;
  font-size: 14px;
  font-family: nunito;
}
::-moz-placeholder {
  color: #2e2e2e;
  font-size: 14px;
  font-family: nunito;
}
:-ms-input-placeholder {
  color: #2e2e2e;
  font-size: 14px;
  font-family: nunito;
}
::placeholder {
  color: #2e2e2e;
  font-size: 14px;
  font-family: nunito;
}

    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DashboardService],
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
/*--------------------------------REVISAR USUARIOS REGISTRADOS--------------------------------------------------*/
  user: IusuarioLdap  = {} as IusuarioLdap; // Informacion de MSINT

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort = new MatSort;
  @ViewChild('container', {read: ViewContainerRef}) container2: any;
  private overlayRef!: OverlayRef;

  messages = this.dashboardSrv.getMessages();
  stats = this.dashboardSrv.getStats();
  public servicioActivo: any = []; //Variable

  notifySubscription!: Subscription;
  override = {
    positionClass: 'toast-bottom-full-width',
    timeOut: 0,
    extendedTimeOut: 0,
    closeButton: false,
    autoDismiss: false,
    color: "red"


  };

  constructor(
    private ngZone: NgZone,
    private dashboardSrv: DashboardService,
    private settings: SettingsService,
    private userIdle: UserIdleService,
    private _snackBar: MatSnackBar,
    private loginService: LoginService,
    public dialog: MatDialog,
              private EmpleadoService : EmpleadoService,
              private changeDetectorRef: ChangeDetectorRef,
              private spinner: NgxSpinnerService,
              private formBuilder : FormBuilder,
              private componentFactoryResolver: ComponentFactoryResolver,
              private cdRef : ChangeDetectorRef,
              private overlay: Overlay ,
    private AdministradorService :AdministradorService,
    private router: Router
  ) {
  }

  ngOnInit() {
    var has : any =  sessionStorage.getItem("hasToken");
    ​var decrypted = CryptoJS.TripleDES.decrypt(has, "CiSecret");
    this.loginService.usuario(decrypted.toString(CryptoJS.enc.Utf8))
    .subscribe(data => {
          this.user = data.usuario;
          this.user.nombres = this.user.nombres.toLowerCase();
          this.user.apellidos = this.user.apellidos.toLowerCase();
    });
    this.spinner.show("sp1");
    this.show();
    this.notifySubscription = this.settings.notify.subscribe(res => {
    });

this.AdministradorService.busquedaHoras({descriptor :"H"}).subscribe(data => {
    if(data.data && data.data.length > 0) {
      // Filtrar y ordenar los horarios
      this.servicioActivo = data.data
        .filter((element: any) => element.estado == 1)
        .sort((a: any, b: any) => {
          // Convertir horarios a minutos para ordenar
          const toMinutes = (time: string) => {
            if (!time) return 0;
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
          };

          return toMinutes(a.valorConfigurado) - toMinutes(b.valorConfigurado);
        });

      // Opcional: verificar el resultado
      console.log('Horarios ordenados:', this.servicioActivo);
    } else {
      this.servicioActivo = [];
    }
  });
    this.spinner.hide("sp1");
  }



 ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => this.initChart());
      this.setInitialValue();
  }

  ngOnDestroy() {
    this.notifySubscription.unsubscribe();
  }

  protected setInitialValue() {}

  initChart() {}

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

  @HostListener('document:keyup', [])
  @HostListener('document:click', [])
  @HostListener('document:wheel', [])
  @HostListener('document:mousemove', [])
  restart() :void{
    this.userIdle.resetTimer();
  }

async cerrarSesion(){
  var has : any =  sessionStorage.getItem("hasTokenN");
  ​var decrypted = CryptoJS.TripleDES.decrypt(has, "tkcodSecret");
  await this.loginService.cerrarSesion(decrypted.toString(CryptoJS.enc.Utf8)).subscribe(
    (data) => {
        if(data.status == "sucess"){
          sessionStorage.clear();
          this.router.navigateByUrl('/auth/login');
        }else{
          sessionStorage.clear();
          this.router.navigateByUrl('/auth/login');
        }
    });
  }
}

@Component({
  selector: 'snack-bar-component-example-snack',
  templateUrl: 'snack-bar-component.html',
  styleUrls: ['./snack-bar-component.scss']
})
export class PizzaPartyComponent {

  constructor(
    private userIdle: UserIdleService,
    private loginService: LoginService,
    private _snackBar: MatSnackBar,

  ) {}

  async extenderSesion(){
    var has : any =  sessionStorage.getItem("hasTokenN");
    ​var decrypted = CryptoJS.TripleDES.decrypt(has, "tkcodSecret");
    await this.loginService.extenderSesion(decrypted.toString(CryptoJS.enc.Utf8)).subscribe(
      ()=>{
        this._snackBar.dismiss();
        this.userIdle.resetTimer();
      }
    );
  }
}


/*

import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  NgZone,
  HostListener,
} from '@angular/core';
import { SettingsService } from '@core';
import { Subscription } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { UserIdleService } from 'angular-user-idle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from 'app/servicios/util/login.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { TooltipPosition} from '@angular/material/tooltip';
import { MatDialog} from '@angular/material/dialog';
import { NgxSpinnerService } from "ngx-spinner";
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { registros } from 'app/models/empleados';
import { IusuarioLdap } from 'app/models/usuarioLdap';
import { EmpleadoService } from 'app/servicios/empleados/empleado.service';
import { SpinnerComponent } from '../sessions/login/spinner.component';
import {ChangeDetectorRef, VERSION ,  ComponentFactoryResolver, ViewChild, ViewContainerRef} from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { AdministradorService } from 'app/servicios/administrador/administrador.service';
import * as CryptoJS from 'crypto-js';
import { filter } from 'rxjs/operators';
import { SessionTimeoutDialogComponentComponent } from '../session-timeout-dialog-component/session-timeout-dialog-component.component';
import { timer, interval } from 'rxjs';

const ELEMENT_DATA: registros[] = [];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
    `
.mat-raised-button {
  margin-right: 8px;
  margin-top: 8px;
}

.width30{
  margin-top: 5px;
  width: 40% !important;
  margin-bottom: 10px;
}

.row-info{
  background-color: rgb(250, 250, 250);
  display: flex;
  justify-content: center;
  text-align: center ;
  color: #0067b1;
  margin: 0px;
}
.row-data{
    display: flex;
    flex-wrap: wrap;
    margin-right: -8px;
    margin-left: -8px;
    width: 60%;
}

.material-icons {
  font-family: 'Material Icons';
  font-size: 26px;
  line-height: 0;
  font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  margin: 0;
}
.material-icon-2 {
  font-family: 'Material Icons';
  font-size: 24px;
  line-height: 0.8;
  font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  margin: 0;
}
.subtitle {
  font-size: 18px;
  color: #373736;
  font-weight: 600;
  margin-top: -18px;
}
.text-service{
  font-size: 16px;
  color: #373736;
  font-weight: 400;
  margin-top: -10px;
  margin-bottom: 0px;
  text-transform: uppercase!important;
  margin-bottom: 20px;
}
.mat-cell, .mat-footer-cell {
  color: #2e2e2e!important;
  font-family: nunito;
}
::ng-deep .mat-form-field-appearance-outline.mat-focused .mat-form-field-outline-thick {
  color: #0067b1!important;
  opacity: 1!important;
}
:host ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline {
  color: #d1d1d1;
}
::ng-deep .mat-form-field.mat-focused .mat-form-field-label {
  color: #0067b1!important;
  font-size: 14px!important;
  font-family: nunito!important;
}
::ng-deep .mat-select-panel .mat-option.mat-selected:not(.mat-option-multiple) {
  background: #0067b1!important;
  color: white;
  font-family: nunito!important;
}
::ng-deep .mat-primary .mat-option.mat-selected:not(.mat-option-disabled) {
  color: #fff!important;
}


mat-label{
  font-size:16px;
  font-family:nunito;
}
mat-card-subtitle{
  font-size:14px;
  font-family:nunito;
  color: #2e2e2e;
}
p {
  font-family: nunito;
}
.bg-bluebdv{
  padding-top: 5px;
  background-color: #0067b1 ;
  display: flex;
  color: white;
}

.sort-header-content {
  font-size: 12px;
  font-family: nunito;
  color: #0067b1;
}

.right-section{
  display: flex;
  justify-content: end;
  text-align: right;
}

.bg-redbdv{
  padding-top: 5px;
  background-color: #DB0032 ;
  display: flex;
  color: white;
  font-family: nunito;
}
.margen-item{
  margin-top: 25px;
  margin-bottom: 25px;
}

.btn-redbdv{
  background-color: #DB0032;
  color: white;
  font-size: 18px;
  font-family: nunito;
  margin-left: 5px;

  margin-right: 5px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
}
.mat-card-title{
  display: flex;
  color: white;
  font-family: nunito;
  font-size: 18px;
  text-align: left;
  font-size: 14px !important;
}
.card-info-bdv{
  text-align: left;
  font-family: nunito;
}
.text-info-bdv{
  font-family: nunito;
  margin-bottom: 5px;
  margin-top: -5px;
}
.text-data-json {
  color: #2e2e2e;
  font-size: 12px;
  font-family: nunito;
  text-transform: uppercase;
  padding-left: 5px;
  padding-right: 5px;
}
.mat-card .mat-divider-horizontal {
  position: absolute;
  left: 0;
  width: 100%;
  background-color: white;
}
.text-small{
  font-family: nunito;
  font-size:12px;
}
::-webkit-input-placeholder {
  color: #2e2e2e;
  font-size: 14px;
  font-family: nunito;
}
::-moz-placeholder {
  color: #2e2e2e;
  font-size: 14px;
  font-family: nunito;
}
:-ms-input-placeholder {
  color: #2e2e2e;
  font-size: 14px;
  font-family: nunito;
}
::placeholder {
  color: #2e2e2e;
  font-size: 14px;
  font-family: nunito;
}

    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DashboardService],
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
user: IusuarioLdap  = {} as IusuarioLdap; // Informacion de MSINT
private lastActivityTime = Date.now();

@ViewChild(MatPaginator) paginator: MatPaginator | any;
@ViewChild(MatSort) sort: MatSort = new MatSort;
@ViewChild('container', {read: ViewContainerRef}) container2: any;
private overlayRef!: OverlayRef;

messages = this.dashboardSrv.getMessages();
stats = this.dashboardSrv.getStats();
public servicioActivo: any = []; //Variable

notifySubscription!: Subscription;
override = {
  positionClass: 'toast-bottom-full-width',
  timeOut: 0,
  extendedTimeOut: 0,
  closeButton: false,
  autoDismiss: false,
  color: "red"


};

private sessionTimerSub!: Subscription;
private countdownSub!: Subscription;
private readonly SESSION_TIMEOUT = 120000; // 2 minutos en milisegundos

constructor(
  private ngZone: NgZone,
  private dashboardSrv: DashboardService,
  private settings: SettingsService,
  private _snackBar: MatSnackBar,
  private loginService: LoginService,
  public dialog: MatDialog,
            private EmpleadoService : EmpleadoService,
            private changeDetectorRef: ChangeDetectorRef,
            private spinner: NgxSpinnerService,
            private formBuilder : FormBuilder,
            private componentFactoryResolver: ComponentFactoryResolver,
            private cdRef : ChangeDetectorRef,
            private overlay: Overlay ,
  private AdministradorService :AdministradorService,
  private router: Router
) {
}

ngOnInit() {
  if (this.isAuthenticated()) {
    this.setupActivityListeners();
    this.startSessionTimer();

  var has : any =  sessionStorage.getItem("hasToken");
  ​var decrypted = CryptoJS.TripleDES.decrypt(has, "CiSecret");

  this.loginService.usuario(decrypted.toString(CryptoJS.enc.Utf8))    .subscribe(data => {
    this.user = data.usuario;
    this.user.nombres = this.user.nombres.toLowerCase();
    this.user.apellidos = this.user.apellidos.toLowerCase();
});
this.spinner.show("sp1");
this.show();
this.notifySubscription = this.settings.notify.subscribe(res => {
});
this.AdministradorService.busquedaHoras({descriptor :"H"}).subscribe(data =>{
if(data.data[0] != undefined){
  data.data.forEach((element:any) => {
    if (element.estado == 1) {
      this.servicioActivo.push(element);
    }
   // console.log(this.servicioActivo, "aqui::::")
  });
}
});

this.spinner.hide("sp1");

  } else {
    sessionStorage.clear();
        this.removeActivityListeners();   // <- Añadir esto
        this.stopSessionTimer();
    this.router.navigateByUrl('/auth/login'); // Redirigir si no hay sesión
  }

}

private isAuthenticated(): boolean {
  return !!sessionStorage.getItem('hasToken'); // Verifica si existe un token
}

private boundHandleUserActivity: any; // Referencia para remover listeners

private setupActivityListeners(): void {
  this.boundHandleUserActivity = this.handleUserActivity.bind(this);
  const events = ['mousemove', 'keydown', 'click', 'scroll'];
  events.forEach(event => {
    document.addEventListener(event, this.boundHandleUserActivity);
  });
}

private removeActivityListeners(): void {
  const events = ['mousemove', 'keydown', 'click', 'scroll'];
  events.forEach(event => {
    // Usar la referencia guardada (boundHandleUserActivity)
    document.removeEventListener(event, this.boundHandleUserActivity);
  });
}


private handleUserActivity(): void {
  const now = Date.now();
  const timeSinceLastActivity = now - this.lastActivityTime;

  // Reiniciar solo si ha pasado al menos 1 segundo desde la última actividad
  if (timeSinceLastActivity > 1000) {
    console.log('Actividad detectada - Reiniciando temporizador');
    this.lastActivityTime = now;
    this.startSessionTimer();
  }
}


private startSessionTimer(): void {
  this.stopSessionTimer();

  const startTime = Date.now();
  const endTime = startTime + this.SESSION_TIMEOUT;

  this.countdownSub = interval(1000).subscribe(() => {
    const remaining = Math.max(0, endTime - Date.now());
    console.log(`Tiempo restante: ${Math.floor(remaining / 1000)} segundos`);
  });

  this.sessionTimerSub = timer(this.SESSION_TIMEOUT).subscribe(() => {
    this.showSessionDialog();
  });
}

private stopSessionTimer(): void {
  if (this.sessionTimerSub) {
    this.sessionTimerSub.unsubscribe();
  }
  if (this.countdownSub) {
    this.countdownSub.unsubscribe();
  }
}

ngOnDestroy() {
this.removeActivityListeners();
this.stopSessionTimer();

if (this.notifySubscription) {
  this.notifySubscription.unsubscribe();
}
}

private showSessionDialog(): void {
  const dialogRef = this.dialog.open(SessionTimeoutDialogComponentComponent, {
    disableClose: true,
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 'extend') {
      this.startSessionTimer(); // Reiniciar el temporizador
    } else {
      this.cerrarSesion();
    }
  });
}






ngAfterViewInit() {
  this.ngZone.runOutsideAngular(() => this.initChart());
    this.setInitialValue();
}

protected setInitialValue() {}

initChart() {}

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

async cerrarSesion(){
var has : any =  sessionStorage.getItem("hasTokenN");
​var decrypted = CryptoJS.TripleDES.decrypt(has, "tkcodSecret");
await this.loginService.cerrarSesion(decrypted.toString(CryptoJS.enc.Utf8)).subscribe(
  (data) => {
      if(data.status == "sucess"){
        sessionStorage.clear();
        this.removeActivityListeners();   // <- Añadir esto
        this.stopSessionTimer();          // <- Añadir esto
        this.router.navigateByUrl('/auth/login');
      }else{
        sessionStorage.clear();
        this.removeActivityListeners();   // <- Añadir esto
        this.stopSessionTimer();          // <- Añadir esto
        this.router.navigateByUrl('/auth/login');
      }
  });
}
}

@Component({
selector: 'snack-bar-component-example-snack',
templateUrl: 'snack-bar-component.html',
styleUrls: ['./snack-bar-component.scss']
})
export class PizzaPartyComponent {

constructor(
  private userIdle: UserIdleService,
  private loginService: LoginService,
  private _snackBar: MatSnackBar,

) {}

async extenderSesion(){
  var has : any =  sessionStorage.getItem("hasTokenN");
  ​var decrypted = CryptoJS.TripleDES.decrypt(has, "tkcodSecret");
  await this.loginService.extenderSesion(decrypted.toString(CryptoJS.enc.Utf8)).subscribe(
    ()=>{
      this._snackBar.dismiss();
      this.userIdle.resetTimer();
    }
  );
}
}

*/
