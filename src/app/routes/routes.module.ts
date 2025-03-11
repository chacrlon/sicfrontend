import { NgModule,  CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RoutesRoutingModule } from './routes-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';
import { Error403Component } from './sessions/403.component';
import { SpinnerComponent } from './sessions/login/spinner.component';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DescargarComponent } from './descargar/descargar.component';
import { AuditoriaComponent } from './auditoria/auditoria.component';
import { DialogUploadComponent } from './dialog-upload/dialog-upload.component';
import { DialogShowComponent } from './dialog-show/dialog-show.component';

//-----------------------------------------------------------------------------------------------
import { EstadoLoteComponent } from './lote/estado-lote/estado-lote.component';
import { RegistroLoteComponent } from './lote/registro-lote/registro-lote.component';
import { LoteComponent } from './lote/lote.component';

import { MatCardModule } from '@angular/material/card';
import { EstadisticasLotesComponent } from './lote/estadisticas-lotes/estadisticas-lotes.component';
import { BusquedaRegistrosComponent } from './lote/busqueda-registros/busqueda-registros.component';
import { CargarLoteComponent } from './lote/cargar-lote/cargar-lote.component';
import { HorarioLoteComponent } from './lote/horario-lote/horario-lote.component';
import { HorarioEditarLoteComponent } from './lote/horario-lote/horario-editar-lote/horario-editar-lote.component';
import { HorarioCrearLoteComponent } from './lote/horario-lote/horario-crear-lote/horario-crear-lote.component';
import { EditarLoteComponent } from './lote/editar-lote/editar-lote.component';
import { AprobacionComponent } from './lote/aprobacion/aprobacion.component';
//import { SeguimientoLoteComponent } from './seguimiento-lote/seguimiento-lote.component'; SeguimientoLoteComponent,
import { SeguimientoloteComponent } from './lote/seguimientolote/seguimientolote.component';
import { ActivosComponent } from './activos/activos.component';
import { ActivosService } from './activos/activos.service';
import { HttpClientModule } from '@angular/common/http';
import { MorososComponent } from './morosos/morosos.component';
import { CobradoresComponent } from './cobradores/cobradores.component';
import { ModalComponentComponent } from './modal-component/modal-component.component';
import { ModalCobradoresComponentComponent } from './cobradores/modal-cobradores-component/modal-cobradores-component.component';
import { ModalInsertarCobradorComponent } from './cobradores/modal-insertar-cobrador/modal-insertar-cobrador.component';
import { Estadistica1Component } from './estadistica1/estadistica1.component';
import { Estadistica2Component } from './estadistica2/estadistica2.component';
import { FormatDatePipe } from './format-date.pipe';
import { EstadoLoteReprocesadoComponent } from './lote/estado-lote-reprocesado/estado-lote-reprocesado.component'; // Nueva importación



const COMPONENTS: any[] = [
  DashboardComponent,
  LoginComponent,
  RegisterComponent,
  Error403Component,
];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [SharedModule, MatCardModule, RoutesRoutingModule, BrowserAnimationsModule, NgxSpinnerModule, BrowserModule, FormsModule, MatDialogModule ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC, SpinnerComponent,ConfirmDialogComponent, DescargarComponent, AuditoriaComponent,
    DialogUploadComponent, DialogShowComponent,EstadoLoteComponent, RegistroLoteComponent, LoteComponent, EstadisticasLotesComponent,
    BusquedaRegistrosComponent, CargarLoteComponent, HorarioLoteComponent, HorarioEditarLoteComponent, HorarioCrearLoteComponent, EditarLoteComponent,
    AprobacionComponent,  SeguimientoloteComponent, ActivosComponent, MorososComponent, CobradoresComponent, ModalComponentComponent, ModalCobradoresComponentComponent, ModalInsertarCobradorComponent, Estadistica1Component, Estadistica2Component, FormatDatePipe, EstadoLoteReprocesadoComponent],
  entryComponents:[
    SpinnerComponent,
    ConfirmDialogComponent,
  ],
})
export class RoutesModule {}
