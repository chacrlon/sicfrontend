import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';

import { AdminLayoutComponent } from '@theme/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '@theme/auth-layout/auth-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';
import { Error403Component } from './sessions/403.component';
import { AuthGuard } from '@core/authentication';
/*------------------------------------NUEVOS COMPONENTES-------------------------------------------------------*/
import { DescargarComponent } from './descargar/descargar.component';
//import { DescargarComponent } from './descargar/descargar.component';
import { AuditoriaComponent } from './auditoria/auditoria.component';
//import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
//----------------------------------------------------------------------------------------------- PAGINAS EJECUTADAS
import { EstadoLoteComponent } from './lote/estado-lote/estado-lote.component';
import { RegistroLoteComponent } from './lote/registro-lote/registro-lote.component';
import { LoteComponent } from './lote/lote.component';
import { BusquedaRegistrosComponent } from './lote/busqueda-registros/busqueda-registros.component';
import { CargarLoteComponent } from './lote/cargar-lote/cargar-lote.component';
import { HorarioLoteComponent } from './lote/horario-lote/horario-lote.component';
import { AprobacionComponent } from './lote/aprobacion/aprobacion.component';
import { ActivosComponent } from './activos/activos.component';
import { MorososComponent } from './morosos/morosos.component';
import { CobradoresComponent } from './cobradores/cobradores.component';
import { Estadistica1Component } from './estadistica1/estadistica1.component'; // Ruta Estadistica 1
import { Estadistica2Component } from './estadistica2/estadistica2.component'; // Ruta Estadistica 2
// AÑADE ESTAS IMPORTACIONES PARA CONFIGURACIONES
import { ConfiguracionListComponent } from './configuracion-list/configuracion-list.component';
import { AddConfiguracionComponent } from './add-configuracion/add-configuracion.component';
import { ConfiguracionDetailsComponent } from './configuracion-details/configuracion-details.component';
import { BitacoraComponent } from './bitacora/bitacora.component';


const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
/*-------------------------------------------------NUEVAS RUTAS-------------------------------------------------------*/
      { path: 'dashboard', component: DashboardComponent },
      { path: 'DESCARGALOG', component: DescargarComponent },
      { path: 'auditoria', component: AuditoriaComponent },
      { path: 'bitacora', component: BitacoraComponent },
/*-------------------------------------------------------------------------------------------------------------------*/
      { path: 'lote', component: LoteComponent },
      { path: 'activos', component: ActivosComponent },
      { path: 'morosos', component: MorososComponent },
      { path: 'cobradores', component: CobradoresComponent },
      { path: 'estadistica1', component: Estadistica1Component },
      { path: 'estadistica2', component: Estadistica2Component },
      { path: 'registro-lote', component: RegistroLoteComponent },
      { path: 'estado-lote', component: EstadoLoteComponent },
      { path: 'busqueda-registro', component: BusquedaRegistrosComponent },
      { path: 'cargar-lote', component: CargarLoteComponent },
      { path: 'horario-lote', component: HorarioLoteComponent },
      { path: 'aprobacion-lote', component: AprobacionComponent },
      { path: '', component: ConfiguracionListComponent },
      { path: 'add', component: AddConfiguracionComponent },
      { path: 'editar/:id', component: ConfiguracionDetailsComponent },
/*-------------------------------------------------------------------------------------------------------------------*/
      { path: '404', component: Error403Component },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: 'permissions',
        loadChildren: () =>
          import('./permissions/permissions.module').then(m => m.PermissionsModule),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      // { path: 'descargar', component: DescargarComponent },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      relativeLinkResolution: 'legacy',
    }),
  ],
 //providers: [ {provide: LocationStrategy, useClass: PathLocationStrategy} ], //comentarlo

  exports: [RouterModule],

})

// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule,
//     RouterModule.forRoot(routes),
//   ],
//   exports: [ RouterModule ]
// })

export class RoutesRoutingModule {}
