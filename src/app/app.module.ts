//import {ClipboardModule} from '@angular/cdk/clipboard';
import { NgModule,  CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";
import { AppComponent } from './app.component';
/*----------------------------------------------------------------------------------------------------------------------------*/
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule } from '@angular/material/dialog';
/*----------------------------------------------------------------------------------------------------------------------------*/
import { CoreModule } from '@core/core.module';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@shared/shared.module';
import { RoutesModule } from './routes/routes.module';
import { FormlyConfigModule } from './formly-config.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '@env/environment';
import { BASE_URL,  appInitializerProviders } from '@core';
import { UserIdleModule } from 'angular-user-idle';
import { SpinnerComponent } from './routes/sessions/login/spinner.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RolMenuService } from './servicios/util/rolMenu.service';




export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export function TranslateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    MatInputModule,
  //ClipboardModule,
    MatDatepickerModule,
    MomentDateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    HttpClientModule,
    CoreModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    ThemeModule,
    RoutesModule,
    SharedModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,



    FormlyConfigModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateHttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

    UserIdleModule.forRoot({ idle: 3000, timeout: 0, ping: 0 })
  ],
  exports: [NgxSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
 //  providers: [{provide: LocationStrategy, useClass: RoutesModule}],
 providers: [
  { provide: BASE_URL, useValue: environment.baseUrl },
  //{ provide: APP_BASE_HREF, useValue: environment.baseUrl },
  {
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  },
  {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  appInitializerProviders,
  RolMenuService
],
entryComponents:[
  SpinnerComponent
],
  bootstrap: [AppComponent],
})
export class AppModule {}
